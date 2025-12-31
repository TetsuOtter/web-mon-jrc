import { AVAILABLE_FONTS, type AvailableFont } from "../utils/fontLoader";

/**
 * 全角・半角を含むフォント情報型
 */
export type FontInfo = {
	/** フォントの高さ（ピクセル単位） */
	readonly fontSize: number;
	/** 全角文字用フォント */
	readonly fullWidth: AvailableFont;
	/** 半角文字用フォント */
	readonly halfWidth: AvailableFont;
};

/**
 * デフォルトのFontInfo（全角：jiskan16、半角：8x16rk）
 */
export const DEFAULT_FONT_INFO: FontInfo = {
	fontSize: 16,
	fullWidth: AVAILABLE_FONTS.jiskan16,
	halfWidth: AVAILABLE_FONTS["8x16rk"],
};

/**
 * 文字が全角かどうかを判定
 */
export function isFullWidthChar(char: string): boolean {
	const code = char.charCodeAt(0);

	// ASCII範囲（U+0000 - U+007F）は半角
	return !(0x0000 <= code && code <= 0x007f);
}
