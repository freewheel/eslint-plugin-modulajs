/**
 * @fileoverview Rule to check that only string literals or template literals (without expressions)
 * are provided to Gettext family functions
 */

const includes = require('lodash').includes;

const gettextFamily = [
  '_', 'n_', 'd_', 'dn_',
  'gettext', 'ngettext', 'dgettext', 'dngettext',
  'c_', 'cn_', 'cd_', 'cdn_',
  'cgettext', 'cngettext', 'cdgettext', 'cdngettext'
];

// -----------------------------------------------------------------------------
// Rule Definition
// -----------------------------------------------------------------------------

module.exports.meta = {
  docs: {
    description: 'allow only string/template literals in gettext family functions',
    category: 'Possible Errors',
    recommended: true
  }
};

module.exports.schema = [{
  type: 'object',
  properties: {},
  additionalProperties: false
}];

module.exports = function (context) {
  /*
  * Checks if CallExpression callee type is Identifier and callee name is in Gettext family
  * @param {ASTNode} node The AST node being checked
  * @returns {boolean} True if node matches conditions of gettext family function
  */
  function isGettextCall(node) {
    return Boolean(
      node.callee.type === 'Identifier' &&
        includes(gettextFamily, node.callee.name)
    );
  }

  /*
  * Checks whether a given node is a String Literal
  * @param {ASTNode} node The AST node being checked
  * @returns {boolean} True if node type is Literal
  */
  function isStringLiteral(node) {
    return Boolean(node.type === 'Literal');
  }

  /*
  * Checks whether a given node is a TemplateLiteral
  * @param {ASTNode} node The AST node being checked
  * @returns {boolean} True if node type is TemplateLiteral
  */
  function isTemplateLiteral(node) {
    return Boolean(node.type === 'TemplateLiteral');
  }

  /*
  * Checks the given node for arguments, comparing length if provided n
  * @param {ASTNode} node The AST node being checked
  * @param {integer} n the minimum number of arguments in node
  * @returns {boolean} True if node has more arguments than n (n = 0 if not provided)
  */
  function hasArguments(node, n) {
    return Boolean(
      node.arguments && node.arguments.length > ( n || 0 )
    );
  }

  /*
  * Checks if node in question contains any expressions, returning true if so and false if not
  * @param {ASTNode} node The AST node being checked
  * @returns {boolean} True if node contains expression nodes
  */
  function hasExpression(node) {
    return Boolean(
      node.expressions && node.expressions.length > 0
    );
  }

  /*
  * Checks if node in question conforms to TemplateLiteral restraints in this rule, ie
  * that is does not contain any expressions.
  * @param {ASTNode} node The AST node being checked
  * @returns {boolean} True if node is TemplateLiteral and contains expression nodes
  */
  function isValidTemplate(node) {
    return Boolean(
      isTemplateLiteral(node) && !hasExpression(node)
    );
  }

  function isValidBinaryExpression(node) {
    return Boolean(
      node.type === 'BinaryExpression' &&
      node.operator === '+' &&
        (
          isSupportedNode(node.right) &&
            isSupportedNode(node.left)
        )
    );
  }

  /*
  * Checks whether node is supported - String or Template Literals (without expressions) or concatenated string
  * @param {ASTNode} node The AST node being checked
  * @returns {boolean} True if node is of type String or Template Literal
  */
  function isSupportedNode(node) {
    return Boolean(
      isStringLiteral(node) || isValidTemplate(node) || isValidBinaryExpression(node)
    );
  }

  function validateGettext(node) {
    if (hasArguments(node)) {
      if (isTemplateLiteral(node.arguments[0]) && hasExpression(node.arguments[0])) {
        context.report({
          node,
          message: 'Template Literals cannot contain expressions inside gettext family functions'
        });
      } else if (!isSupportedNode(node.arguments[0])) {
        context.report({
          node,
          message: 'First argument of Gettext functions must be String or Template Literals'
        });
      }
    } else {
      context.report({
        node,
        message: 'No arguments provided to Gettext function'
      });
    }
  }

  function validateNgettext(node) {
    if (hasArguments(node, 1)) {
      if ((isTemplateLiteral(node.arguments[0]) && hasExpression(node.arguments[0])) ||
          (isTemplateLiteral(node.arguments[1]) && hasExpression(node.arguments[1]))) {
        context.report({
          node,
          message: 'Template Literals cannot contain expressions inside gettext family functions'
        });
      } else if (!(isSupportedNode(node.arguments[0]) && isSupportedNode(node.arguments[1]))) {
        context.report({
          node,
          message: 'First two arguments of Ngettext functions must be String or Template Literals'
        });
      }
    } else {
      context.report({
        node,
        message: 'Not enough arguments provided to Ngettext function'
      });
    }
  }

  function validateDgettext(node) {
    if (hasArguments(node, 1)) {
      if ((isTemplateLiteral(node.arguments[0]) && hasExpression(node.arguments[0])) ||
          (isTemplateLiteral(node.arguments[1]) && hasExpression(node.arguments[1]))) {
        context.report({
          node,
          message: 'Template Literals cannot contain expressions inside gettext family functions'
        });
      } else if (!(isSupportedNode(node.arguments[0]) && isSupportedNode(node.arguments[1]))) {
        context.report({
          node,
          message: 'First two arguments of Dgettext functions must be String or Template Literals'
        });
      }
    } else {
      context.report({
        node,
        message: 'Not enough arguments provided to Dgettext function'
      });
    }
  }

  function validateDngettext(node) {
    if (hasArguments(node, 2)) {
      if ((isTemplateLiteral(node.arguments[0]) && hasExpression(node.arguments[0])) ||
          (isTemplateLiteral(node.arguments[1]) && hasExpression(node.arguments[1])) ||
          (isTemplateLiteral(node.arguments[2]) && hasExpression(node.arguments[2]))) {
        context.report({
          node,
          message: 'Template Literals cannot contain expressions inside gettext family functions'
        });
      } else if (
          !(
            isSupportedNode(node.arguments[0]) &&
            isSupportedNode(node.arguments[1]) &&
            isSupportedNode(node.arguments[2])
          )) {
          context.report({
            node,
            message: 'First three arguments of Dngettext functions must be String or Template Literals'
          });
        }
    } else {
      context.report({
        node,
        message: 'Not enough arguments provided to Dngettext function'
      });
    }
  }

  return {
    CallExpression: function(node) {
      if (isGettextCall(node)) {
        switch (node.callee.name) {
          case '_':
          case 'gettext':
          case 'c_':
          case 'cgettext':
            validateGettext(node);
            break;
          case 'n_':
          case 'ngettext':
          case 'cn_':
          case 'cngettext':
            validateNgettext(node);
            break;
          case 'd_':
          case 'dgettext':
          case 'cd_':
          case 'cdgettext':
            validateDgettext(node);
            break;
          case 'dn_':
          case 'dngettext':
          case 'cdn_':
          case 'cdngettext':
            validateDngettext(node);
            break;
          default:
            break;
        }
      }
    }
  };
};
