/* Modified by ChatGPT for: project initialization */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['standard-with-typescript'],
  parserOptions: {
    project: './tsconfig.json'
  },
  env: {
    node: true
  }
};
