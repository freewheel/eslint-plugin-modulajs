/**
 * @fileoverview Rule to check that properties in argument to createModel are well ordered
 */

// ------------------------------------------------------------------------------
//  Helpers
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/createmodel-attrs-order');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    jsx: false // models are pure js
  }
};

const createModel = (lines = [], options = {}, errors = []) => ({
  code: 'createModel({\n' + lines.map(l => `\t\t${ l },`).join('\n') + '\n\t});',
  parserOptions,
  options: [ options ],
  errors
});

const createModelWithErrors = (lines = [], errors = []) => createModel(lines, {}, errors);


// ------------------------------------------------------------------------------
//  Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run('createmodel-attrs-order', rule, {
  valid: [
    {
      code: 'createModel()',
      parserOptions
    },

    createModel(),

    createModel([
      'displayName: \'someName\''
    ]),

    createModel([
      'sendSomething() {}'
    ]),

    createModel([
      'sendSomething() {}',
      'recvSomething() {}'
    ]),

    createModel([
      'getSomeProp() {}'
    ]),

    createModel([
      'displayName: \'someName\'',
      'recvSomething() {}',
      'sendSomething() {}',
      'getSomeProp() {}'
    ]),

    createModel([
      'propTypes: {}',
      'sendSomething() {}',
      'recvSomething() {}',
      'getSomeProp() {}'
    ], { sendRecvPairs: true }),

    createModel([
      'propTypes: {}',
      'localPropTypes: {}',
      'defaults: {}',
      'sendSomething() {}',
      'recvSomething() {}'
    ])
  ],

  invalid: [
    {
      code: 'createModel()',
      parserOptions,
      options: [
        {
          mustHaveAnyProps  : true,
          firstPropRequired : true
        }
      ],
      errors: [
        {
          message: 'Model has no properties',
          type: 'CallExpression',
          line: 1,
          column: 1
        }
      ]
    },

    createModel([],
      {
        mustHaveAnyProps  : true,
        firstPropRequired : true
      },
      [
        {
          message: 'Model has no properties',
          type: 'CallExpression',
          line: 1,
          column: 1
        }
      ]
    ),

    createModel(
      [
        'getNotDisplayName() {}'
      ],
      {
        firstPropRequired : true
      },
      [
        {
          message: 'First property should be displayName, not getNotDisplayName',
          type: 'Property',
          line: 2,
          column: 3
        }
      ]
    ),

    createModelWithErrors(
      [
        'modelDidMount() {}',
        'displayName: \'badOrder\''
      ],
      [
        {
          message: 'Lifecycle props used out of order: found modelDidMount, displayName. Expected displayName, modelDidMount',
          type: 'Property',
          line: 2,
          column: 3
        }
      ]
    ),

    createModelWithErrors(
      [
        'displayName: \'badOrder\'',
        'sendTooEarly() {}',
        'recvTooEarly() {}',
        'delegates: {}',
        'modelDidMount() {}'
      ],
      [
        {
          message: 'sendTooEarly should come after modelDidMount',
          type: 'Property',
          line: 3,
          column: 3
        },
        {
          message: 'recvTooEarly should come after modelDidMount',
          type: 'Property',
          line: 4,
          column: 3
        }
      ]
    ),

    createModel(
      [
        'displayName: \'SendRecvUnPaired\'',
        'sendTooEarly() {}',
        'sendInTheMiddle() {}',
        'recvTooEarly() {}',
        'delegates: {}',
        'modelDidMount() {}'
      ],
      { sendRecvPairs: true },
      [
        {
          message: 'sendTooEarly should come after modelDidMount',
          type: 'Property',
          line: 3,
          column: 3
        },
        {
          message: 'sendInTheMiddle should come after modelDidMount',
          type: 'Property',
          line: 4,
          column: 3
        },
        {
          message: 'recvTooEarly should come after modelDidMount',
          type: 'Property',
          line: 5,
          column: 3
        },
        {
          message: 'recvTooEarly should follow sendTooEarly, not sendInTheMiddle',
          type: 'Property',
          line: 5,
          column: 3
        }
      ]
    ),

    createModelWithErrors(
      [
        'displayName: \'badOrder\'',
        'delegates: {}',
        'modelDidMount() {}',
        'sendSomething() {}',
        'recvSomething() {}',
        'getOutOfOrder() {}',
        'sendSomeOtherThing() {}',
        'recvSomeOtherThing() {}'
      ],
      [
        {
          message: 'getOutOfOrder should come after recvSomeOtherThing',
          type: 'Property',
          line: 7,
          column: 3
        }
      ]
    ),

    createModelWithErrors(
      [
        'displayName: \'badOrder\'',
        'getOutOfOrder() {}',
        'delegates: {}',
        'modelDidMount() {}'
      ],
      [
        {
          message: 'getOutOfOrder should come after modelDidMount',
          type: 'Property',
          line: 3,
          column: 3
        }
      ]
    ),

    createModelWithErrors(
      [
        'localPropTypes: {}',
        'propTypes: {}'
      ],
      [
        {
          message: 'Lifecycle props used out of order: found localPropTypes, propTypes. Expected propTypes, localPropTypes',
          type: 'Property',
          line: 2,
          column: 3
        }
      ]
    ),

    createModelWithErrors(
      [
        'sendTooEarly() {}',
        'localPropTypes: {}'
      ],
      [
        {
          message: 'sendTooEarly should come after localPropTypes',
          type: 'Property',
          line: 2,
          column: 3
        }
      ]
    )
  ]
});
