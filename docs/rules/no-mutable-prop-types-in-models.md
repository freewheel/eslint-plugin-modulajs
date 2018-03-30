# No mutable types allowed in propTypes for models (no-mutable-prop-types-in-models)

No mutable types allowed in propTypes for models.

## Rule Details

By default, this rule checks for the following object-types within the `propTypes` definition in `createModel`:

* array, arrayOf
* object, objectOf
* shape
* func

### Options

This can be configured to forbid / warn against any valid  `propType`. In your `.eslintrc` configuration file, provide an array of object types you don't want to be allowed within the ModulaJS `Model` Class:

```json
{
  "rules": {
    "modulajs/no-mutable-prop-types-in-models": ["error", ["object", "array", "arrayOf", "objectOf"]]
  }
}
```
