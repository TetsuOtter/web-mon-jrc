import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./tests",
	fullyParallel: false,
	workers: 1,
	retries: 0,
	timeout: 60000, // Canvas描画とフォントロード完了のために長めに設定
	reporter: [["html", { open: "never" }], ["list"]],

	use: {
		baseURL: "http://localhost:5173",
		trace: "on-first-retry",
		screenshot: "only-on-failure",
	},

	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],

	webServer: [
		{
			command: "yarn dev",
			cwd: "../app",
			port: 5173,
			reuseExistingServer: true,
		},
		{
			command: "yarn --cwd ../canvas-renderer build && yarn dev",
			cwd: "../canvas-demo",
			port: 5174,
			reuseExistingServer: true,
		},
	],
});
