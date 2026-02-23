import { configApp } from '@adonisjs/eslint-config';
import depend from 'eslint-plugin-depend';

export default [
  ...configApp(),
  depend.configs['flat/recommended'],
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'error',
      curly: ['error', 'all'],
      'padding-line-between-statements': [
        'warn',
        { blankLine: 'always', prev: 'block-like', next: '*' },
        { blankLine: 'always', prev: '*', next: 'block-like' },
      ],
    },
  },
];
