# No mutable types allowed in eventTypes payload for models (no-mutable-event-types-payload-in-models)

No mutable objects in eventTypes payload defination.

## Rule Details

By default, this rule checks for the following object-types within the `eventTypes/watchEventTypes` definition in `createModel`:

* array, arrayOf
* object, objectOf
* shape
* func

Use immutable data in `payload` definition of `eventTypes/watchEventTypes` as follows:

```javascript
  eventTypes: [
    {
      type: 'reload',
      payload: {
        foo: PropTypes.string,
        bar: ImmutablePropTypes.listOf(PropTypes.number)
      }
    }
  ],
  watchEventTypes: [
    {
      type: 'reload',
      payload: {
        foo: PropTypes.string,
        bar: ImmutablePropTypes.listOf(PropTypes.number)
      }
    }
  ]
```

### Options

This can be configured to forbid / warn against any valid  `eventType/watchEventTypes`. You can provide an array of object types you don't want to be allowed within the ModulaJS `Model` Class in your `.eslintrc` configuration file.

default value: `[ 'func', 'array', 'object', 'arrayOf', 'objectOf', 'shape' ]`

```json
{
  "rules": {
    "modulajs/no-mutable-event-types-payload-in-models": ["error", ["object", "array", "arrayOf", "objectOf"]]
  }
}
```
