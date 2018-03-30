# Enforces the order of keys in `createModel` specification (createmodel-attrs-order)

Enforces the order of keys in `createModel` specification.

## Rule Details

This rule enforces the order of the keys in the object that is the argument to `createModel`. Keys are broken into three groups:

1. Life Cycle: keys with a specific meaning to `createModel` such as `displayName` and `modelDidMount`. Their order can be customized with `lifeCycleProps`.
2. Senders/Receivers: methods used in sending/receiving messages; they should come after lifecycle methods (if there are any) and can optionally be required via `sendRecvPairs` to be in pairs like `sendFooMsg` `recvFooMsg`
3. Helpers: setters and getters that should come after lifecycle methods or senders/receivers if there are any.

### Options

Below is the `.eslintrc` entry that would configure this rule to have its default behavior and which can be customized

```json
{
  "rules": {
    "modulajs/createmodel-attrs-order": ["warn", {
      "firstPropRequired" : false, // reports first Life Cycle prop not present
      "sendRecvPairs"     : false, // enforces sequential sendFoo(), recvFoo()
      "mustHaveAnyProps"  : false, // reports createModel() or createModel([])
      "lifeCycleProps"    : [      // user can specify order
        "displayName",
        "propTypes",
        "localPropTypes",
        "defaults",
        "contextTypes",
        "childContextTypes",
        "getChildContext",
        "eventTypes",
        "watchEventTypes",
        "watchEvent",
        "delegates",
        "services",
        "modelDidMount",
        "modelDidUpdate",
        "modelWillUnmount"
      ]
    }]
  }
}
```
