import { test, expect, type Page } from "@playwright/test";

async function setupDemoPage(page: Page): Promise<{ jsErrors: string[] }> {
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

	await page.goto("http://localhost:5174/");

	// PIXI初期化完了まで待つ
	await page.waitForSelector("canvas[data-pixi-ready='true']", {
		timeout: 10000,
	});
	// ネットワークアイドルになるまで待機
	await page.waitForLoadState("networkidle", { timeout: 15000 });
	// React StrictMode 二重マウントサイクルと PIXI 描画が安定するまで待機
	await page.waitForTimeout(8000);

	return { jsErrors };
}

async function freezePixiForScreenshot(page: Page): Promise<void> {
	await page.evaluate(() => {
		return new Promise<void>((resolve) => {
			const apps =
				(window as Window & { __testPixiApps?: unknown[] }).__testPixiApps ||
				[];
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
			requestAnimationFrame(() => resolve());
		});
	});
}

test.describe("canvas-demo - JS エラーなし", () => {
	test("デモページが JS エラーなしで表示される", async ({ page }) => {
		const { jsErrors } = await setupDemoPage(page);
		expect(jsErrors).toHaveLength(0);
		await freezePixiForScreenshot(page);
		await expect(page).toHaveScreenshot("demo.png");
	});
});
