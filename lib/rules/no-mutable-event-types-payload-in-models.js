/**
 * @fileoverview Rule to disallow mutable objects in eventTypes/watchEventTypes payload defination
 */

const checkForbidden = require('../utils/immutable-checker.js');

const ALTERNATIVES = {
  array: 'list',
  object: 'map',
  arrayOf: 'listOf',
  objectOf: 'mapOf',
  shape: 'contains/mapContains'
};

// -----------------------------------------------------------------------------
// Rule Definition
// -----------------------------------------------------------------------------

module.exports.meta = {
  docs: {
    description:
      'disallow mutable objects in eventTypes/watchEventTypes payload defination',
    category: 'Best Practices',
    recommended: false
  }
};

module.exports.schema = [
  {
    type: 'array',
    items: {
      type: 'string'
    },
    additionalProperties: false
  }
];

module.exports = function (context) {
  let isModelFlag = false;
  let isEventTypesFlag = false;

  /*
   * Checks if node is the target declaration which specified by `targetName`
   * @param {ASTNode} node The AST node being checked
   * @param {string} the name of target declaration
   * @returns {boolean} True if node name matches `targetName`, false if not
   */
  function isTargetDeclaration(node, targetName) {
    return Boolean(node && node.name === targetName);
  }

  /*
   * Checks if node is an instance of the ModulaJS Model class
   * @param {ASTNode} node The AST node being checked
   * @returns {boolean} True is node is a Model, false is not
   */
  function isCreateModel(node) {
    return Boolean(node.callee && node.callee.name === 'createModel');
  }

  function getMessage(target) {
    let alternative = 'immutable properties';
    if (ALTERNATIVES[target]) {
      alternative = `ImmutablePropTypes.${ALTERNATIVES[target]}`;
    }
    return `Please use ${alternative} instead of PropTypes.${target} when defining "eventTypes/watchEventTypes" in Model`;
  }

  return {
    CallExpression(node) {
      if (isCreateModel(node)) {
        isModelFlag = true;
      }
    },

    'CallExpression:exit': function (node) {
      if (isCreateModel(node)) {
        isModelFlag = false;
      }
    },

    ObjectExpression(node) {
      if (!isModelFlag) {
        return;
      }

      node.properties.forEach(property => {
        if (
          isTargetDeclaration(property.key, 'eventTypes') ||
          isTargetDeclaration(property.key, 'watchEventTypes')
        ) {
          isEventTypesFlag = true;
        }

        if (isEventTypesFlag && isTargetDeclaration(property.key, 'payload')) {
          checkForbidden(
            property.value.properties,
            context,
            isModelFlag,
            getMessage
          );
        }
      });
    },

    'ObjectExpression:exit': function (node) {
      if (!isModelFlag) {
        return;
      }

      node.properties.forEach(property => {
        if (
          isTargetDeclaration(property.key, 'eventTypes') ||
          isTargetDeclaration(property.key, 'watchEventTypes')
        ) {
          isEventTypesFlag = false;
        }
      });
    }
  };
};
