/**
 * @fileoverview Rule to check that properties in argument to createModel are well ordered
 */

/**
 * returns true if any sequential array elements are not ascending on given key
 * @param  {Object} array Array of objects
 * @param  {String} key   key to inspect
 * @return {boolean}      whether any values at key pn  sequential objects are not strictly ascending
 */
const isNotAscending = (array, key) =>
  array.some((val, idx, arr) => idx && val[key] < arr[idx - 1][key]);

// -----------------------------------------------------------------------------
// Rule Definition
// -----------------------------------------------------------------------------

module.exports.meta = {
  docs: {
    description: 'order of params to argument to createModel',
    category: 'Stylistic Issues',
    recommended: false
  }
};

module.exports.schema = [
  {
    type: 'object',
    properties: {
      firstPropRequired: { type: 'boolean' },
      sendRecvPairs: { type: 'boolean' },
      mustHaveAnyProps: { type: 'boolean' },
      lifeCycleProps: {
        type: 'array',
        items: {
          type: 'string'
        },
        minItems: 1,
        uniqueItems: true
      }
    },
    additionalProperties: false
  }
];

module.exports = function createModelAttrsOrder(context) {
  const options = Object.assign(
    {},
    {
      firstPropRequired: false,
      sendRecvPairs: false,
      mustHaveAnyProps: false,
      lifeCycleProps: [
        'displayName',
        'propTypes',
        'localPropTypes',
        'defaults',
        'contextTypes',
        'childContextTypes',
        'getChildContext',
        'eventTypes',
        'watchEventTypes',
        'watchEvent',
        'delegates',
        'services',
        'modelDidMount',
        'modelDidUpdate',
        'modelWillUnmount'
      ]
    },
    context.options[0]
  );

  /**
   * checks if node is the call to createModel
   * @param  {ASTNode}  node any node
   * @return {boolean}
   */
  function isCreateModelCall(node) {
    const { type, name } = node.callee;
    return type === 'Identifier' && name === 'createModel';
  }

  /**
   * creates array of objects with name, node, and index.
   * index is the index that the props are listed within the arg to createModel
   * @param  {ASTNode} parentNode Whole first argument to createModel
   * @return { Array }
   */
  function propsToProps(parentNode) {
    const { arguments: args } = parentNode;

    if (args.length > 0 && args[0].properties && args[0].properties.filter) {
      const props = args[0].properties.filter(
        node => node.key && node.key.name
      );

      return props.map((node, index) => ({
        name: node.key.name,
        node,
        index
      }));
    }

    return [];
  }

  /**
   * Validates that life cycle prop names are in proper order
   * @param  {Array} props output of propsToProps
   * @return {Object}      Lifecycle props and the rest
   */
  function validateLifeCyclePropNames(props) {
    const lifeCycleOrder = options.lifeCycleProps.reduce(
      (order, propName, idx) => {
        order[propName] = idx + 1;
        return order;
      },
      {}
    );

    const { props: lifeCycleProps, notHandled } = props.reduce(
      (memo, prop) => {
        const { name } = prop;

        if (lifeCycleOrder[name]) {
          prop.order = lifeCycleOrder[name];
          memo.props.push(prop);
        } else {
          memo.notHandled.push(prop);
        }

        return memo;
      },
      { props: [], notHandled: [] }
    );

    if (isNotAscending(lifeCycleProps, 'order')) {
      const usedProps = lifeCycleProps.reduce(
        (memo, prop) => Object.assign(memo, { [prop.name]: true }),
        {}
      );

      context.report({
        node: lifeCycleProps[0].node,
        message:
          'Lifecycle props used out of order: found {{ used }}. Expected {{ correct }}',
        data: {
          used: lifeCycleProps.map(prop => prop.name).join(', '),
          correct: options.lifeCycleProps
            .filter(propName => usedProps[propName])
            .join(', ')
        }
      });
    }

    return {
      lastLifeCycleProp:
        lifeCycleProps.length > 0
          ? lifeCycleProps.reverse()[0]
          : { index: -1, name: '' },
      notHandled
    };
  }

  /**
   * Error if send/recv start after last lifecycle prop
   * or if receiver does not follow expected sender
   * @param  {Array}  props             output of propsToProps
   * @param  {Object} lastLifeCycleProp same struct as single elem in props
   * @param  {Object} notHandled        keys are names of props pointing to booleans
   * @return {Object}                   notHandled and lastSendRecvProp
   */
  function validateSendRecvPropNames(props, lastLifeCycleProp) {
    const sendRE = /^send/;
    const recvRE = /^recv/;

    return props.reduce(
      (memo, prop, idx) => {
        const { name, node } = prop;
        const isRecv = recvRE.test(name);

        if (isRecv || sendRE.test(name)) {
          memo.lastSendRecvProp = prop;

          if (prop.index < lastLifeCycleProp.index) {
            context.report({
              node,
              message:
                '{{ propName }} should come after {{ lifeCyclePropName }}',
              data: {
                propName: name,
                lifeCyclePropName: lastLifeCycleProp.name
              }
            });
          }

          if (options.sendRecvPairs && isRecv) {
            const senderName = name.replace(recvRE, 'send');
            const prevPropName = idx > 0 ? props[idx - 1].name : 'nothing';

            if (prevPropName !== senderName) {
              context.report({
                node,
                message:
                  '{{ propName }} should follow {{ senderName }}, not {{ prevPropName }}',
                data: { propName: name, senderName, prevPropName }
              });
            }
          }
        } else {
          memo.notHandled.push(prop);
        }

        return memo;
      },
      { lastSendRecvProp: null, notHandled: [] }
    );
  }

  /**
   * Validates that anything other than a lifecycle and send/recv function
   * comes after both of those groups are done
   * @param  {Array}  props             output of propsToProps
   * @param  {Object} notHandled        keys are names of props pointing to booleans
   * @param  {Object} lastLifeCycleProp same struct as single elem in props
   * @param  {Object} lastSendRecvProp  same struct as single elem in props
   * @return nothing
   */
  function validateHelperPropNames(props, lastLifeCycleProp, lastSendRecvProp) {
    props.forEach(prop => {
      const { node, index, name } = prop;
      const isAfterLastSendRecv =
        lastSendRecvProp && index < lastSendRecvProp.index;

      if (isAfterLastSendRecv || index < lastLifeCycleProp.index) {
        context.report({
          node,
          message: '{{ propName }} should come after {{ last }}',
          data: {
            propName: name,
            last: (isAfterLastSendRecv ? lastSendRecvProp : lastLifeCycleProp)
              .name
          }
        });
      }
    });
  }

  /**
   * Validates that the first prop is present where expected
   * @param  {Array} props output of propsToProps with at least 1 prop
   * @return nothing
   */
  function validateFirstProp(props) {
    const { name, node } = props[0];

    const expected = options.lifeCycleProps[0];

    if (name !== expected) {
      context.report({
        node,
        message: 'First property should be {{ expected }}, not {{ name }}',
        data: { expected, name }
      });
    }
  }

  return {
    CallExpression(node) {
      if (isCreateModelCall(node)) {
        const props = propsToProps(node);

        if (props.length > 0) {
          if (options.firstPropRequired) {
            validateFirstProp(props, node);
          }

          const { lastLifeCycleProp, notHandled: notHandledByLifeCycle } =
            validateLifeCyclePropNames(props);

          const { lastSendRecvProp, notHandled: notHandledBySendRecv } =
            validateSendRecvPropNames(notHandledByLifeCycle, lastLifeCycleProp);

          validateHelperPropNames(
            notHandledBySendRecv,
            lastLifeCycleProp,
            lastSendRecvProp
          );
        } else if (options.mustHaveAnyProps || options.firstPropRequired) {
          context.report({
            node,
            message: 'Model has no properties'
          });
        }
      }
    }
  };
};
