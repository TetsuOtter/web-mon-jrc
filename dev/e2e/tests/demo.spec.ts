import { test, expect, type Page } from "@playwright/test";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

async function setupDemoPage(
	page: Page,
	url = "http://localhost:5174/",
	stabilizeMs = 8000,
): Promise<{ jsErrors: string[] }> {
	const jsErrors: string[] = [];

	page.on("pageerror", (error) => {
		jsErrors.push(error.message);
	});
	page.on("console", (msg) => {
		if (msg.type() === "error") {
			jsErrors.push(`[console.error] ${msg.text()}`);
		}
	});

	// BlinkingItem の setInterval を無効化してスクリーンショットを決定的にする
	// ページスクリプトより先に実行されるため、点滅用の短い interval は登録されない
	await page.addInitScript(`
		(function() {
			var orig = window.setInterval.bind(window);
			window.setInterval = function(fn, delay) {
				if (typeof delay === 'number' && delay < 2000) return 0;
				return orig.apply(window, arguments);
			};
		})();
	`);

	await page.goto(url);

	// PIXI初期化完了まで待つ
	await page.waitForSelector("canvas[data-pixi-ready='true']", {
		timeout: 10000,
	});
	// ネットワークアイドルになるまで待機
	await page.waitForLoadState("networkidle", { timeout: 15000 });
	// React StrictMode 二重マウントサイクルと PIXI 描画が安定するまで待機
	await page.waitForTimeout(stabilizeMs);

	return { jsErrors };
}

async function freezePixiForScreenshot(
	page: Page,
	waitForAnimationFrame = true,
): Promise<void> {
	await page.evaluate((shouldWaitForAnimationFrame) => {
		const apps =
			(window as Window & { __testPixiApps?: unknown[] }).__testPixiApps || [];
		for (const app of apps) {
			const a = app as {
				ticker?: { stop: () => void };
				renderer?: { render: (stage: unknown) => void };
				stage?: unknown;
			};
			a.ticker?.stop();
			if (a.renderer && a.stage != null) {
				a.renderer.render(a.stage);
			}
		}

		if (!shouldWaitForAnimationFrame) return;
		return new Promise<void>((resolve) => {
			requestAnimationFrame(() => resolve());
		});
	}, waitForAnimationFrame);
}

test.describe("canvas-demo - JS エラーなし", () => {
	test("デモページが JS エラーなしで表示される", async ({ page }) => {
		const { jsErrors } = await setupDemoPage(page);
		expect(jsErrors).toHaveLength(0);
		await freezePixiForScreenshot(page);
		await expect(page).toHaveScreenshot("demo.png");
	});

	test("CanvasLine の 1px/2px 線が座標ずれしない", async () => {
		try {
			const { stdout } = await execFileAsync(
				"node",
				["tests/scripts/check-line-pixels.mjs"],
				{ cwd: process.cwd() },
			);
			const lines = stdout
				.split("\n")
				.map((line) => line.trim())
				.filter((line) => line.length > 0);
			const lastLine = lines.at(-1) || "{}";
			const result = JSON.parse(lastLine) as {
				ok?: boolean;
				failures?: string[];
			};
			expect(result.ok).toBe(true);
		} catch (error) {
			const e = error as Error & { stdout?: string; stderr?: string };
			throw new Error(
				[
					"Line pixel check script failed.",
					e.stdout ? `stdout: ${e.stdout}` : "",
					e.stderr ? `stderr: ${e.stderr}` : "",
				]
					.filter(Boolean)
					.join("\n"),
			);
		}
	});
});
