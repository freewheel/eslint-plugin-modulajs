const DEFAULT_FORBIDDEN = [ 'func', 'array', 'object', 'arrayOf', 'objectOf', 'shape' ];

/**
 * Checks if type is forbidden
 * @param {string} type Object type forbidden
 * @param {Object} context ESLint context object
 * @returns {boolean} True if type is included in forbidden list
 */
function isForbidden(type, context) {
  const configuration = context.options[0] || DEFAULT_FORBIDDEN;
  return configuration.indexOf(type) >= 0;
}

/**
 * Checks if propTypes declarations are forbidden
 * @param {Array} declarations The array of AST nodes being checked.
 * @param {Object} context ESLint context object
 * @param {boolean} shouldReport `true` to report
 * @param {function(targetPropType: string) : string} getMessage A message generator
 * @returns {void}
 */
function checkForbidden(declarations, context, shouldReport, getMessage) {
  let target, value;
  declarations.forEach(function (declaration) {
    if (declaration.type === 'Property') {
      value = declaration.value;
    } else if (declaration.type === 'MemberExpression') {
      value = declaration;
    } else {
      return;
    }

    if (
      value.type === 'MemberExpression' &&
      value.property &&
      value.property.name &&
      value.property.name === 'isRequired'
    ) {
      value = value.object;
    }
    if (
      value.type === 'CallExpression' &&
      value.callee.type === 'MemberExpression'
    ) {
      let name = value.callee.property.name;
      if (name === 'oneOfType') {
        let args = value.arguments[0].elements;
        checkForbidden(args, context, shouldReport, getMessage);

        return;
      } else {
        value = value.callee;
      }
    }
    if (value.property) {
      target = value.property.name;
    } else if (value.type === 'Identifier') {
      target = value.name;
    }

    if (isForbidden(target, context) && shouldReport) {
      const message = getMessage(target);
      context.report({
        node: declaration,
        message
      });
    }
  });
}

module.exports = checkForbidden;
