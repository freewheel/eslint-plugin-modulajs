# Must use functions to define non-primitive default values for models (use-function-in-model-defaults)

Must use functions to define non-primitive default values for models.

## Rule Details

This rule validates that any non-primitive prop's default value defined in Model `defaults` should be defined with function.

There're 2 ways to define `defaults` in Model:

```javascript
// define with object
defaults: {
  foo: 'bar'
}
// define with function
defaults: () => {
  return {
    foo: 'bar'
  };
}
```

This rule validates and forbids a typical mistake when defining `defaults` with object:

```javascript
// WRONG
defaults: {
  // `list` is initialized before Model instantiation, so the value will be
  // shared by all instances of current Model, which may cause unpredictable
  // issues afterwards.
  list: new List()
}
// RIGHT
defaults: {
  // `list` is initialized when Model instantiation, so that every new Model
  // instance will have a new instance of `List`.
  list: () => new List()
}
```

This rule will recognize above mistake, but please note that the rule only handles simple cases, developers may write complex expressions that are difficult for the rule to parse. To include in your `.eslintrc` config, add the following:

```json
{
  "rules": {
    "modula/use-function-in-model-defaults": "error"
  }
}
```
