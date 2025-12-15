import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import pluginPrettier from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
      prettier,
    ],
    plugins: {
      import: importPlugin,
      react: reactPlugin,
      prettier: pluginPrettier,
    },
    rules: {
      // React
      'react/react-in-jsx-scope': 'off',
      'react/jsx-no-useless-fragment': 'warn',

      // Style / consistency
      'prefer-const': 'error',
      'no-negated-condition': 'warn',
      eqeqeq: ['error', 'smart'],
      'consistent-return': 'warn',
      'prefer-arrow-callback': 'error',
      'no-else-return': 'warn',

      // Imports
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          pathGroups: [
            { pattern: 'react', group: 'external', position: 'before' },
            { pattern: '@mui/**', group: 'external', position: 'after' },
            { pattern: '@tanstack/**', group: 'external', position: 'after' },
            { pattern: 'dayjs', group: 'external', position: 'after' },
          ],
          pathGroupsExcludedImportTypes: ['react'],
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/extensions': 'off',
      'import/no-self-import': 'error',

      // Prettier
      'prettier/prettier': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
]);
