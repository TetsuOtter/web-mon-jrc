import * as fs from "fs";
import * as path from "path";
import { createReadStream } from "fs";

// PNG読み込みにはpngjsを使用
// install: npm install pngjs
interface PNG {
	width: number;
	height: number;
	data: Uint8Array;
}

/**
 * PNG画像をTS形式の8ビット文字列配列に変換
 * PNGは白(255,255,255) or 透過のみを想定
 * 白と透過をそれぞれ 0, 1 にマッピング
 */
async function pngToIconData(pngPath: string): Promise<{
	bitStrings: string[];
	width: number;
	height: number;
}> {
	// pngjsの動的インポート
	const { PNG: PNGConstructor } = await import("pngjs");

	return new Promise((resolve, reject) => {
		const stream = createReadStream(pngPath);

		let png: PNG;

		stream.on("data", (chunk: Buffer) => {
			// pngjsは継承可能でパース処理をする
		});

		// pngjsのパースが完了したら
		const parser = new PNGConstructor();

		createReadStream(pngPath)
			.pipe(parser)
			.on("parsed", function () {
				const width = this.width;
				const height = this.height;
				const data = this.data;

				const bitStrings: string[] = [];

				// 各ピクセルをチェック
				for (let y = 0; y < height; y++) {
					let bitString = "";

					for (let x = 0; x < width; x++) {
						const idx = (width * y + x) << 2; // RGBA = 4 bytes per pixel
						const a = data[idx + 3];

						// 透過（a < 128）なら 0、非透過なら 1
						bitString += a < 128 ? "0" : "1";
					}

					bitStrings.push(bitString);
				}

				resolve({ bitStrings, width, height });
			})
			.on("error", reject);
	});
}

/**
 * ビット文字列を8ビット単位に分割
 */
function splitInto8BitChunks(bitString: string): string[] {
	if (bitString.length % 8 !== 0) {
		throw new Error(
			`Bit string length must be multiple of 8, got ${bitString.length}`
		);
	}

	const chunks: string[] = [];
	for (let i = 0; i < bitString.length; i += 8) {
		chunks.push(bitString.slice(i, i + 8));
	}
	return chunks;
}

/**
 * TS形式のコードを生成
 */
function generateTypeScriptCode(
	rows: string[][],
	importPath: string = "./constants"
): string {
	const lines: string[] = [];

	lines.push(`import { getLine } from "${importPath}";`);
	lines.push("");
	lines.push("");
	lines.push(`import type { IconDataStrictType } from "${importPath}";`);
	lines.push(`const data = [`);

	for (const chunks of rows) {
		const chunkArgs = chunks.map((chunk) => `"${chunk}"`).join(",\n\t");
		lines.push(`\tgetLine(`);
		lines.push(`\t\t${chunkArgs.replace(/,\n\t/g, ",\n\t\t")}`);
		lines.push(`\t),`);
	}

	lines.push(`] as const satisfies IconDataStrictType;`);
	lines.push("");
	lines.push(`export default data;`);

	return lines.join("\n");
}

/**
 * メイン処理
 */
async function main() {
	const args = process.argv.slice(2);

	if (args.length < 2) {
		console.error(
			"Usage: npx ts-node png-to-ts-icon.ts <input.png> <output.ts> [importPath]"
		);
		console.error("  input.png: Input PNG file path");
		console.error("  output.ts: Output TypeScript file path");
		console.error(
			"  importPath: Import path for getLine (default: ./constants)"
		);
		process.exit(1);
	}

	const inputPath = args[0];
	const outputPath = args[1];
	const importPath = args[2] || "./constants";

	// inputPathが存在確認
	if (!fs.existsSync(inputPath)) {
		console.error(`Input file not found: ${inputPath}`);
		process.exit(1);
	}

	try {
		console.log(`Processing: ${inputPath}`);
		const { bitStrings, width, height } = await pngToIconData(inputPath);

		// 各行を8ビット単位に分割
		const rows: string[][] = [];
		for (const bitString of bitStrings) {
			rows.push(splitInto8BitChunks(bitString));
		}

		// TS形式でコード生成
		const tsCode = generateTypeScriptCode(rows, importPath);

		// ファイルに出力
		fs.writeFileSync(outputPath, tsCode);

		console.log(`✓ Success!`);
		console.log(`  Output: ${outputPath}`);
		console.log(`  Image size: ${width}x${height}`);
	} catch (error) {
		console.error("Error:", error instanceof Error ? error.message : error);
		process.exit(1);
	}
}

main();
