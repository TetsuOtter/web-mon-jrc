import { AVAILABLE_FONTS, type AvailableFont } from "../utils/fontLoader";

import type { Bitmap } from "bdfparser";

/**
 * グリフの描画データ（ビットマップ + 配置情報）
 */
export type GlyphData = {
	/** グリフのビットマップ（BBXサイズ） */
	bitmap: Bitmap;
	/** 水平方向の進み幅（DWIDTH） */
	advanceWidth: number;
	/** セル左端からビットマップ左端までのオフセット（BBX x-offset） */
	xOffset: number;
	/** セル上端からビットマップ上端までのオフセット（フォントの ascent と BBX y-offset から計算） */
	yOffset: number;
};

/**
 * 全角・半角を含むフォント情報型
 */
export type FontInfo = {
	/** フォントの高さ（ピクセル単位） */
	readonly fontSize: number;
	/** 全角文字用フォント */
	readonly fullWidth: AvailableFont | readonly AvailableFont[];
	/** 半角文字用フォント */
	readonly halfWidth: AvailableFont | readonly AvailableFont[];

	readonly cache: Map<string, GlyphData>;
};

/**
 * デフォルトのFontInfo（全角：jiskan16、半角：8x16rk）
 */
export const DEFAULT_FONT_INFO: FontInfo = {
	fontSize: 16,
	fullWidth: AVAILABLE_FONTS.jiskan16,
	halfWidth: [AVAILABLE_FONTS["MonNumFont"], AVAILABLE_FONTS["8x16rk"]],
	cache: new Map(),
};

/**
 * 文字が全角かどうかを判定
 */
export function isFullWidthChar(char: string): boolean {
	const code = char.charCodeAt(0);

	// ASCII範囲（U+0000 - U+007F）は半角
	if (0x0000 <= code && code <= 0x007f) {
		return false;
	}

	// 半角カタカナ範囲（U+FF61 - U+FF9F）は半角
	if (0xff61 <= code && code <= 0xff9f) {
		return false;
	}

	return true;
}
