/**
 * @fileoverview Disallow mutable objects in eventTypes payload defination
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

const rule = require('../../../lib/rules/no-mutable-event-types-payload-in-models.js'),
  RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 6
};

function getMessage(target) {
  let alternative = 'immutable properties';
  if (ALTERNATIVES[target]) {
    alternative = `ImmutablePropTypes.${ALTERNATIVES[target]}`;
  }
  return `Please use ${alternative} instead of PropTypes.${target} when defining "eventTypes/watchEventTypes" in Model`;
}
//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run('no-mutable-event-types-payload-in-models.js.js', rule, {

  valid: [
    {
      code: [
        'const Model = createModel({',
        '  eventTypes: [{',
        '    type: "abc",',
        '    payload: {',
        '      array: ImmutablePropTypes.list,',
        '      object: ImmutablePropTypes.map',
        '    }',
        '  }],',
        '  watchEventTypes: [{',
        '    type: "abc",',
        '    payload: {',
        '      array: ImmutablePropTypes.list,',
        '      object: ImmutablePropTypes.map',
        '    }',
        '  }]',
        '});'
      ].join('\n'),
      parserOptions
    },
    {
      code: [
        'const Model = createModel({',
        '  eventTypes: [{',
        '    type: "abc",',
        '    payload: {',
        '      array: ImmutablePropTypes.listOf(PropTypes.number),',
        '      object: ImmutablePropTypes.mapOf(PropTypes.string)',
        '    }',
        '  }],',
        '  watchEventTypes: [{',
        '    type: "abc",',
        '    payload: {',
        '      array: ImmutablePropTypes.listOf(PropTypes.number),',
        '      object: ImmutablePropTypes.mapOf(PropTypes.string)',
        '    }',
        '  }]',
        '});'
      ].join('\n'),
      parserOptions
    },
    {
      code: [
        'const Model = createModel({',
        '  eventTypes: [{',
        '    type: "abc",',
        '    payload: {',
        '      object: mapContains({',
        '        data: ImmutablePropTypes.listOf(PropTypes.number),',
        '        info: PropTypes.string',
        '      })',
        '    }',
        '  }],',
        '  watchEventTypes: [{',
        '    type: "abc",',
        '    payload: {',
        '      object: mapContains({',
        '        data: ImmutablePropTypes.listOf(PropTypes.number),',
        '        info: PropTypes.string',
        '      })',
        '    }',
        '  }]',
        '});'
      ].join('\n'),
      parserOptions
    },
    {
      code: [
        'const Model = createModel({',
        '  eventTypes: [{',
        '    type: "abc",',
        '    payload: {',
        '      model: PropTypes.instanceOf(TestModel),',
        '      object: ImmutablePropTypes.set',
        '    }',
        '  }],',
        '  watchEventTypes: [{',
        '    type: "abc",',
        '    payload: {',
        '      model: PropTypes.instanceOf(TestModel),',
        '      object: ImmutablePropTypes.set',
        '    }',
        '  }]',
        '});'
      ].join('\n'),
      parserOptions
    }
  ],

  invalid: [
    {
      code: [
        'const Model = createModel({',
        '  eventTypes: [{',
        '    type: "abc",',
        '    payload: {',
        '      array: PropTypes.array,',
        '      object: PropTypes.object',
        '    }',
        '  }],',
        '  watchEventTypes: [{',
        '    type: "abc",',
        '    payload: {',
        '      array: PropTypes.array,',
        '      object: PropTypes.object',
        '    }',
        '  }]',
        '});'
      ].join('\n'),
      parserOptions,
      errors: [
        {
          message: getMessage('array'),
          type: 'Property',
          line: 5,
          column: 7
        },
        {
          message: getMessage('object'),
          type: 'Property',
          line: 6,
          column: 7
        },
        {
          message: getMessage('array'),
          type: 'Property',
          line: 12,
          column: 7
        },
        {
          message: getMessage('object'),
          type: 'Property',
          line: 13,
          column: 7
        }
      ]
    },
    {
      code: [
        'const Model = createModel({',
        '  eventTypes: [{',
        '    payload: {',
        '      object: PropTypes.shape({',
        '        info: PropTypes.string,',
        '        stat: PropTypes.number',
        '      }),',
        '      otherObject: PropTypes.objectOf(PropTypes.string)',
        '    }',
        '  }],',
        '  watchEventTypes: [{',
        '    payload: {',
        '      object: PropTypes.shape({',
        '        info: PropTypes.string,',
        '        stat: PropTypes.number',
        '      }),',
        '      otherObject: PropTypes.objectOf(PropTypes.string)',
        '    }',
        '  }]',
        '});'
      ].join('\n'),
      parserOptions,
      errors: [
        {
          message: getMessage('shape'),
          type: 'Property',
          line: 4,
          column: 7
        },
        {
          message: getMessage('objectOf'),
          type: 'Property',
          line: 8,
          column: 7
        },
        {
          message: getMessage('shape'),
          type: 'Property',
          line: 13,
          column: 7
        },
        {
          message: getMessage('objectOf'),
          type: 'Property',
          line: 17,
          column: 7
        }
      ]
    },
    {
      code: [
        'const Model = createModel({',
        '  eventTypes: [{',
        '    payload: {',
        '      array: PropTypes.array.isRequired',
        '    }',
        '  }],',
        '  watchEventTypes: [{',
        '    payload: {',
        '      array: PropTypes.array.isRequired',
        '    }',
        '  }]',
        '});'
      ].join('\n'),
      parserOptions,
      errors: [
        {
          message: getMessage('array'),
          type: 'Property',
          line: 4,
          column: 7
        },
        {
          message: getMessage('array'),
          type: 'Property',
          line: 9,
          column: 7
        }
      ]
    },
    {
      code: [
        'const Model = createModel({',
        '  eventTypes: [{',
        '    payload: {',
        '      array: PropTypes.oneOfType([',
        '        PropTypes.array,',
        '        PropTypes.object',
        '      ])',
        '    }',
        '  }],',
        '  watchEventTypes: [{',
        '    payload: {',
        '      array: PropTypes.oneOfType([',
        '        PropTypes.array,',
        '        PropTypes.object',
        '      ])',
        '    }',
        '  }]',
        '});'
      ].join('\n'),
      parserOptions,
      errors: [
        {
          message: getMessage('array'),
          type: 'MemberExpression',
          line: 5,
          column: 9
        },
        {
          message: getMessage('object'),
          type: 'MemberExpression',
          line: 6,
          column: 9
        },
        {
          message: getMessage('array'),
          type: 'MemberExpression',
          line: 13,
          column: 9
        },
        {
          message: getMessage('object'),
          type: 'MemberExpression',
          line: 14,
          column: 9
        }
      ]
    },
    {
      code: [
        'const Model = createModel({',
        '  eventTypes: [{',
        '    payload: {',
        '      function: PropTypes.func.isRequired',
        '    }',
        '  }],',
        '  watchEventTypes: [{',
        '    payload: {',
        '      function: PropTypes.func.isRequired',
        '    }',
        '  }]',
        '});'
      ].join('\n'),
      parserOptions,
      errors: [
        {
          message: getMessage('func'),
          type: 'Property',
          line: 4,
          column: 7
        },
        {
          message: getMessage('func'),
          type: 'Property',
          line: 9,
          column: 7
        }
      ]
    }
  ]
});
