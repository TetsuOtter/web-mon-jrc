module.exports = {
	extends: ["../app/.eslintrc.cjs"],
	parserOptions: {
		tsconfigRootDir: __dirname,
		project: true,
	},
	ignorePatterns: [
		"node_modules",
		"packages",
		"dist",
		".eslintrc.cjs",
		"vite.config.ts",
		"src/**/__tests__/**",
		"vitest.config.ts",
		"vitest.setup.ts",
	],
};
