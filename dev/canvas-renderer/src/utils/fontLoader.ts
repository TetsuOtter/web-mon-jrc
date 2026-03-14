import { $Font } from "bdfparser";

import type { Font } from "bdfparser";

export const AVAILABLE_FONTS = {
	jiskan16: "jiskan16",
	"8x16rk": "8x16rk",
	MonNumFont: "MonNumFont",
} as const satisfies Record<string, string>;
export type AvailableFont =
	(typeof AVAILABLE_FONTS)[keyof typeof AVAILABLE_FONTS];

const AVAILABLE_FONT_PATHS = {
	jiskan16: `${import.meta.env.BASE_URL}jiskan16-unicode.bdf`,
	"8x16rk": `${import.meta.env.BASE_URL}8x16rk-unicode.bdf`,
	MonNumFont: `${import.meta.env.BASE_URL}MonNumFont-16.bdf`,
} as const satisfies Record<AvailableFont, string>;

async function* getLines(text: string): AsyncGenerator<string> {
	const lines = text.split(/\r?\n/);
	for (const line of lines) {
		yield line;
	}
}

const fontCache = new Map<AvailableFont, Promise<Font>>();

// テスト用: フォントロードの進行状況を追跡
if (typeof window !== "undefined") {
	(
		window as Window & {
			__fontLoadProgress?: { loaded: number; total: number };
		}
	).__fontLoadProgress = {
		loaded: 0,
		total: 0,
	};
}

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
		// テスト用: ロード開始をカウント
		if (typeof window !== "undefined") {
			const progress = (
				window as Window & {
					__fontLoadProgress?: { loaded: number; total: number };
				}
			).__fontLoadProgress;
			if (progress) {
				progress.total++;
			}
		}

		const response = await fetch(AVAILABLE_FONT_PATHS[font]);
		const fontText = await response.text();
		const loadedFont = await $Font(getLines(fontText));

		// テスト用: ロード完了をカウント
		if (typeof window !== "undefined") {
			const progress = (
				window as Window & {
					__fontLoadProgress?: { loaded: number; total: number };
				}
			).__fontLoadProgress;
			if (progress) {
				progress.loaded++;
			}
		}

		return loadedFont;
	})();

	fontCache.set(font, fontPromise);
	return fontPromise;
}
