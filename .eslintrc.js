module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  extends: [
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'plugin:eslint-plugin-json/recommended',
  ],
  plugins: ['prettier', 'unused-imports'],
  // add your custom rules here
  rules: {
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
