import { chromium, devices } from "playwright";
import { PNG } from "pngjs";

function getPixel(png, x, y) {
  const px = Math.min(png.width - 1, Math.max(0, x));
  const py = Math.min(png.height - 1, Math.max(0, y));
  const i = (py * png.width + px) * 4;
  return [png.data[i], png.data[i + 1], png.data[i + 2], png.data[i + 3]];
}

function isBlack(png, x, y) {
  const [r, g, b, a] = getPixel(png, x, y);
  return a > 200 && r < 30 && g < 30 && b < 30;
}

function isWhite(png, x, y) {
  const [r, g, b, a] = getPixel(png, x, y);
  return a > 200 && r > 225 && g > 225 && b > 225;
}

async function captureLineTestPngBase64(page) {
  return page.evaluate(() => {
    const canvases = Array.from(
      document.querySelectorAll(
        "[data-testid='line-pixel-alignment-test'] canvas[data-pixi-ready='true']",
      ),
    );
    const canvas = canvases.at(-1);
    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new Error("Line pixel test canvas not found");
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
      if (msg.type() === "error") jsErrors.push(`[console.error] ${msg.text()}`);
    });

    await page.addInitScript(`
      (function() {
        var orig = window.setInterval.bind(window);
        window.setInterval = function(fn, delay) {
          if (typeof delay === "number" && delay < 2000) return 0;
          return orig.apply(window, arguments);
        };
      })();
    `);

    await page.goto("http://localhost:5174/?linePixelTest=1");
    await page.waitForSelector("canvas[data-pixi-ready='true']", { timeout: 10000 });
    await page.waitForLoadState("networkidle", { timeout: 15000 });
    await page.waitForTimeout(4000);

    await page.evaluate(() => {
      const apps = window.__testPixiApps || [];
      for (const app of apps) {
        app.ticker?.stop();
        if (app.renderer && app.stage != null) {
          app.renderer.render(app.stage);
        }
      }
    });

    let png = null;
    for (let i = 0; i < 40; i += 1) {
      const pngBase64 = await captureLineTestPngBase64(page);
      png = PNG.sync.read(Buffer.from(pngBase64, "base64"));
      if (isBlack(png, 197, 363) && isBlack(png, 213, 341)) {
        break;
      }
      await page.waitForTimeout(250);
      await page.evaluate(() => {
        const apps = window.__testPixiApps || [];
        for (const app of apps) {
          app.ticker?.stop();
          if (app.renderer && app.stage != null) {
            app.renderer.render(app.stage);
          }
        }
      });
    }

    if (png == null) {
      throw new Error("Failed to capture line pixel test PNG");
    }

    const failures = [];

    if (jsErrors.length > 0) {
      failures.push(`JS errors: ${jsErrors.join(" | ")}`);
    }
    if (png.width !== 260 || png.height !== 400) {
      failures.push(`Unexpected canvas size: ${png.width}x${png.height}`);
    }

    if (!isBlack(png, 197, 363)) failures.push("Expected black at (197,363)");
    if (!isBlack(png, 197, 372)) failures.push("Expected black at (197,372)");
    if (!isWhite(png, 196, 372)) failures.push("Expected white at (196,372)");

    if (!isBlack(png, 213, 341)) failures.push("Expected black at (213,341)");
    if (!isBlack(png, 222, 341)) failures.push("Expected black at (222,341)");
    if (!isWhite(png, 222, 340)) failures.push("Expected white at (222,340)");

    // 2px 横線: (194, 211) -> (241, 211)
    if (!isBlack(png, 194, 210)) failures.push("Expected black at (194,210)");
    if (!isBlack(png, 194, 211)) failures.push("Expected black at (194,211)");
    if (!isBlack(png, 241, 210)) failures.push("Expected black at (241,210)");
    if (!isBlack(png, 241, 211)) failures.push("Expected black at (241,211)");
    if (!isWhite(png, 241, 209)) failures.push("Expected white at (241,209)");
    if (!isWhite(png, 242, 210)) failures.push("Expected white at (242,210)");

    const sample = {
      p197_363: getPixel(png, 197, 363),
      p197_372: getPixel(png, 197, 372),
      p196_372: getPixel(png, 196, 372),
      p213_341: getPixel(png, 213, 341),
      p222_341: getPixel(png, 222, 341),
      p222_340: getPixel(png, 222, 340),
      p194_210: getPixel(png, 194, 210),
      p194_211: getPixel(png, 194, 211),
      p241_210: getPixel(png, 241, 210),
      p241_211: getPixel(png, 241, 211),
      p241_209: getPixel(png, 241, 209),
      p242_210: getPixel(png, 242, 210),
    };

    const result = {
      ok: failures.length === 0,
      failures,
      sample,
    };

    if (result.ok) {
      console.log(JSON.stringify(result));
      return 0;
    }

    console.error(JSON.stringify(result));
    return 1;
  } finally {
    await context.close();
    await browser.close();
  }
}

const code = await run();
process.exit(code);
