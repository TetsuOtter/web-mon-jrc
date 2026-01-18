import * as fs from "fs";
import iconv from "iconv-lite";

/**
 * BDFファイルをUnicode対応のBDFファイルに変換
 * JSのCodePointの値をそのまま使えるようにする
 *
 * BDFファイルのENCODING値は以下に対応：
 * - JIS X 0208-1983のコード位置を10進数で表現したもの
 * - JIS X 0201 半角カタカナ（ENCODING 160-223）
 * これらをUnicodeコードポイントに変換します
 */

// 10進数のJIS X 0208コード値をバイト列に変換
function jisDecimalToBytes(jisEncoding: number): Buffer | null {
	// JIS X 0208のコード値は0x2121～0x7e7eの範囲
	const byte1 = Math.floor(jisEncoding / 256);
	const byte2 = jisEncoding % 256;

	if (byte1 < 0x21 || byte1 > 0x7e || byte2 < 0x21 || byte2 > 0x7e) {
		return null;
	}

	return Buffer.from([byte1, byte2]);
}

// JIS X 0208バイト列をUnicodeコードポイントに変換
function jisToUnicode(jisBytes: Buffer): number | null {
	try {
		// JIS X 0208のバイト値をEUC-JPに変換
		// EUC-JPではJIS X 0208は0xA1A1～0xFEFEの範囲（各バイトに0x80を加算）
		const eucBuffer = Buffer.from([jisBytes[0] + 0x80, jisBytes[1] + 0x80]);

		// EUC-JPとしてUnicodeにデコード
		const decoded = iconv.decode(eucBuffer, "eucjp");

		if (decoded && decoded.length > 0) {
			return decoded.charCodeAt(0);
		}
	} catch {
		// 変換エラーの場合はnullを返す
	}
	return null;
}

// JIS X 0201 半角カタカナ（ENCODING 160-223）をUnicodeコードポイントに変換
function jisx0201KatakanaToUnicode(jisx0201Code: number): number | null {
	// JIS X 0201の半角カタカナ範囲: 0xA1（161）～0xDF（223）
	// Unicodeの半角カタカナ範囲: U+FF61（65377）～U+FF9F（65439）
	// マッピング: (jisx0201Code - 0xA1) + 0xFF61
	if (jisx0201Code >= 0xa1 && jisx0201Code <= 0xdf) {
		return jisx0201Code - 0xa1 + 0xff61;
	}
	return null;
}

function convertJisEncodingToUnicode(jisEncoding: number): number | null {
	// JIS X 0201 半角カタカナの処理（ENCODING 160-223）
	// ENCODINGの値が JIS X 0201のバイト値と同じとみなす
	if (jisEncoding >= 160 && jisEncoding <= 223) {
		return jisx0201KatakanaToUnicode(jisEncoding);
	}

	// JIS X 0208の処理
	// BDFファイルのENCODING値はJIS X 0208のコード位置を10進数で表現
	// これをバイト列に変換してからUnicodeに変換
	const jisBytes = jisDecimalToBytes(jisEncoding);
	if (!jisBytes) {
		return null;
	}

	const unicodeCode = jisToUnicode(jisBytes);
	return unicodeCode;
}

function convertBdfFile(inputPath: string, outputPath: string): void {
	// BDFファイルを読み込む
	const content = fs.readFileSync(inputPath, "utf-8");
	const lines = content.split("\n");

	const output: string[] = [];
	let i = 0;

	while (i < lines.length) {
		const line = lines[i];

		// ENCAMDBINGの次の行（ENCODING）の場合、値を変換
		if (line.startsWith("ENCODING ")) {
			const encodingValue = parseInt(line.substring(9));
			const unicodeValue = convertJisEncodingToUnicode(encodingValue);

			if (unicodeValue !== null) {
				output.push(`ENCODING ${unicodeValue}`);
			} else {
				// 変換に失敗した場合は元の値を使用
				output.push(line);
			}
		}
		// CHARSETの行を更新
		else if (line.startsWith("CHARSET_REGISTRY ")) {
			output.push('CHARSET_REGISTRY "ISO10646"');
		} else if (line.startsWith("CHARSET_ENCODING ")) {
			output.push('CHARSET_ENCODING "0"');
		}
		// FONTの行を更新
		else if (line.startsWith("FONT ")) {
			const fontLine = line.replace("JISX0208.1983-0", "ISO10646-1");
			output.push(fontLine);
		}
		// DEFAULT_CHARを更新
		else if (line.startsWith("DEFAULT_CHAR ")) {
			const defaultValue = parseInt(line.substring(13));
			const unicodeValue = convertJisEncodingToUnicode(defaultValue);
			if (unicodeValue !== null) {
				output.push(`DEFAULT_CHAR ${unicodeValue}`);
			} else {
				output.push(line);
			}
		} else {
			output.push(line);
		}

		i++;
	}

	// 結果をファイルに書き込む
	fs.writeFileSync(outputPath, output.join("\n"), "utf-8");
	console.log(`✓ 変換完了: ${outputPath}`);
}

// メイン処理
const args = process.argv.slice(2);
if (args.length < 2) {
	console.error(
		"使用方法: node jis-bdf-to-unicode-bdf.ts <入力ファイル> <出力ファイル>",
	);
	console.error(
		"例: node jis-bdf-to-unicode-bdf.ts jiskan16.bdf jiskan16-unicode.bdf",
	);
	process.exit(1);
}

const inputFile = args[0];
const outputFile = args[1];

if (!fs.existsSync(inputFile)) {
	console.error(`エラー: ファイルが見つかりません: ${inputFile}`);
	process.exit(1);
}

try {
	convertBdfFile(inputFile, outputFile);
} catch (error) {
	console.error("エラーが発生しました:", error);
	process.exit(1);
}
