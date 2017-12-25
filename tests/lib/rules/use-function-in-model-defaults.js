/**
 * @fileoverview Rule to ensure using function to define defaults of non-primitive Model prop
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/use-function-in-model-defaults.js'),
  RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 6
};

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run('use-function-in-model-defaults.js', rule, {
  valid: [
    {
      code: `
const Model = createModel({
  propTypes: {
    string: PropTypes.string,
    number: PropTypes.number,
    bool: PropTypes.bool
  },
  defaults: {
    string: 'foo',
    number: 123,
    bool: true
  }
});
      `,
      parserOptions
    },
    {
      code: `
const Model = createModel({
  propTypes: {
    number1: PropTypes.number,
    number2: PropTypes.number,
    number3: PropTypes.number
  },
  defaults: {
    number1: NaN,
    number2: Infinity,
    number3: -123
  }
});
      `,
      parserOptions
    },
    {
      code: `
const Model = createModel({
  propTypes: {
    array: ImmutablePropTypes.list,
    object: ImmutablePropTypes.map,
    model: PropTypes.instanceOf(Model)
  },
  defaults: {
    array: null,
    object: null,
    model: null
  }
});
      `,
      parserOptions
    },
    {
      code: `
const Model = createModel({
  propTypes: {
    array: ImmutablePropTypes.list,
    object: ImmutablePropTypes.map,
    model: PropTypes.instanceOf(Model)
  },
  defaults: {
    array: undefined,
    object: undefined,
    model: undefined
  }
});
      `,
      parserOptions
    },
    {
      code: `
const Model = createModel({
  propTypes: {
    array: ImmutablePropTypes.list,
    object: ImmutablePropTypes.map,
    model: PropTypes.instanceOf(Model)
  },
  defaults: {
    array: function() { return new List() },
    object: function() { return new Map() },
    model: function() { return new Model() }
  }
});
      `,
      parserOptions
    },
    {
      code: `
const Model = createModel({
  propTypes: {
    array: ImmutablePropTypes.list,
    object: ImmutablePropTypes.map,
    model: PropTypes.instanceOf(Model)
  },
  defaults: {
    array: () => new List(),
    object: () => new Map(),
    model: () => new Model()
  }
});
      `,
      parserOptions
    },
    {
      code: `
const Model = createModel({
  propTypes: {
    array: ImmutablePropTypes.list,
    object: ImmutablePropTypes.map,
    model: PropTypes.instanceOf(Model)
  },
  defaults: {
    array: createArray,
    object: createObject,
    model: createObject
  }
});
      `,
      parserOptions
    },
    {
      code: `
const Model = createModel({
  propTypes: {
    array: ImmutablePropTypes.list,
    object: ImmutablePropTypes.map,
    model: PropTypes.instanceOf(Model)
  },
  defaults: () => {
    return {
      array: new List(),
      object: new Map(),
      model: new Model()
    };
  }
});
      `,
      parserOptions
    },
    {
      code: `
const Model = createModel({
  propTypes: {
    array: ImmutablePropTypes.list,
    object: ImmutablePropTypes.map,
    shape: PropTypes.shape({
      items: ImmutablePropTypes.list,
      count: PropTypes.number
    })
  },
  defaults: function() {
    return {
      array: List([ 1, 2, 3]),
      object: Map({ a, b, c }),
      shape: fromJS({ items: [ 'a', 'b', 'c' ], count: 3 })
    };
  }
});
      `,
      parserOptions
    }
  ],

  // End of valid cases --------

  invalid: [
    {
      code: `
const Model = createModel({
  propTypes: {
    array: ImmutablePropTypes.list,
    object: ImmutablePropTypes.map,
    model: PropTypes.instanceOf(Model)
  },
  defaults: {
    array: new List(),
    object: new Map(),
    model: new Model()
  }
});
      `,
      parserOptions,
      errors: [
        {
          source: '    array: new List(),',
          type: 'Property',
          line: 9,
          column: 5
        },
        {
          source: '    object: new Map(),',
          type: 'Property',
          line: 10,
          column: 5
        },
        {
          source: '    model: new Model()',
          type: 'Property',
          line: 11,
          column: 5
        }
      ]
    },
    {
      code: `
const Model = createModel({
  propTypes: {
    array: ImmutablePropTypes.list,
    object: ImmutablePropTypes.map,
    shape: PropTypes.shape({
      items: ImmutablePropTypes.list,
      count: PropTypes.number
    })
  },
  defaults: {
    array: List([ 1, 2, 3]),
    object: Map({ a, b, c }),
    shape: fromJS({ items: [ 'a', 'b', 'c' ], count: 3 })
  }
});
      `,
      parserOptions,
      errors: [
        {
          source: '    array: List([ 1, 2, 3])',
          type: 'Property',
          line: 12,
          column: 5
        },
        {
          source: '    object: Map({ a, b, c }),',
          type: 'Property',
          line: 13,
          column: 5
        },
        {
          source: `    shape: fromJS({ items: [ 'a', 'b', 'c' ], count: 3 })`,
          type: 'Property',
          line: 14,
          column: 5
        }
      ]
    }
  ]
});
