module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'plugin:eslint-plugin-json/recommended',
  ],
  plugins: ['react', 'prettier', 'unused-imports', 'babel'],
  // add your custom rules here
  rules: {
    'react/jsx-fragments': [2, 'syntax'],
    'react/prop-types': 1,
    'prettier/prettier': 'error',
    'no-unused-expressions': 'error',
    'no-unused-vars': 'error',
    'unused-imports/no-unused-imports': 'error',
    'no-console': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
