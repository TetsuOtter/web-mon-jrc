module.exports = {
	root: true,
	env: { browser: true, es2020: true },
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/strict",
		"plugin:react/all",
		"plugin:react-hooks/recommended",
		"plugin:import/recommended",
		"plugin:import/typescript",
		"plugin:prettier/recommended",
	],
	ignorePatterns: [
		"node_modules",
		"packages",
		"dist",
		".eslintrc.cjs",
		"vite.config.ts",
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
		project: true,
		tsconfigRootDir: __dirname,
	},
	settings: {
		react: {
			version: "detect",
		},
	},
	plugins: ["react-refresh", "@typescript-eslint", "react"],
	rules: {
		"react/jsx-uses-react": "off",
		"react/react-in-jsx-scope": "off",
		"react/jsx-no-literals": "off",
		"react/jsx-no-leaked-render": "off",
		"react/forbid-component-props": "off",
		"react/prop-types": "off",
		"import/order": [
			"error",
			{
				groups: [
					"builtin",
					"external",
					"internal",
					"parent",
					"sibling",
					"index",
					"object",
					"type",
					"unknown",
				],
				pathGroups: [
					{
						pattern: "{react,react-dom/**,react-router-dom}",
						group: "builtin",
						position: "before",
					},
				],
				pathGroupsExcludedImportTypes: ["builtin", "object"],
				alphabetize: {
					order: "asc",
				},
				"newlines-between": "always",
			},
		],
		"no-unused-vars": "off",
		"@typescript-eslint/no-unused-vars": [
			"error",
			{
				args: "all",
				argsIgnorePattern: "^_",
				caughtErrors: "all",
				caughtErrorsIgnorePattern: "^_",
				destructuredArrayIgnorePattern: "^_",
				varsIgnorePattern: "^_",
				ignoreRestSiblings: true,
			},
		],
		"@typescript-eslint/consistent-type-imports": [
			"error",
			{ prefer: "type-imports" },
		],
		"@typescript-eslint/strict-boolean-expressions": ["off"],
		"react/function-component-definition": [
			"error",
			{
				namedComponents: "arrow-function",
				unnamedComponents: "arrow-function",
			},
		],
		"react/jsx-filename-extension": [
			"error",
			{
				extensions: [".tsx"],
			},
		],
		"react/jsx-max-depth": "off",
		"react/jsx-sort-props": "off",
		"react/require-default-props": "off",
		"react/jsx-no-bind": [
			"error",
			{
				allowArrowFunctions: true,
			},
		],
		"react/jsx-props-no-spreading": "off",
		"react/jsx-no-useless-fragment": [
			"error",
			{
				allowExpressions: true,
			},
		],
		"@typescript-eslint/consistent-type-definitions": ["error", "type"],
		"no-invalid-void-type": "off",
		"object-curly-newline": ["error", { consistent: true }],
		"array-bracket-newline": ["error", "consistent"],
		"array-element-newline": ["error", "consistent"],
	},
};
