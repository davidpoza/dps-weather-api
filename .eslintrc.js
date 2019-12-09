module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true
  },
  extends: [
    'airbnb-base',
    'plugin:react/recommended',
    'plugin:jest/recommended'
  ],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 6,
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    'max-len': [2, 140, 2],
    'import/no-extraneous-dependencies': ['error', { 'devDependencies': true }],
    'import/no-unresolved': false,
    'import/extensions': ['warning', 'ignorePackages']
  }
};