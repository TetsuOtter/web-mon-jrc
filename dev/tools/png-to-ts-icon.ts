import * as fs from "fs";
import * as path from "path";
import { createReadStream } from "fs";
import { execSync } from "child_process";

// ES Module での __dirname 定義
const __dirname = path.dirname(new URL(import.meta.url).pathname);

/**
 * ファイル変換対応表の型定義
 * キー: 入力ファイル名、値: 出力ファイル名
 */
type FileConversionMap = Record<string, string>;

/**
 * 複数ファイルの変換対応表
 * ディレクトリ内のPNGファイルをTSファイルに変換する際の対応関係を定義
 * 拡張子なしで定義。.png -> .ts の変換は自動で行われます
 *
 * 例：
 * {
 *   "icon_1": "icon_1",
 *   "icon_2": "icon_2",
 * }
 */
const FILE_CONVERSION_MAP: FileConversionMap = {
	アイコン車掌処理後: "conductor",
	アイコン運転士処理後: "driver",
	メニュー処理後: "menu",
	乗車率処理後: "occupancy_rate",
	他形式処理後: "other_series",
	応急マニュアル処理後: "embedded_manual",
	故障: "broken",
	検修処理後: "maintenance",
	目次処理後: "table_of_contents_1",
	補正アイコン: "correction",
	車両状態処理後: "car_info_1",
	運行設定処理後: "work_setting_1",
	目次2処理後: "table_of_contents_2",
	車両状態2: "car_info_2",
	運行設定2処理後: "work_setting_2",
	メニュー373処理後: "menu_373",
	運行設定373処理後: "work_setting_373",
};

/**
 * デフォルトの変換パス（相対パス）
 */
const DEFAULT_INPUT_DIR = "../app/public/img/アイコン修正";
const DEFAULT_OUTPUT_DIR = "../app/src/pages/monitors/type313s/icons";

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
 * 単一ファイルを変換
 */
async function convertSingleFile(
	inputPath: string,
	outputPath: string,
	importPath: string = "./constants"
): Promise<string> {
	if (!fs.existsSync(inputPath)) {
		throw new Error(`Input file not found: ${inputPath}`);
	}

	console.log(`  Processing: ${inputPath}`);
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

	console.log(`    ✓ ${outputPath} (${width}x${height})`);

	return outputPath;
}

/**
 * ディレクトリ内の複数ファイルをバッチ変換
 * fileMapの拡張子なしのファイル名を、.png -> .ts に自動変換
 */
async function batchConvert(
	inputDir: string,
	outputDir: string,
	fileMap: FileConversionMap,
	importPath: string = "./constants"
): Promise<string[]> {
	// 出力ディレクトリを作成
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}

	const results = {
		success: 0,
		failed: 0,
		errors: [] as string[],
		files: [] as string[],
	};

	console.log(
		`Batch converting ${Object.keys(fileMap).length} files from ${inputDir}...`
	);

	for (const [inputFileName, outputFileName] of Object.entries(fileMap)) {
		try {
			// 拡張子を自動付与
			const inputPath = path.join(inputDir, `${inputFileName}.png`);
			const outputPath = path.join(outputDir, `${outputFileName}.ts`);

			const convertedPath = await convertSingleFile(
				inputPath,
				outputPath,
				importPath
			);
			results.success++;
			results.files.push(convertedPath);
		} catch (error) {
			const errorMsg = error instanceof Error ? error.message : String(error);
			results.errors.push(`${inputFileName}.png: ${errorMsg}`);
			results.failed++;
			console.error(`  ✗ ${inputFileName}.png: ${errorMsg}`);
		}
	}

	// 結果サマリー
	console.log("\n=== Batch Conversion Summary ===");
	console.log(`Success: ${results.success}`);
	console.log(`Failed: ${results.failed}`);

	if (results.errors.length > 0) {
		console.log("\nErrors:");
		results.errors.forEach((err) => console.log(`  - ${err}`));
		process.exit(1);
	}

	return results.files;
}

/**
 * Lintを実行して生成されたファイルをフォーマット
 */
function runLint(filePaths: string[]): void {
	if (filePaths.length === 0) {
		return;
	}

	try {
		console.log("\n=== Running ESLint --fix ===");
		const fileArgs = filePaths.join(" ");
		// appディレクトリで lint コマンドを実行（相対パスを正しく解決するため）
		execSync(`yarn lint --fix ${fileArgs}`, {
			stdio: "inherit",
			cwd: path.resolve(__dirname, "../app"),
		});
		console.log("\n✓ Lint fixed successfully!");
	} catch (error) {
		console.error("Warning: Lint failed but conversion completed.");
		console.error(error instanceof Error ? error.message : String(error));
	}
}

/**
 * メイン処理
 */
async function main() {
	const args = process.argv.slice(2);

	if (args.length === 0) {
		console.error("Usage: yarn png-to-ts [mode] [options]");
		console.error("");
		console.error("Modes:");
		console.error("  single <input.png> <output.ts> [importPath]");
		console.error("    Convert a single PNG file to TypeScript");
		console.error("");
		console.error("  batch [input_dir] [output_dir] [importPath]");
		console.error("    Convert multiple PNG files using FILE_CONVERSION_MAP");
		console.error("    If input_dir and output_dir are omitted, use defaults");
		console.error("");
		console.error(
			"Default (no mode specified): Run batch mode with default paths"
		);
		console.error("");
		console.error("Examples:");
		console.error("  yarn png-to-ts");
		console.error("  yarn png-to-ts single input.png output.ts");
		console.error("  yarn png-to-ts batch /path/to/input /path/to/output");
		process.exit(1);
	}

	// モード判定
	const firstArg = args[0];
	const isBatchMode = firstArg === "batch";
	const isSingleMode =
		firstArg === "single" || !["batch", "single"].includes(firstArg);

	try {
		if (isBatchMode) {
			// バッチモード
			const inputDir = args[1] || DEFAULT_INPUT_DIR;
			const outputDir = args[2] || DEFAULT_OUTPUT_DIR;
			const importPath = args[3] || "./constants";

			if (!fs.existsSync(inputDir)) {
				throw new Error(`Input directory not found: ${inputDir}`);
			}

			if (Object.keys(FILE_CONVERSION_MAP).length === 0) {
				throw new Error(
					"FILE_CONVERSION_MAP is empty. Please define file mappings."
				);
			}

			const convertedFiles = await batchConvert(
				inputDir,
				outputDir,
				FILE_CONVERSION_MAP,
				importPath
			);
			runLint(convertedFiles);
		} else if (firstArg === "batch" && args.length === 1) {
			// batchモードで引数なしの場合、デフォルトパスを使用
			const inputDir = DEFAULT_INPUT_DIR;
			const outputDir = DEFAULT_OUTPUT_DIR;
			const importPath = "./constants";

			if (!fs.existsSync(inputDir)) {
				throw new Error(`Input directory not found: ${inputDir}`);
			}

			if (Object.keys(FILE_CONVERSION_MAP).length === 0) {
				throw new Error(
					"FILE_CONVERSION_MAP is empty. Please define file mappings."
				);
			}

			const convertedFiles = await batchConvert(
				inputDir,
				outputDir,
				FILE_CONVERSION_MAP,
				importPath
			);
			runLint(convertedFiles);
		} else if (isSingleMode && args.length >= 2) {
			// シングルモード
			const inputPath = firstArg === "single" ? args[1] : args[0];
			const outputPath = firstArg === "single" ? args[2] : args[1];
			const importPath =
				(firstArg === "single" ? args[3] : args[2]) || "./constants";

			if (!fs.existsSync(inputPath)) {
				throw new Error(`Input file not found: ${inputPath}`);
			}

			console.log(`Converting: ${inputPath}`);
			const convertedPath = await convertSingleFile(
				inputPath,
				outputPath,
				importPath
			);
			console.log(`\n✓ Success!`);
			runLint([convertedPath]);
		} else {
			console.error("Invalid arguments");
			console.error(
				"Usage: yarn png-to-ts <input.png> <output.ts> [importPath]"
			);
			console.error(
				"    or: yarn png-to-ts batch [input_dir] [output_dir] [importPath]"
			);
			process.exit(1);
		}
	} catch (error) {
		console.error("Error:", error instanceof Error ? error.message : error);
		process.exit(1);
	}
}

main();
