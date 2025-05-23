# DEPRECATED

Deprecated along with https://github.com/freewheel/modulajs.

# eslint-plugin-modulajs

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coverage Status][coverage-image]][coverage-url]
[![Node version][node-image]][node-url]
[![Apache V2 License][apache-2.0]](LICENSE)

This plugin contains any custom eslint rules for use in development on the [modulajs](https://www.npmjs.com/package/modulajs).

## Installation

Prerequisites: Node.js (>=6.0), npm version 3+.

```sh
npm install --save-dev eslint eslint-plugin-modulajs
```

## Usage

Add `modulajs` to the plugins section of ESLint config:
```js
{
  "plugins": [
    "modulajs"
  ]
}
```

## Rules

### `createmodel-attrs-order` <sub>Stylistic Issues</sub>

This rule enforces the order of the keys in the object that is the argument to `createModel`.

Please go to this link [createmodel-attrs-order](docs/rules/createmodel-attrs-order.md) for more details.

### `gettext-params` <sub>Possible Errors</sub>

Note: please ignore this if you are not using `gettext` as I18n solution, [in future we might move this as a separated rule](https://github.com/freewheel/eslint-plugin-modulajs/issues/3).

This rule validates that the proper arguments are provided to the `gettext` family functions.

Please go to this link [gettext-params](docs/rules/gettext-params.md) for more details.

### `no-mutable-event-types-payload-in-models` <sub>Best Practices</sub>
this rule forbid mutable objects in eventTypes/watchEventTypes payload defination.

Please go to this link [no-mutable-event-types-payload-in-models](docs/rules/no-mutable-event-types-payload-in-models.md) for more details.

### `no-mutable-prop-types-in-models` <sub>Best Practices</sub>

By default, this rule checks for the following object-types within the `propTypes` definition in `createModel`.

Please go to this link [no-mutable-prop-types-in-models](docs/rules/no-mutable-prop-types-in-models.md) for more details.

### `use-function-in-model-defaults` <sub>Possible Errors</sub>

This rule validates that any non-primitive prop's default value defined in Model `defaults` should be defined with function.

Please go to this link [use-function-in-model-defaults](docs/rules/use-function-in-model-defaults.md) for more details.

## Contributing

Please read our [contributing guide](CONTRIBUTING.md) for details on how to contribute to our project.

## License

[Apache-2.0](LICENSE)

[npm-url]: https://www.npmjs.com/package/eslint-plugin-modulajs
[npm-image]: https://img.shields.io/npm/v/eslint-plugin-modulajs.svg

[travis-url]: https://travis-ci.org/freewheel/eslint-plugin-modulajs
[travis-image]: https://img.shields.io/travis/freewheel/eslint-plugin-modulajs/master.svg

[coverage-url]: https://coveralls.io/github/freewheel/eslint-plugin-modulajs
[coverage-image]: https://img.shields.io/coveralls/freewheel/eslint-plugin-modulajs/master.svg

[node-url]: https://nodejs.org
[node-image]: https://img.shields.io/node/v/eslint-plugin-modulajs.svg 

[apache-2.0]: http://img.shields.io/badge/license-Apache%20V2-blue.svg
