/**
 * @fileoverview Rule to disallow mutable objects in ModulaJS Model class
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
      'disallow mutable object types as properties for ModulaJS Models',
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

module.exports = function(context) {
  let isModelFlag = false;

  /*
  * Checks if node is `propTypes` declaration
  * @param {ASTNode} node The AST node being checked
  * @returns {boolean} True if node is `propTypes` declaration, false if not
  */
  function isPropTypesDeclaration(node) {
    return Boolean(node && node.name === 'propTypes');
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
    return `Please use ${alternative} instead of PropTypes.${target} when defining "propTypes" in Model`;
  }

  return {
    CallExpression: function(node) {
      if (isCreateModel(node)) {
        isModelFlag = true;
      }
    },

    'CallExpression:exit': function(node) {
      if (isCreateModel(node)) {
        isModelFlag = false;
      }
    },

    ObjectExpression: function(node) {
      node.properties.forEach(function(property) {
        if (!property.key) {
          return;
        }

        if (!isPropTypesDeclaration(property.key)) {
          return;
        }
        if (property.value.type === 'ObjectExpression') {
          checkForbidden(
            property.value.properties,
            context,
            isModelFlag,
            getMessage
          );
        }
      });
    }
  };
};
