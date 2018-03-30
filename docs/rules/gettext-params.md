# Only string or template literals allowed as `gettext` input (gettext-params)

Only string or template literals allowed as `gettext` input.

## Rule Details

This rule validates that the proper arguments are provided to the `gettext` family functions, ie that only string literals or template literals (without expressions) are provided, or a valid concatenation of those. To include in your `.eslintrc` config, add the following:

```json
{
  "rules": {
    "modulajs/gettext-params": "error"
  }
}
```
