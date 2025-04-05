import * as lit from 'eslint-plugin-lit';
import {globalIgnores} from 'eslint/config';
// import {Linter} from '@types/eslint'
import tseslint from 'typescript-eslint';

export default tseslint.config([
  globalIgnores([
    //
    'node_modules/*',
    'docs/*',
    'docs-src/*',
    'rollup-config.js',
    'custom-elements.json',
    'web-dev-server.config.js',
  ]),
  // {
  //   files: ['**/*.ts'],
  //   rules: {'no-unused-vars': 'off'},
  // },
  // ...(tseslint.config(tseslint.configs.recommended) as any),
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      globals: {
        browser: true,
      },
    },
    // plugins: {
    //   '@typescript-eslint': tsPlugin.configs,
    // },
    rules: {
      'no-prototype-builtins': 'off',
      'prefer-const': 'off',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-expect-error': false,
        },
      ],
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-wrapper-object-types': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-this-alias': 'off',
      '@typescript-eslint/consistent-indexed-object-style': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: ['**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
  {
    ...lit.configs['flat/recommended'],
    files: ['**/*.ts'],
  },
  {
    files: ['rollup.config.js', 'web-test-runner.config.js'],
    languageOptions: {
      globals: {
        node: true,
      },
    },
  },
  {
    files: ['*_test.ts', '**/custom_typings/*.ts', 'packages/labs/ssr/src/test/integration/tests/**', 'packages/labs/ssr/src/lib/util/parse5-utils.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
]);
