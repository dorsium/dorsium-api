import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import promise from 'eslint-plugin-promise';
import n from 'eslint-plugin-n';

export default [
  js.configs.recommended,
  ...tsPlugin.configs['flat/recommended'],
  promise.configs['flat/recommended'],
  n.configs['flat/recommended'],
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
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      'no-console': 'warn'
    }
  }
];
