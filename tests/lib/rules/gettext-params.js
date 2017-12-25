/**
 * @fileoverview Only String Literals or Template literals (without expressions) in Gettext family functions
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/gettext-params'),
  RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    jsx: true
  }
};

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run('gettext-params', rule, {

  valid: [
    {
      code: [
        'const { gettext: _ } = this.context;',
        '_(\'Apply\');'
      ].join('\n'),
      parserOptions
    },
    {
      code: [
        'const ngettext = model.getContext(\'ngettext\');',
        'const count = 2;',
        'ngettext(\'There is a missing field\', \'There are %{count} missing fields\', count);'
      ].join('\n'),
      parserOptions
    },
    {
      code: [
        'const { dgettext: d_ } = this.context;',
        'd_(\'errors\', \'Cannot be blank\');'
      ].join('\n'),
      parserOptions
    },
    {
      code: [
        'const dngettext = model.getContext(\'dngettext\');',
        'const count = 3;',
        'dngettext(`errors`, `Failed to fly a cat`, \'Failed to fly %{count} cats\', count);'
      ].join('\n'),
      parserOptions
    },
    {
      code: [
        'const { cdngettext: cdn_ } = this.context;',
        'const count = 4;',
        'const color = <span style={{ color: \'yellow\' }}>yellow</span>;',
        'cdn_(`errors`, \'Failed to fly a %{color} cat\', \'Failed to fly %{count} %{color} cats\', count, { color });'
      ].join('\n'),
      parserOptions
    },
    {
      code: [
        'const { gettext: _ } = this.context;',
        '_(\'string1 \' + \'string2 \' + `string literal`);'
      ].join('\n'),
      parserOptions
    }
  ],

  invalid: [
    {
      code: [
        'const { gettext: _, cgettext: c_ } = this.context;',
        'const module = \'User\';',
        'const foodSpan = <span style={{ color: \'green\' }}>Veggies</span>;',
        '_(`Apply ${module} settings`);',
        'c_(`Eat your ${food}`, foodSpan);'
      ].join('\n'),
      parserOptions,
      errors: [
        {
          message: 'Template Literals cannot contain expressions inside gettext family functions',
          type: 'CallExpression',
          line: 4,
          column: 1
        },
        {
          message: 'Template Literals cannot contain expressions inside gettext family functions',
          type: 'CallExpression',
          line: 5,
          column: 1
        }
      ]
    },
    {
      code: [
        'const dgettext = model.get(\'dgettext\');',
        'const fieldError = \'Field is empty, please provide a value\';',
        'dgettext(\'errors\', fieldError);'
      ].join('\n'),
      parserOptions,
      errors: [
        {
          message: 'First two arguments of Dgettext functions must be String or Template Literals',
          type: 'CallExpression',
          line: 3,
          column: 1
        }
      ]
    },
    {
      code: [
        'const { dngettext: dn_ } = this.context;',
        'const domain = \'errors\';',
        'const stats = this.getUserStats();',
        'dn_(domain, \'Failed to fetch a record\', \'Failed to fetch %{count} records\', 4);',
        'dn_(\'private\', `${stats.username} has a new message`, `${stats.username} has %{count} new messages`, stats.msg.length);'
      ].join('\n'),
      parserOptions,
      errors: [
        {
          message: 'First three arguments of Dngettext functions must be String or Template Literals',
          type: 'CallExpression',
          line: 4,
          column: 1
        },
        {
          message: 'Template Literals cannot contain expressions inside gettext family functions',
          type: 'CallExpression',
          line: 5,
          column: 1
        }
      ]
    },
    {
      code: [
        'const { gettext: _ } = this.context;',
        'const thing = \'long string to translate\';',
        '_(\'string 1 \' + \'string2 \' + `string literal with ${expression}`);',
        '_(thing + \'string2 \' + \'string3\');'
      ].join('\n'),
      parserOptions,
      errors: [
        {
          message: 'First argument of Gettext functions must be String or Template Literals',
          type: 'CallExpression',
          line: 3,
          column: 1
        },
        {
          message: 'First argument of Gettext functions must be String or Template Literals',
          type: 'CallExpression',
          line: 4,
          column: 1
        }
      ]
    }
  ]
});
