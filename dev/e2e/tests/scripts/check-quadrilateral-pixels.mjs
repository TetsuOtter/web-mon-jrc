import { chromium, devices } from "playwright";
import { PNG } from "pngjs";

function getPixel(png, x, y) {
	const px = Math.min(png.width - 1, Math.max(0, x));
	const py = Math.min(png.height - 1, Math.max(0, y));
	const i = (py * png.width + px) * 4;
	return [png.data[i], png.data[i + 1], png.data[i + 2], png.data[i + 3]];
}

function colorToString(color) {
	const [r, g, b, a] = color;
	return `rgba(${r},${g},${b},${a})`;
}

function isRed(png, x, y) {
	const [r, g, b, a] = getPixel(png, x, y);
	return a > 200 && r > 200 && g < 100 && b < 100;
}

function isBlack(png, x, y) {
	const [r, g, b, a] = getPixel(png, x, y);
	return a > 200 && r < 30 && g < 30 && b < 30;
}

function isWhite(png, x, y) {
	const [r, g, b, a] = getPixel(png, x, y);
	return a > 200 && r > 225 && g > 225 && b > 225;
}

async function captureQuadrilateralTestPng(page) {
	return page.evaluate(() => {
		const div = document.querySelector("[data-testid='quadrilateral-test']");
		if (!div) throw new Error("Quadrilateral test container not found");

		const canvas = div.querySelector("canvas[data-pixi-ready='true']");
		if (!(canvas instanceof HTMLCanvasElement)) {
			throw new Error("Quadrilateral test canvas not found");
		}

		return canvas.toDataURL("image/png").replace(/^data:image\/png;base64,/, "");
	});
}

async function run() {
	const browser = await chromium.launch({ headless: true });
	const context = await browser.newContext({ ...devices["Desktop Chrome"] });
	const page = await context.newPage();

	try {
		const jsErrors = [];
		page.on("pageerror", (error) => jsErrors.push(error.message));
		page.on("console", (msg) => {
			const text = msg.text();
			console.error(`[${msg.type()}] ${text}`);
			if (msg.type() === "error") jsErrors.push(`[console.error] ${text}`);
		});

		await page.addInitScript(`
			(function() {
				// E2Eテストモード設定
				localStorage.setItem("__e2e_test_disable_autoscale", "true");

				var orig = window.setInterval.bind(window);
				window.setInterval = function(fn, delay) {
					if (typeof delay === 'number' && delay < 2000) return 0;
					return orig.apply(window, arguments);
				};
			})();
		`);

		console.error("Opening page...");
		await page.goto("http://localhost:5174/", { waitUntil: "domcontentloaded", timeout: 15000 });
		console.error("Waiting for canvas...");
		await page.waitForSelector("canvas[data-pixi-ready='true']", {
			timeout: 10000,
		});
		console.error("Waiting for stabilization...");
		await page.waitForTimeout(3000);

		console.error("Freezing PIXI...");
		// PIXI レンダラーを停止
		await page.evaluate(() => {
			const apps =
				(window.__testPixiApps) || [];
			for (const app of apps) {
				if (!app) continue;
				const a = app;
				if (a.ticker) a.ticker.stop();
				if (a.renderer && a.stage != null) {
					// graphicsContainers の状態をログ
					const gcs = (window).__debugGraphicsContainers || [];
					console.error(`DEBUG: Found ${gcs.length} graphicsContainers`);
					for (let i = 0; i < gcs.length; i++) {
						const gc = gcs[i];
						console.error(`  Container[${i}]: visible=${gc.visible}, children=${gc.children.length}, alpha=${gc.alpha}`);
					}
					a.renderer.render(a.stage);
				}
			}

			return new Promise((resolve) => {
				requestAnimationFrame(() => resolve());
			});
		});

		console.error("Capturing PNG...");
		const pngBase64 = await captureQuadrilateralTestPng(page);
		const pngBuffer = Buffer.from(pngBase64, "base64");
		const png = PNG.sync.read(pngBuffer);

		console.error(`PNG captured: ${png.width}x${png.height}`);

		const failures = [];

		// デバッグ用：(20,10) のピクセルをチェック
		const testPixel = getPixel(png, 20, 10);
		console.error(`DEBUG: Pixel at (20,10): ${colorToString(testPixel)}`);

		// テスト1: 各頂点がストローク色（赤）であること
		const vertices = [
			{ x: 20, y: 10, name: "左上" },
			{ x: 40, y: 10, name: "右上" },
			{ x: 30, y: 40, name: "右下" },
			{ x: 10, y: 40, name: "左下" },
		];

		for (const { x, y, name } of vertices) {
			const color = getPixel(png, x, y);
			console.error(`${name}(${x},${y}): ${colorToString(color)}`);
			if (!isRed(png, x, y)) {
				failures.push(
					`頂点 ${name} (${x},${y}) が赤でない: ${colorToString(color)}`,
				);
			}
		}

		// テスト2: 各頂点の外側方向がキャンバス色（白）であること
		const outsidePoints = [
			{
				x: 20,
				y: 10,
				outsidePoints: [
					{ dx: -1, dy: -1, name: "左上外" },
					{ dx: -1, dy: 0, name: "左側外" },
					{ dx: 0, dy: -1, name: "上側外" },
				],
			},
			{
				x: 40,
				y: 10,
				outsidePoints: [
					{ dx: 1, dy: -1, name: "右上外" },
					{ dx: 1, dy: 0, name: "右側外" },
					{ dx: 0, dy: -1, name: "上側外" },
				],
			},
			{
				x: 30,
				y: 40,
				outsidePoints: [
					{ dx: 1, dy: 1, name: "右下外" },
					{ dx: 1, dy: 0, name: "右側外" },
					{ dx: 0, dy: 1, name: "下側外" },
				],
			},
			{
				x: 10,
				y: 40,
				outsidePoints: [
					{ dx: -1, dy: 1, name: "左下外" },
					{ dx: -1, dy: 0, name: "左側外" },
					{ dx: 0, dy: 1, name: "下側外" },
				],
			},
		];

		for (const point of outsidePoints) {
			for (const outside of point.outsidePoints) {
				const checkX = point.x + outside.dx;
				const checkY = point.y + outside.dy;
				const color = getPixel(png, checkX, checkY);
				console.error(`${outside.name}(${checkX},${checkY}): ${colorToString(color)}`);
				if (!isWhite(png, checkX, checkY)) {
					failures.push(
						`頂点 (${point.x},${point.y}) の${outside.name} (${checkX},${checkY}) が白でない: ${colorToString(color)}`,
					);
				}
			}
		}

		// テスト3: 辺の中間点がストローク色（赤）であること
		const edgeMidpoints = [
			{ x: 30, y: 10, name: "上辺中点" },
			{ x: 35, y: 25, name: "右辺中点" },
			{ x: 20, y: 40, name: "下辺中点" },
			{ x: 15, y: 25, name: "左辺中点" },
		];

		for (const { x, y, name } of edgeMidpoints) {
			const color = getPixel(png, x, y);
			console.error(`${name}(${x},${y}): ${colorToString(color)}`);
			if (!isRed(png, x, y)) {
				failures.push(
					`${name} (${x},${y}) が赤でない: ${colorToString(color)}`,
				);
			}
		}

		// テスト4: ストローク内側が黒でフィルされていること（サンプル点）
		const innerPoints = [
			{ x: 25, y: 20, name: "上部内側" },
			{ x: 25, y: 25, name: "中央" },
			{ x: 20, y: 35, name: "下部内側" },
			{ x: 25, y: 30, name: "中央下" },
		];

		for (const point of innerPoints) {
			const color = getPixel(png, point.x, point.y);
			console.error(`${point.name}(${point.x},${point.y}): ${colorToString(color)}`);
			if (!isBlack(png, point.x, point.y)) {
				failures.push(
					`${point.name} (${point.x},${point.y}) が黒でない: ${colorToString(color)}`,
				);
			}
		}

		// テスト5: 上下辺のストローク幅が均一であること（lineWidth=4）
		// 上辺中点(30,10)から下方向に赤ピクセルを数える
		let topStrokeWidth = 0;
		for (let y = 10; y < png.height; y++) {
			if (isRed(png, 30, y)) topStrokeWidth++;
			else break;
		}
		// 下辺中点(20,40)から上方向に赤ピクセルを数える
		let bottomStrokeWidth = 0;
		for (let y = 40; y >= 0; y--) {
			if (isRed(png, 20, y)) bottomStrokeWidth++;
			else break;
		}
		console.error(`上辺ストローク幅: ${topStrokeWidth}px, 下辺ストローク幅: ${bottomStrokeWidth}px`);
		if (topStrokeWidth !== 4) {
			failures.push(`上辺のストローク幅が4でない: ${topStrokeWidth}px`);
		}
		if (bottomStrokeWidth !== 4) {
			failures.push(`下辺のストローク幅が4でない: ${bottomStrokeWidth}px`);
		}
		if (topStrokeWidth !== bottomStrokeWidth) {
			failures.push(`上辺(${topStrokeWidth}px)と下辺(${bottomStrokeWidth}px)のストローク幅が異なる`);
		}

		const result = {
			ok: failures.length === 0,
			failures,
		};

		console.log(JSON.stringify(result));
		process.exit(result.ok ? 0 : 1);
	} catch (error) {
		console.error("Test execution error:", error);
		console.log(JSON.stringify({ ok: false, failures: [error.message] }));
		process.exit(1);
	} finally {
		await browser.close();
	}
}

run().catch((error) => {
	console.error("Test failed with error:", error);
	process.exit(1);
});
