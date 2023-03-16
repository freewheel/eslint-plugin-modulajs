module.exports = {
  extends: ['airbnb-base', 'eslint:recommended'],

  // Stop ESLint from looking for a configuration file in parent folders
  root: true,

  env: {
    browser: true,
    node: true
  },

  rules: {
    'arrow-parens': ['error', 'as-needed'],
    'comma-dangle': ['error', 'never'],
    'function-paren-newline': ['error', 'multiline-arguments'],
    'max-len': [
      'error',
      120,
      2,
      {
        ignoreUrls: true,
        ignoreComments: false,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true
      }
    ],
    'prefer-destructuring': 0,
    'no-param-reassign': 0,
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-var': 'error'
  }
};
