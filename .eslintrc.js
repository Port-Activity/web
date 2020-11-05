module.exports = {
  env: {
    es6: true,
    jest: true,
    jasmine: true,
    browser: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    sourceType: 'module',
  },
  plugins: ['react-hooks'],
  rules: {
    quotes: ['warn', 'single'],
    semi: ['error', 'always'],
    'no-var': 'error',
    'no-console': 'off',
    'no-unused-vars': 'warn',
    'no-mixed-spaces-and-tabs': 'warn',
    'react/prop-types': 0,
    'react/display-name': 0,
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  parser: 'babel-eslint',
  settings: {
    react: {
      createClass: 'createReactClass',
      pragma: 'React',
      version: 'detect',
    },
  },
};
