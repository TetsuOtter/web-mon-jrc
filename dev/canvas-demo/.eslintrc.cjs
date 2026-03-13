module.exports = {
	root: true,
	extends: ["../.eslintrc.base.cjs"],
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
		project: true,
		tsconfigRootDir: __dirname,
	},
	settings: {
		"import/resolver": {
			typescript: {
				alwaysTryTypes: true,
				project: "./tsconfig.json",
			},
		},
	},
	ignorePatterns: [
		"node_modules",
		"packages",
		"dist",
		".eslintrc.cjs",
		"vite.config.ts",
	],
};
