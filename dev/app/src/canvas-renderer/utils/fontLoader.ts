import { $Font } from "bdfparser";

import type { Font } from "bdfparser";

export const AVAILABLE_FONTS = {
	jiskan16: "jiskan16",
	"8x16rk": "8x16rk",
} as const satisfies Record<string, string>;
export type AvailableFont =
	(typeof AVAILABLE_FONTS)[keyof typeof AVAILABLE_FONTS];

const AVAILABLE_FONT_PATHS = {
	jiskan16: "/jiskan16-unicode.bdf",
	"8x16rk": "/8x16rk.bdf",
} as const satisfies Record<AvailableFont, string>;

async function* getLines(text: string): AsyncGenerator<string> {
	const lines = text.split(/\r?\n/);
	for (const line of lines) {
		yield line;
	}
}

const fontCache = new Map<AvailableFont, Promise<Font>>();

/**
 * BDFフォントを読み込む（グローバルキャッシュを使用）
 */
export async function loadFont(font: AvailableFont): Promise<Font> {
	// キャッシュから取得
	const cachedFont = fontCache.get(font);
	if (cachedFont != null) {
		return cachedFont;
	}

	// フォント読み込みのPromiseをキャッシュに追加
	const fontPromise = (async () => {
		const response = await fetch(AVAILABLE_FONT_PATHS[font]);
		const fontText = await response.text();
		return await $Font(getLines(fontText));
	})();

	fontCache.set(font, fontPromise);
	return fontPromise;
}
