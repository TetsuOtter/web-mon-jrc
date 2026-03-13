import js from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import reactRefreshPlugin from 'eslint-plugin-react-refresh'
import importPlugin from 'eslint-plugin-import'
import prettierConfig from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'

/**
 * 共有ESLintベース設定（flat config）。
 * @param {string} tsconfigPath - tsconfig.json へのパス
 */
export const createBaseConfig = (tsconfigPath) => [
  { ignores: ['node_modules', 'packages', 'dist'] },
  js.configs.recommended,
  ...tsPlugin.configs['flat/strict'],
  reactPlugin.configs.flat.all,
  reactHooksPlugin.configs['recommended-latest'],
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  {
    plugins: {
      'react-refresh': reactRefreshPlugin,
      prettier: prettierPlugin,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        projectService: true,
      },
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: tsconfigPath,
        },
      },
    },
    rules: {
      ...prettierConfig.rules,
      'prettier/prettier': 'error',
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-no-literals': 'off',
      'react/jsx-no-leaked-render': 'off',
      'react/forbid-component-props': 'off',
      'react/prop-types': 'off',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type', 'unknown'],
          pathGroups: [
            { pattern: '{react,react-dom/**,react-router-dom}', group: 'builtin', position: 'before' },
          ],
          pathGroupsExcludedImportTypes: ['builtin', 'object'],
          alphabetize: { order: 'asc' },
          'newlines-between': 'always',
        },
      ],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/no-invalid-void-type': 'off',
      'react/function-component-definition': [
        'error',
        { namedComponents: 'arrow-function', unnamedComponents: 'arrow-function' },
      ],
      'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
      'react/jsx-max-depth': 'off',
      'react/jsx-sort-props': 'off',
      'react/require-default-props': 'off',
      'react/jsx-no-bind': ['error', { allowArrowFunctions: true }],
      'react/jsx-props-no-spreading': 'off',
      'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      'object-curly-newline': ['error', { consistent: true }],
      'array-bracket-newline': ['error', 'consistent'],
      'array-element-newline': ['error', 'consistent'],
    },
  },
]
