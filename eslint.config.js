import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import promise from 'eslint-plugin-promise';
import n from 'eslint-plugin-n';

export default [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json'
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      promise,
      n
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      'no-console': 'warn'
    }
  }
];
