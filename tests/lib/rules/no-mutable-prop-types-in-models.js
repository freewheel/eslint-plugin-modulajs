/**
 * @fileoverview No mutable object-types allowed in propTypes of Module Models
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const ALTERNATIVES = {
  array: 'list',
  object: 'map',
  arrayOf: 'listOf',
  objectOf: 'mapOf',
  shape: 'contains/mapContains'
};

const rule = require('../../../lib/rules/no-mutable-prop-types-in-models.js'),
  RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 6
};

function getMessage(target) {
  let alternative = 'immutable properties';
  if (ALTERNATIVES[target]) {
    alternative = `ImmutablePropTypes.${ALTERNATIVES[target]}`;
  }
  return `Please use ${alternative} instead of PropTypes.${target} when defining "propTypes" in Model`;
}
//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run('no-mutable-prop-types-in-models.js', rule, {

  valid: [
    {
      code: [
        'const Model = createModel({',
        '  propTypes: {',
        '    array: ImmutablePropTypes.list,',
        '    object: ImmutablePropTypes.map',
        '  }',
        '});'
      ].join('\n'),
      parserOptions
    },
    {
      code: [
        'const Model = createModel({',
        '  propTypes: {',
        '    array: ImmutablePropTypes.listOf(PropTypes.number),',
        '    object: ImmutablePropTypes.mapOf(PropTypes.string)',
        '  }',
        '});'
      ].join('\n'),
      parserOptions
    },
    {
      code: [
        'const Model = createModel({',
        '  propTypes: {',
        '    stats: ImmutablePropTypes.mapContains({',
        '      data: ImmutablePropTypes.listOf(PropTypes.number),',
        '      info: PropTypes.string',
        '    })',
        '  }',
        '});'
      ].join('\n'),
      parserOptions
    },
    {
      code: [
        'const Model = createModel({',
        '  propTypes: {',
        '    object: ImmutablePropTypes.mapOf(PropTypes.string)',
        '  }',
        '});'
      ].join('\n'),
      parserOptions
    },
    {
      code: [
        'const Model = createModel({',
        '  propTypes: {',
        '    object: ImmutablePropTypes.set,',
        '    model: PropTypes.instanceOf(TestModel)',
        '  }',
        '});'
      ].join('\n'),
      parserOptions
    },
    {
      code: [
        'const Model = createModel({',
        '  propTypes: {',
        '    list: ImmutablePropTypes.listOf(PropTypes.number)',
        '  }',
        '});'
      ].join('\n'),
      parserOptions
    }
  ],

  invalid: [
    {
      code: [
        'const Model = createModel({',
        '  propTypes: {',
        '    object: PropTypes.object,',
        '    array: PropTypes.array',
        '  }',
        '});'
      ].join('\n'),
      parserOptions,
      errors: [
        {
          message: getMessage('object'),
          type: 'Property',
          line: 3,
          column: 5
        },
        {
          message: getMessage('array'),
          type: 'Property',
          line: 4,
          column: 5
        }
      ]
    },
    {
      code: [
        'const Model = createModel({',
        '  propTypes: {',
        '    object: PropTypes.shape({',
        '      info: PropTypes.string,',
        '      stat: PropTypes.number',
        '    }),',
        '    otherObject: PropTypes.objectOf(PropTypes.string)',
        '  }',
        '});'
      ].join('\n'),
      parserOptions,
      errors: [
        {
          message: getMessage('shape'),
          type: 'Property',
          line: 3,
          column: 5
        },
        {
          message: getMessage('objectOf'),
          type: 'Property',
          line: 7,
          column: 5
        }
      ]
    },
    {
      code: [
        'const Model = createModel({',
        '  propTypes: {',
        '    list: PropTypes.array.isRequired,',
        '    otherObject: PropTypes.objectOf(PropTypes.string).isRequired',
        '  }',
        '});'
      ].join('\n'),
      parserOptions,
      errors: [
        {
          message: getMessage('array'),
          type: 'Property',
          line: 3,
          column: 5
        },
        {
          message: getMessage('objectOf'),
          type: 'Property',
          line: 4,
          column: 5
        }
      ]
    },
    {
      code: [
        'const Model = createModel({',
        '  propTypes: {',
        '    list: PropTypes.oneOfType([',
        '      PropTypes.array,',
        '      PropTypes.object',
        '    ]).isRequired',
        '  }',
        '});'
      ].join('\n'),
      parserOptions,
      errors: [
        {
          message: getMessage('array'),
          type: 'MemberExpression',
          line: 4,
          column: 7
        },
        {
          message: getMessage('object'),
          type: 'MemberExpression',
          line: 5,
          column: 7
        }
      ]
    },
    {
      code: [
        'const Model = createModel({',
        '  propTypes: {',
        '    list: PropTypes.oneOfType([',
        '      PropTypes.array,',
        '      PropTypes.number',
        '    ])',
        '  }',
        '});'
      ].join('\n'),
      parserOptions,
      errors: [
        {
          message: getMessage('array'),
          type: 'MemberExpression',
          line: 4,
          column: 7
        }
      ]
    },
    {
      code: [
        'const Model = createModel({',
        '  propTypes: {',
        '    function: PropTypes.func.isRequired,',
        '    list: PropTypes.oneOfType([',
        '      PropTypes.array,',
        '      PropTypes.number',
        '    ]),',
        '    meta: PropTypes.object',
        '  }',
        '});'
      ].join('\n'),
      parserOptions,
      options: [
        [ 'object', 'func', 'number' ]
      ],
      errors: [
        {
          message: getMessage('func'),
          type: 'Property',
          line: 3,
          column: 5
        },
        {
          message: getMessage('number'),
          type: 'MemberExpression',
          line: 6,
          column: 7
        },
        {
          message: getMessage('object'),
          type: 'Property',
          line: 8,
          column: 5
        }
      ]
    }
  ]
});
