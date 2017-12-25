module.exports = {
  extends: [
    'airbnb-base',
    'eslint:recommended'
  ],

  // Stop ESLint from looking for a configuration file in parent folders
  root: true,

  env: {
    browser: true,
    node: true
  },

  rules: {
    /**
     * Style
     */
    'comma-dangle': ['error', 'never'],

    /**
     * ES 6
     */
    'max-len': ['error', 120, 2, {
      ignoreUrls: true,
      ignoreComments: false,
      ignoreRegExpLiterals: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true
    }],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-var': 'error'
  }
};
