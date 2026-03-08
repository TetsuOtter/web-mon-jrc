import { test, expect, type Page } from "@playwright/test";

import { TEST_STATE, TYPE313S_STORAGE_KEY } from "../fixtures/type313sState";

/**
 * PIXIティッカーを停止して1フレーム強制描画し、スクリーンショットを決定的にするヘルパー
 */
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
			// ブラウザコンポジターが描画バッファを反映するまで1フレーム待つ
			requestAnimationFrame(() => resolve());
		});
	});
}

/**
 * ページ遷移前に localStorage に固定ステートをセットし、
 * コンソールエラーを収集するヘルパー
 */
async function setupPage(
	page: Page,
	url: string,
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

	// まず空ページに移動してから localStorage をセット
	await page.goto("/");
	await page.evaluate(
		({ key, state }) => {
			localStorage.setItem(key, JSON.stringify(state));
		},
		{ key: TYPE313S_STORAGE_KEY, state: TEST_STATE },
	);

	// 対象URLに移動
	await page.goto(url);

	// PIXI を使うページは data-pixi-ready が付くまで待つ。
	// 付かないページ（Canvasなし）はタイムアウト後にスキップ。
	const pixiReady = await page
		.waitForSelector("canvas[data-pixi-ready='true']", { timeout: 8000 })
		.catch(() => null);

	if (pixiReady) {
		// BDF フォントなどのネットワークリクエストが完了するまで待機
		await page.waitForLoadState("networkidle", { timeout: 15000 });
		// React StrictMode 二重マウントサイクルと PIXI 描画が安定するまで待機
		await page.waitForTimeout(10000);
	} else {
		// Canvas なしページ
		await page.waitForTimeout(500);
	}

	return { jsErrors };
}

// テスト対象ページ一覧（ pageType → mode の組み合わせ）
const TYPE313S_PAGES = [
	{ pageType: "MENU", mode: "DRIVER" },
	{ pageType: "POWER_BRAKE", mode: "DRIVER" },
	{ pageType: "THREE_PHASE_AC", mode: "DRIVER" },
	{ pageType: "BRAKE", mode: "DRIVER" },
	{ pageType: "POWER", mode: "DRIVER" },
	{ pageType: "SWITCHES", mode: "DRIVER" },
	{ pageType: "DRIVER_INFO", mode: "DRIVER" },
	{ pageType: "CONDUCTOR_INFO", mode: "CONDUCTOR" },
	{ pageType: "CORRECTION_MENU", mode: "CORRECTION" },
	{ pageType: "LOCATION_CORRECTION", mode: "CORRECTION" },
	{ pageType: "WORK_SETTING_TOP", mode: "WORK_SETTING" },
	{ pageType: "MAINTENANCE_MENU", mode: "MAINTENANCE" },
	{ pageType: "SETTING_MENU", mode: "DRIVER" },
];

test.describe("type313s アプリ - JS エラーなし", () => {
	test("インデックスページが JS エラーなしで表示される", async ({ page }) => {
		const { jsErrors } = await setupPage(page, "/");
		expect(jsErrors).toHaveLength(0);
		await expect(page).toHaveScreenshot("index.png");
	});

	test("type313s-edit ページが JS エラーなしで表示される", async ({
		page,
	}) => {
		const { jsErrors } = await setupPage(page, "/monitors/type313s-edit");
		expect(jsErrors).toHaveLength(0);
		await expect(page).toHaveScreenshot("type313s-edit.png");
	});

	for (const { pageType, mode } of TYPE313S_PAGES) {
		test(`${pageType} (mode=${mode}) が JS エラーなしで表示される`, async ({
			page,
		}) => {
			const { jsErrors } = await setupPage(
				page,
				`/monitors/type313s/${pageType}?mode=${mode}`,
			);
			expect(jsErrors).toHaveLength(0);
			await freezePixiForScreenshot(page);
			await expect(page).toHaveScreenshot(`type313s-${pageType}.png`);
		});
	}
});
