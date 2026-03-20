import { defineConfig, devices } from "@playwright/test";

const workers = process.env.E2E_WORKERS
	? Number.parseInt(process.env.E2E_WORKERS, 10)
	: process.env.GITHUB_ACTIONS === "true"
		? 8
		: 4;

export default defineConfig({
	testDir: "./tests",
	globalSetup: "./global-setup.ts",
	fullyParallel: false,
	workers: Number.isFinite(workers) && workers > 0 ? workers : 4,
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
		{
			name: "webkit",
			use: { ...devices["Desktop Safari"] },
		},
	],

	webServer: [
		{
			command: "yarn dev --force",
			cwd: "../app",
			port: 5173,
			reuseExistingServer: true,
		},
		{
			command: "yarn dev --force",
			cwd: "../canvas-demo",
			port: 5174,
			reuseExistingServer: true,
		},
	],
});
