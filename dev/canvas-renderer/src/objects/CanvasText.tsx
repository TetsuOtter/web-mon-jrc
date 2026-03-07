import { memo, useCallback, useMemo, useEffect } from "react";

import {
	useCanvasObjectContext,
	type CanvasRenderFunction,
	type ClickEventHandler,
} from "../contexts/CanvasObjectContext";
import { isFullWidthChar, DEFAULT_FONT_INFO } from "../types/FontInfo";
import { useTofu } from "../utils/TofuFontHook";
import { hexToRgb, setTransparentToData } from "../utils/colorUtil";
import { loadFont, type AvailableFont } from "../utils/fontLoader";

import CanvasObjectBase from "./CanvasObjectBase";

import type { FontInfo, GlyphData } from "../types/FontInfo";

export type CanvasTextProps = {
	readonly relX: number;
	readonly relY: number;
	readonly text: string;
	readonly fontInfo?: FontInfo;
	readonly fillColor?: string;
	readonly maxWidthPx?: number;
	readonly maxHeightPx?: number;
	readonly skipLineCount?: number;
	readonly lineHeight?: number;
	readonly align?: "left" | "center" | "right";
	readonly verticalAlign?: "top" | "center" | "bottom";
	readonly scaleX?: number;
	readonly scaleY?: number;
	readonly onClick?: ClickEventHandler;
	readonly onLineInfoChanged?: (
		lineCount: number,
		visibleLineCount: number,
	) => void;
};

// 描画内容の型定義
type LineImage = {
	canvas: OffscreenCanvas | null;
	width: number;
};
type DrawLine = {
	canvas: OffscreenCanvas;
	width: number;
	height: number;
	x: number;
	y: number;
};

type DrawContent = {
	x: number;
	y: number;
	width: number;
	height: number;
	lines: DrawLine[];
};

type WrappedLineInfo = {
	glyphs: GlyphData[];
	width: number;
};

/**
 * BDF フォントを使用するテキスト描画オブジェクト
 */
export default memo<CanvasTextProps>(function CanvasText({
	relX,
	relY,
	text,
	fontInfo = DEFAULT_FONT_INFO,
	fillColor = "#000000",
	maxWidthPx: maxWidthPxProps,
	maxHeightPx: maxHeightPxProps,
	skipLineCount = 0,
	lineHeight = 1,
	align = "left",
	verticalAlign = "top",
	scaleX = 1,
	scaleY = 1,
	onClick,
	onLineInfoChanged,
}) {
	const parentObjectContext = useCanvasObjectContext();
	const maxWidthPx =
		maxWidthPxProps ?? parentObjectContext.metadata.width - relX;
	const maxHeightPx =
		maxHeightPxProps ?? parentObjectContext.metadata.height - relY;

	const lineImagesPromise = useLineImagesPromise({
		fontInfo,
		text,
		fillColor,
		maxWidthPx,
	});

	const drawContentPromise = useDrawContentPromise({
		x: relX,
		y: relY,
		fontInfo,
		scaleX,
		scaleY,
		lineHeight,
		maxWidthPx,
		maxHeightPx,
		skipLineCount,
		align,
		verticalAlign,
		lineImagesPromise,
	});

	// onLineInfoChangedを非同期で更新
	useEffect(() => {
		if (!onLineInfoChanged) return;
		drawContentPromise.then((drawContent) => {
			const lineCount = drawContent.lines.length; // 総行数
			const visibleLineCount = drawContent.lines.length; // 表示可能な行数
			onLineInfoChanged(lineCount, visibleLineCount);
		});
	}, [drawContentPromise, onLineInfoChanged]);

	const onRender: CanvasRenderFunction = useCallback(
		async (ctx, metadata) => {
			const drawContent = await drawContentPromise;

			try {
				for (const line of drawContent.lines) {
					ctx.save();
					ctx.imageSmoothingEnabled = false;
					ctx.drawImage(
						line.canvas,
						0,
						0,
						line.canvas.width,
						line.canvas.height,
						metadata.absX + line.x,
						metadata.absY + line.y,
						line.width,
						line.height,
					);
					ctx.restore();
				}
			} catch (error) {
				console.error("Error rendering text:", error);
			}
		},
		[drawContentPromise],
	);

	return (
		<CanvasObjectBase
			onRender={onRender}
			onClick={onClick}
			relX={relX}
			relY={relY}
			width={maxWidthPx}
			height={maxHeightPx}
			isFilled={false}
		/>
	);
});

type UseCharBitmapsHookParams = {
	fontInfo: FontInfo;
	text: string;
};

/**
 * 指定されたフォント（配列または単一）から文字のグリフを取得
 * 配列の場合は先頭から順に探索し、見つかるまで試す
 */
async function getGlyphFromFonts(
	char: string,
	fontSpec: AvailableFont | readonly AvailableFont[],
): Promise<ReturnType<Awaited<ReturnType<typeof loadFont>>["glyph"]> | null> {
	const fonts = Array.isArray(fontSpec) ? fontSpec : [fontSpec];

	for (const font of fonts) {
		try {
			const loadedFont = await loadFont(font);
			const glyph = loadedFont.glyph(char);
			if (glyph != null) {
				return glyph;
			}
		} catch (error) {
			console.warn(`Failed to load font ${font}:`, error);
			continue;
		}
	}

	return null;
}

/**
 * グリフオブジェクトから GlyphData を生成する
 * - ビットマップは BBX サイズ（mode=1）
 * - advanceWidth は DWIDTH x（glyph.meta.dwx0）
 * - yOffset = FONT_ASCENT - BBX_y_offset - BBX_height
 * - xOffset = BBX_x_offset
 */
function glyphToGlyphData(
	glyph: NonNullable<ReturnType<Awaited<ReturnType<typeof loadFont>>["glyph"]>>,
	fontSize: number,
): GlyphData {
	const bitmap = glyph.draw(1); // BBX サイズのビットマップ
	const advanceWidth = glyph.meta.dwx0 ?? glyph.meta.bbw;
	const xOffset = glyph.meta.bbxoff;
	const bbyoff = glyph.meta.bbyoff ?? 0;
	// bdfparser は props のキーを小文字で保持する
	const fontAscentStr = glyph.font.props["font_ascent"];
	const fontAscent = fontAscentStr != null ? parseInt(fontAscentStr) : fontSize;
	const yOffset = fontAscent - bbyoff - glyph.meta.bbh;
	return { bitmap, advanceWidth, xOffset, yOffset };
}

function useCharBitmaps({
	fontInfo,
	text,
}: UseCharBitmapsHookParams): Promise<GlyphData[][]> {
	const tofu = useTofu(fontInfo);
	return useMemo(async () => {
		try {
			const lines = text.split("\n");
			const result: GlyphData[][] = [];

			for (const line of lines) {
				const lineGlyphs: GlyphData[] = [];

				for (const char of line) {
					const cached = fontInfo.cache.get(char);
					if (cached) {
						lineGlyphs.push(cached);
						continue;
					}
					const isFullWidth = isFullWidthChar(char);
					const fontSpec = isFullWidth
						? fontInfo.fullWidth
						: fontInfo.halfWidth;

					const glyph = await getGlyphFromFonts(char, fontSpec);

					const glyphData: GlyphData =
						glyph != null
							? glyphToGlyphData(glyph, fontInfo.fontSize)
							: isFullWidth
								? tofu.fullWidth
								: tofu.halfWidth;

					fontInfo.cache.set(char, glyphData);
					lineGlyphs.push(glyphData);
				}

				result.push(lineGlyphs);
			}

			return result;
		} catch (error) {
			console.error("Failed to get char bitmap info:", error);
			return [];
		}
	}, [
		fontInfo.cache,
		fontInfo.fullWidth,
		fontInfo.halfWidth,
		fontInfo.fontSize,
		text,
		tofu.fullWidth,
		tofu.halfWidth,
	]);
}

type LineImagesPromiseHookParams = {
	fontInfo: FontInfo;
	text: string;
	fillColor: string;
	maxWidthPx?: number;
};

function useLineImagesPromise({
	fontInfo,
	text,
	fillColor,
	maxWidthPx,
}: LineImagesPromiseHookParams): Promise<LineImage[]> {
	const charBitmapsPromise = useCharBitmaps({ fontInfo, text });
	const fillColorRgb = useMemo(() => hexToRgb(fillColor), [fillColor]);

	return useMemo(async () => {
		try {
			const charBitmaps = await charBitmapsPromise;

			const drawLines: LineImage[] = [];
			for (const lineCharBitmaps of charBitmaps) {
				const wrappedLines = maxWidthPx
					? wrapLineByWidth(lineCharBitmaps, maxWidthPx)
					: [createLineGlyphInfo(lineCharBitmaps)];

				for (const wrappedLine of wrappedLines) {
					const { glyphs, width: lineWidth } = wrappedLine;

					if (glyphs.length === 0) {
						drawLines.push({
							canvas: null,
							width: 0,
						});
						continue;
					}

					// 行ごとのOffscreenCanvasを作成
					const canvas = new OffscreenCanvas(lineWidth, fontInfo.fontSize);
					const ctx = canvas.getContext("2d");

					if (!ctx) {
						throw new Error("Failed to get OffscreenCanvasRenderingContext2D");
					}

					let currentX = 0;
					for (const glyphData of glyphs) {
						const { bitmap, advanceWidth, xOffset, yOffset } = glyphData;
						const bitmapWidth = bitmap.width();
						const bitmapHeight = bitmap.height();

						if (bitmapWidth > 0 && bitmapHeight > 0) {
							// ImageData を作成して描画
							const imageData = ctx.createImageData(bitmapWidth, bitmapHeight);
							const data = imageData.data;

							for (let row = 0; row < bitmapHeight; row++) {
								for (let col = 0; col < bitmapWidth; col++) {
									const pixelIndex = (row * bitmapWidth + col) * 4;
									if (bitmap.bindata[row][col] === "1") {
										fillColorRgb.setToData(data, pixelIndex);
									} else {
										setTransparentToData(data, pixelIndex);
									}
								}
							}

							// BBX x/y オフセットを考慮した位置に描画
							ctx.putImageData(imageData, currentX + xOffset, yOffset);
						}
						// DWIDTH を使って x を進める
						currentX += advanceWidth;
					}

					drawLines.push({
						canvas,
						width: lineWidth,
					});
				}
			}

			return drawLines;
		} catch (error) {
			console.error("Failed to create line data:", error);
			return [];
		}
	}, [charBitmapsPromise, maxWidthPx, fontInfo.fontSize, fillColorRgb]);
}

type DrawContentHookParams = {
	x: number;
	y: number;
	fontInfo: FontInfo;
	scaleX: number;
	scaleY: number;
	lineHeight: number;
	maxWidthPx: number;
	maxHeightPx: number;
	skipLineCount: number;
	align: "left" | "center" | "right";
	verticalAlign: "top" | "center" | "bottom";
	lineImagesPromise: Promise<LineImage[]>;
};
function useDrawContentPromise({
	x,
	y,
	fontInfo,
	scaleX,
	scaleY,
	lineHeight,
	maxWidthPx,
	maxHeightPx,
	skipLineCount,
	align,
	verticalAlign,
	lineImagesPromise,
}: DrawContentHookParams): Promise<DrawContent> {
	return useMemo(async () => {
		const drawLines = await lineImagesPromise;
		const normalizedSkipLineCount = Math.max(0, Math.floor(skipLineCount));

		let maxWidth = 0;
		let visibleHeight = 0;
		const lines: DrawLine[] = [];

		const fontHeightPx = fontInfo.fontSize * scaleY;
		const lineHeightPx = fontInfo.fontSize * lineHeight * scaleY;

		drawLines.forEach((drawLine, index) => {
			if (index < normalizedSkipLineCount) {
				return;
			}

			if (maxHeightPx && visibleHeight + lineHeightPx > maxHeightPx) {
				return;
			}

			if (drawLine.canvas == null) {
				visibleHeight += lineHeightPx;
				return;
			}

			const scaledWidth = drawLine.width * scaleX;
			const lineX = calculateXPosition(0, scaledWidth, maxWidthPx, align);

			lines.push({
				x: lineX,
				y: visibleHeight,
				canvas: drawLine.canvas,
				width: scaledWidth,
				height: fontHeightPx,
			});

			maxWidth = Math.max(maxWidth, scaledWidth);
			visibleHeight += lineHeightPx;
		});

		// 垂直アライメントに基づいて行のY位置を調整
		const adjustedLines = lines.map((line) => ({
			...line,
			y: calculateYPosition(line.y, visibleHeight, maxHeightPx, verticalAlign),
		}));

		// 垂直アライメントで行がシフトされた場合、高さを実際の描画範囲に合わせる
		const adjustedHeight =
			adjustedLines.length > 0
				? Math.max(
						visibleHeight,
						...adjustedLines.map((line) => line.y + line.height),
					)
				: visibleHeight;

		return {
			x,
			y,
			width: maxWidth,
			height: adjustedHeight,
			lines: adjustedLines,
		};
	}, [
		lineImagesPromise,
		fontInfo.fontSize,
		scaleY,
		lineHeight,
		x,
		y,
		maxHeightPx,
		skipLineCount,
		scaleX,
		maxWidthPx,
		align,
		verticalAlign,
	]);
}

function wrapLineByWidth(
	charGlyphs: GlyphData[],
	maxWidthPx: number,
): WrappedLineInfo[] {
	const wrappedLines: WrappedLineInfo[] = [];
	let currentGlyphs: GlyphData[] = [];
	let currentWidth = 0;

	for (const glyphData of charGlyphs) {
		// advance width でセル幅を判定する
		const charWidth = glyphData.advanceWidth;

		if (charWidth === 0) {
			continue;
		}

		if (currentWidth + charWidth > maxWidthPx && currentGlyphs.length > 0) {
			// 折り返し
			wrappedLines.push({
				glyphs: currentGlyphs,
				width: currentWidth,
			});
			currentGlyphs = [glyphData];
			currentWidth = charWidth;
		} else {
			currentGlyphs.push(glyphData);
			currentWidth += charWidth;
		}
	}

	if (0 < currentGlyphs.length) {
		wrappedLines.push({
			glyphs: currentGlyphs,
			width: currentWidth,
		});
	}

	return 0 < wrappedLines.length ? wrappedLines : [{ glyphs: [], width: 0 }];
}

function createLineGlyphInfo(charGlyphs: GlyphData[]): WrappedLineInfo {
	const glyphs: GlyphData[] = [];
	let lineWidth = 0;

	for (const glyphData of charGlyphs) {
		// advance width を使ってセル幅を積算する
		const charWidth = glyphData.advanceWidth;

		if (charWidth > 0) {
			glyphs.push(glyphData);
			lineWidth += charWidth;
		}
	}

	return { glyphs, width: lineWidth };
}

function calculateXPosition(
	baseX: number,
	lineWidth: number,
	maxWidth: number,
	align: "left" | "center" | "right",
): number {
	if (maxWidth === 0) {
		return baseX;
	}

	switch (align) {
		case "center":
			return baseX + (maxWidth - lineWidth) / 2;
		case "right":
			return baseX + maxWidth - lineWidth;
		case "left":
		default:
			return baseX;
	}
}

function calculateYPosition(
	currentY: number,
	totalHeight: number,
	maxHeight: number | undefined,
	verticalAlign: "top" | "center" | "bottom",
): number {
	const availableHeight = maxHeight ?? totalHeight;

	if (totalHeight >= availableHeight) {
		return currentY;
	}

	const verticalOffset = availableHeight - totalHeight;

	switch (verticalAlign) {
		case "center":
			return currentY + verticalOffset / 2;
		case "bottom":
			return currentY + verticalOffset;
		case "top":
		default:
			return currentY;
	}
}
