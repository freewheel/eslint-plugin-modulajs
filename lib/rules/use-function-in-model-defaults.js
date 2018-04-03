/**
 * @fileoverview Rule to ensure using function to define defaults of non-primitive Model prop
 */

// -----------------------------------------------------------------------------
// Rule Definition
// -----------------------------------------------------------------------------

module.exports.meta = {
  docs: {
    description:
      'Use function to define default values for non-primitive props in ModulaJS model',
    category: 'Possible Errors',
    recommended: false
  }
};

/**
 * Checks if node is an instance of the ModulaJS Model class
 * @param {ASTNode} node The AST node being checked
 * @returns {boolean} True is node is a Model, false is not
 */
function isCreateModel(node) {
  return Boolean(node.callee && node.callee.name === 'createModel');
}

/**
 * Checks if node is `propTypes` declaration
 * @param {ASTNode} node The AST node being checked
 * @returns {boolean} True if node is `propTypes` declaration, false if not
 */
function isDefaultsDeclaration(node) {
  return Boolean(node && node.name === 'defaults');
}

/**
 * Check if the node is either a primitive value or a function
 * @param {any} node The AST node being checked
 * @returns {boolean} True if node is either a primitive value or a function, false if not
 */
function isPermittedValue(node) {
  return (
    node.type === 'Literal' ||
    (node.type === 'UnaryExpression' &&
      node.operator === '-' &&
      node.prefix &&
      node.argument &&
      node.argument.type === 'Literal' &&
      !isNaN(node.argument.value)) || // negative number
    (node.type === 'Identifier' && node.name === 'undefined') ||
    (node.type === 'Identifier' && node.name === 'NaN') ||
    (node.type === 'Identifier' && node.name === 'Infinity') ||
    node.type === 'FunctionExpression' ||
    node.type === 'ArrowFunctionExpression' ||
    node.type === 'Identifier' // variable reference
  );
}

/**
 * Checks if propTypes declarations are forbidden
 * @param {Array} declarations The array of AST nodes being checked.
 * @returns {void}
 */
function checkDefaults(declarations, context) {
  declarations.forEach(function(declaration) {
    if (
      declaration.type === 'Property' &&
      !isPermittedValue(declaration.value)
    ) {
      context.report({
        node: declaration,
        message:
          'Please use function to define non-primitive default values in Model'
      });
    }
  });
}

module.exports = function(context) {
  let isModelFlag = false;

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
      if (!isModelFlag) {
        return;
      }

      node.properties.forEach(function(property) {
        if (!property.key || !isDefaultsDeclaration(property.key)) {
          return;
        }

        if (property.value.type === 'ObjectExpression') {
          checkDefaults(property.value.properties, context);
        }
      });
    }
  };
};
