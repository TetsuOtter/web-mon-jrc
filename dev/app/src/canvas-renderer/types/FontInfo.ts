import Encoding from "encoding-japanese";

import type { AvailableFont } from "../utils/fontLoader";

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
	fullWidth: "jiskan16",
	halfWidth: "8x16rk",
};

/**
 * 文字が全角かどうかを判定
 */
export function isFullWidthChar(char: string): boolean {
	const code = char.charCodeAt(0);

	// CJK統合漢字 (U+4E00 - U+9FFF)
	if (code >= 0x4e00 && code <= 0x9fff) return true;

	// ひらがな (U+3040 - U+309F)
	if (code >= 0x3040 && code <= 0x309f) return true;

	// カタカナ (U+30A0 - U+30FF)
	if (code >= 0x30a0 && code <= 0x30ff) return true;

	// 全角記号・数字・英数字 (U+FF01 - U+FF9E)
	if (code >= 0xff01 && code <= 0xff9e) return true;

	// CJK互換漢字 (U+F900 - U+FAFF)
	if (code >= 0xf900 && code <= 0xfaff) return true;

	// CJK互換文字 (U+3300 - U+33FF)
	if (code >= 0x3300 && code <= 0x33ff) return true;

	// その他のCJK文字
	if (
		(code >= 0x2e80 && code <= 0x2eff) || // CJK Radicals Supplement
		(code >= 0x3000 && code <= 0x303f) || // CJK Symbols and Punctuation
		(code >= 0x3200 && code <= 0x32ff) // Enclosed CJK Letters and Months
	) {
		return true;
	}

	return false;
}

/**
 * Unicode文字をJIS X 0208コードポイント（BDF ENCODING値）に変換
 * （jiskan16はJIS X 0208ベースのフォント）
 * glyphbycp()メソッドで使用するため、BDFのENCODING値（10進区点コード）を返す
 */
export function unicodeToJisX0208(char: string): number {
	const code = char.charCodeAt(0);

	// カタカナ: U+30A0 - U+30FF
	if (code >= 0x30a0 && code <= 0x30ff) {
		// U+30A0-30FF -> JIS X 0208 0x2521-0x2576
		const jisCode = 0x2521 + (code - 0x30a1);
		if (jisCode <= 0x2576) {
			return jisCode;
		}
	}

	// ひらがな: U+3040 - U+309F
	if (code >= 0x3040 && code <= 0x309f) {
		// U+3040-309F -> JIS X 0208 0x2421-0x2473
		const jisCode = 0x2421 + (code - 0x3041);
		if (jisCode <= 0x2473) {
			return jisCode;
		}
	}

	// その他のUnicode文字（漢字・記号など）
	return convertUnicodeKanjiToJisX0208(char) ?? code;
}

/**
 * encoding-japaneseを使用してUnicode漢字をJIS X 0208（区点コード）に変換
 * EUC-JPを経由して正確なコードポイント変換を実現
 */
function convertUnicodeKanjiToJisX0208(char: string): number | undefined {
	try {
		const unicodeArray = Encoding.stringToCode(char);

		const eucArray = Encoding.convert(unicodeArray, {
			to: "EUCJP",
			from: "UNICODE",
		});

		if (eucArray.length >= 2) {
			const high = eucArray[0];
			const low = eucArray[1];

			return ((high << 8) | low) - 0x8080;
		}

		return undefined;
	} catch {
		return undefined;
	}
}
