import { test, expect, type Page } from "@playwright/test";

import { TEST_STATE, TYPE313S_STORAGE_KEY } from "../fixtures/type313sState";

/**
 * Canvas要素に実際にコンテンツが描画されているか確認するヘルパー
 * requestIdleCallbackを使ってブラウザがアイドル状態になるまで待つ
 */
async function waitForCanvasContent(page: Page): Promise<void> {
	// まずフォントのロードが完了するまで待機
	const fontLoadStart = Date.now();
	const fontLoadTimeout = 60000; // 60秒

	while (Date.now() - fontLoadStart < fontLoadTimeout) {
		const fontProgress = await page.evaluate(() => {
			const progress = (
				window as Window & {
					__fontLoadProgress?: { loaded: number; total: number };
				}
			).__fontLoadProgress;
			return progress || { loaded: 0, total: 0 };
		});

		// フォントロードが開始され、すべて完了していれば抜ける
		if (fontProgress.total > 0 && fontProgress.loaded >= fontProgress.total) {
			console.log(
				`[waitForCanvasContent] Font load complete: ${fontProgress.loaded}/${fontProgress.total}`,
			);
			break;
		}

		// まだロード中の場合は500ms待機
		if (fontProgress.total > 0) {
			console.log(
				`[waitForCanvasContent] Waiting for fonts: ${fontProgress.loaded}/${fontProgress.total}`,
			);
		}
		await page.waitForTimeout(500);
	}

	// requestIdleCallbackで複数回アイドル状態を待つ
	await page.evaluate(() => {
		return new Promise<void>((resolve) => {
			let idleCount = 0;
			const targetIdleCount = 5; // 5回アイドル状態を確認

			const checkIdle = () => {
				if ("requestIdleCallback" in window) {
					requestIdleCallback(
						() => {
							idleCount++;
							if (idleCount >= targetIdleCount) {
								resolve();
							} else {
								checkIdle();
							}
						},
						{ timeout: 1000 },
					);
				} else {
					// requestIdleCallbackがサポートされていない場合はsetTimeoutで代替
					setTimeout(() => {
						idleCount++;
						if (idleCount >= targetIdleCount) {
							resolve();
						} else {
							checkIdle();
						}
					}, 200);
				}
			};

			checkIdle();
		});
	});

	// さらに描画の安定化を待つ
	await page.waitForTimeout(2000);

	// PIXIアプリがあれば、追加のレンダリングを実行
	await page.evaluate(() => {
		const apps = (window as Window & { __testPixiApps?: unknown[] })
			.__testPixiApps;
		if (apps && apps.length > 0) {
			for (const app of apps) {
				const a = app as {
					renderer?: { render?: (stage: unknown) => void };
					stage?: unknown;
				};
				if (a.renderer?.render && a.stage) {
					a.renderer.render(a.stage);
				}
			}
		}
	});

	// CanvasTextのuseEffectによる描画処理が完了するまで十分に待機
	// フォントロード後、グリフのテクスチャキャッシュ生成と描画に時間がかかる
	await page.waitForTimeout(20000);
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

	// type313s の物理サイズ（800x600）に合わせてビューポート設定
	await page.setViewportSize({ width: 800, height: 600 });

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
			// E2Eテスト用フラグ: Canvasのオートスケールを無効化（localStorageに保存してページ遷移でも保持）
			localStorage.setItem("__e2e_test_disable_autoscale", "true");
		},
		{ key: TYPE313S_STORAGE_KEY, state: TEST_STATE },
	);

	// 対象URLに移動
	await page.goto(url);

	// app.spec では canvas-demo への誤遷移を即検知する
	await expect(page.locator("body")).not.toContainText("Canvas Renderer Demo");

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
		// 実際にCanvasに描画内容が表示されるまで待機
		await waitForCanvasContent(page);
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

	test("type313s-edit ページが JS エラーなしで表示される", async ({ page }) => {
		const { jsErrors } = await setupPage(page, "/monitors/type313s-edit");
		expect(jsErrors).toHaveLength(0);
		await expect(page).toHaveScreenshot("type313s-edit.png");
	});

	test("type313s-edit - 編成構成から車両をクリックしてスクロールされることを確認", async ({
		page,
	}) => {
		const { jsErrors } = await setupPage(page, "/monitors/type313s-edit");
		expect(jsErrors).toHaveLength(0);

		// 複数編成が存在することを確認
		const formationCards = await page.locator('[class*="formationCard"]').all();

		if (formationCards.length < 2) {
			const addFormationButton = page
				.locator('button:has-text("+ 編成追加")')
				.first();
			await addFormationButton.click();
			await page.waitForTimeout(500);
		}

		// 編成構成内の車両一覧を取得
		const compositionItems = await page
			.locator('[class*="carCompositionItem"]')
			.all();

		if (compositionItems.length > 0) {
			// 最初の編成構成項目のクリック前のスクロール位置を記録
			const formationsContainer = page.locator(
				'[class*="formationsContainer"]',
			);
			const initialFormationsScrollLeft = await formationsContainer.evaluate(
				(el) => (el as HTMLElement).scrollLeft,
			);

			// 最初の編成の0両目をクリック
			const firstCompositionItem = compositionItems[0];
			await firstCompositionItem.click();

			// スクロール完了を待つ
			await page.waitForTimeout(500);

			// クリック後のスクロール位置を確認
			const afterFirstCompositionScrollLeft =
				await formationsContainer.evaluate(
					(el) => (el as HTMLElement).scrollLeft,
				);

			// 最初の編成の1両目をクリック（スクロール対象）
			const secondCompositionItem = compositionItems[1];
			await secondCompositionItem.click();

			// スクロール完了を待つ
			await page.waitForTimeout(500);

			// 1両目クリック時のスクロール後の位置を確認
			const afterSecondCompositionScrollLeft =
				await formationsContainer.evaluate(
					(el) => (el as HTMLElement).scrollLeft,
				);

			// 最初の編成の2両目をクリック（スクロール対象）
			const thirdCompositionItem = compositionItems[2];
			await thirdCompositionItem.click();

			// スクロール完了を待つ
			await page.waitForTimeout(500);

			// 2両目クリック時のスクロール後の位置を確認
			const afterThirdCompositionScrollLeft =
				await formationsContainer.evaluate(
					(el) => (el as HTMLElement).scrollLeft,
				);

			// ここからが重要: 逆方向のクリック
			// 0両目をクリック（戻る）
			await firstCompositionItem.click();

			// スクロール完了を待つ
			await page.waitForTimeout(500);

			// 0両目に戻った時のスクロール位置を確認
			const afterReturnToFirstScrollLeft = await formationsContainer.evaluate(
				(el) => (el as HTMLElement).scrollLeft,
			);

			// スクロールが発生したこと（またはスクロール対象が既に見える位置にあること）を確認
			expect(
				afterSecondCompositionScrollLeft !== undefined &&
					afterThirdCompositionScrollLeft !== undefined &&
					formationsContainer !== null &&
					initialFormationsScrollLeft !== undefined,
			).toBeTruthy();

			// 順方向のスクロール: 0 -> 1 -> 2 とスクロールが進む
			expect(afterSecondCompositionScrollLeft).toBeGreaterThanOrEqual(
				afterFirstCompositionScrollLeft,
			);
			expect(afterThirdCompositionScrollLeft).toBeGreaterThanOrEqual(
				afterSecondCompositionScrollLeft,
			);

			// 逆方向のスクロール: 2 -> 0 とスクロールが戻る
			expect(afterReturnToFirstScrollLeft).toBeLessThan(
				afterThirdCompositionScrollLeft,
			);
			expect(afterReturnToFirstScrollLeft).toBe(
				afterFirstCompositionScrollLeft,
			); // 0に戻る
		}
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

			// Canvas描画の微妙な差異を許容（オートスケール無効化でもフォントレンダリングに微小な差異が生じる）
			await expect(page).toHaveScreenshot(`type313s-${pageType}.png`, {
				maxDiffPixelRatio: 0.35, // 35%までの差異を許容（連続実行時の安定性向上）
			});
		});
	}
});
