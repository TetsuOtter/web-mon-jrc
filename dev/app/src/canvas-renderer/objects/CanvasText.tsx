import { memo, useCallback, useMemo, useEffect, useState } from "react";

import {
	useCanvasObjectContext,
	type CanvasRenderFunction,
	type ClickEventHandler,
} from "../contexts/CanvasObjectContext";
import { isFullWidthChar, DEFAULT_FONT_INFO } from "../types/FontInfo";
import { useTofu } from "../utils/TofuFontHook";
import { loadFont } from "../utils/fontLoader";

import CanvasObjectBase from "./CanvasObjectBase";

import type { FontInfo } from "../types/FontInfo";
import type { Bitmap } from "bdfparser";

type CanvasTextProps = {
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
	readonly scaleX?: number;
	readonly scaleY?: number;
	readonly onClick?: ClickEventHandler;
	readonly onLineInfoChanged?: (
		lineCount: number,
		visibleLineCount: number
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
	glyphs: Bitmap[];
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
		lineImagesPromise,
	});

	// メタデータを管理
	const [metadata, setMetadata] = useState({
		x: relX,
		y: relY,
		width: 0,
		height: 0,
		isFilled: true,
	});

	// onLineInfoChangedとメタデータを非同期で更新
	useEffect(() => {
		drawContentPromise.then((drawContent) => {
			// メタデータを drawContent の実際の寸法で更新
			setMetadata({
				x: drawContent.x,
				y: drawContent.y,
				width: drawContent.width,
				height: drawContent.height,
				isFilled: true,
			});

			if (onLineInfoChanged) {
				const lineCount = drawContent.lines.length; // 総行数
				const visibleLineCount = drawContent.lines.length; // 表示可能な行数
				onLineInfoChanged(lineCount, visibleLineCount);
			}
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
						line.height
					);
					ctx.restore();
				}
			} catch (error) {
				console.error("Error rendering text:", error);
			}
		},
		[drawContentPromise]
	);

	return (
		<CanvasObjectBase
			onRender={onRender}
			onClick={onClick}
			relX={metadata.x}
			relY={metadata.y}
			width={metadata.width}
			height={metadata.height}
			isFilled={metadata.isFilled}
		/>
	);
});

function hexToRgb(hex: string): { r: number; g: number; b: number } {
	const result6 = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	if (result6) {
		return {
			r: parseInt(result6[1], 16),
			g: parseInt(result6[2], 16),
			b: parseInt(result6[3], 16),
		};
	}
	const result3 = /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i.exec(hex);
	if (result3) {
		return {
			r: parseInt(result3[1] + result3[1], 16),
			g: parseInt(result3[2] + result3[2], 16),
			b: parseInt(result3[3] + result3[3], 16),
		};
	}
	return { r: 0, g: 0, b: 0 };
}

type UseCharBitmapsHookParams = {
	fontInfo: FontInfo;
	text: string;
};
function useCharBitmaps({
	fontInfo,
	text,
}: UseCharBitmapsHookParams): Promise<Bitmap[][]> {
	const tofu = useTofu(fontInfo);
	return useMemo(async () => {
		try {
			const fullWidthFont = await loadFont(fontInfo.fullWidth);
			const halfWidthFont = await loadFont(fontInfo.halfWidth);

			const lines = text.split("\n");
			const result: Bitmap[][] = [];

			for (const line of lines) {
				const lineBitmaps: Bitmap[] = [];

				for (const char of line) {
					const isFullWidth = isFullWidthChar(char);
					const selectedFont = isFullWidth ? fullWidthFont : halfWidthFont;

					const glyph = selectedFont.glyph(char);
					const bitmap = (() => {
						if (isFullWidth) {
							return glyph?.draw(1) ?? tofu.fullWidth;
						} else {
							if (glyph == null) {
								return tofu.halfWidth;
							}
							const expectedWidth = fontInfo.fontSize / 2;
							return (
								glyph.draw(-1, [
									expectedWidth,
									fontInfo.fontSize,
									-(expectedWidth - glyph.meta.bbw) / 2,
									0,
								]) ?? tofu.halfWidth
							);
						}
					})();

					lineBitmaps.push(bitmap);
				}

				result.push(lineBitmaps);
			}

			return result;
		} catch (error) {
			console.error("Failed to get char bitmap info:", error);
			return [];
		}
	}, [
		fontInfo.fontSize,
		fontInfo.fullWidth,
		fontInfo.halfWidth,
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
					for (const bitmap of glyphs) {
						const bitmapWidth = bitmap.width();
						const bitmapHeight = bitmap.height();

						// ImageData を作成して描画
						const imageData = ctx.createImageData(bitmapWidth, bitmapHeight);
						const data = imageData.data;

						for (let row = 0; row < bitmapHeight; row++) {
							for (let col = 0; col < bitmapWidth; col++) {
								const pixelIndex = (row * bitmapWidth + col) * 4;
								if (bitmap.bindata[row][col] === "1") {
									data[pixelIndex] = fillColorRgb.r;
									data[pixelIndex + 1] = fillColorRgb.g;
									data[pixelIndex + 2] = fillColorRgb.b;
									data[pixelIndex + 3] = 255;
								} else {
									data[pixelIndex + 3] = 0;
								}
							}
						}

						ctx.putImageData(imageData, currentX, 0);
						currentX += bitmapWidth;
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
	}, [
		charBitmapsPromise,
		maxWidthPx,
		fontInfo.fontSize,
		fillColorRgb.r,
		fillColorRgb.g,
		fillColorRgb.b,
	]);
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
	lineImagesPromise,
}: DrawContentHookParams): Promise<DrawContent> {
	return useMemo(async () => {
		const drawLines = await lineImagesPromise;

		let maxWidth = 0;
		let totalHeight = 0;
		const lines: DrawLine[] = [];

		const fontHeightPx = fontInfo.fontSize * scaleY;
		const lineHeightPx = fontInfo.fontSize * lineHeight * scaleY;

		drawLines.forEach((drawLine, index) => {
			if (maxHeightPx && totalHeight + lineHeightPx > maxHeightPx) {
				// maxHeightPxを超える場合は表示しないが、DrawContentには含める
				totalHeight += lineHeightPx;
				return;
			}

			// skipLineCountに基づいて表示を調整
			if (index < skipLineCount) {
				totalHeight += lineHeightPx;
				return;
			}

			if (drawLine.canvas == null) {
				totalHeight += lineHeightPx;
				return;
			}

			const scaledWidth = drawLine.width * scaleX;
			const lineX = calculateXPosition(0, scaledWidth, maxWidthPx, align);

			lines.push({
				x: lineX,
				y: totalHeight,
				canvas: drawLine.canvas,
				width: scaledWidth,
				height: fontHeightPx,
			});

			maxWidth = Math.max(maxWidth, scaledWidth);
			totalHeight += lineHeightPx;
		});

		return {
			x,
			y,
			width: maxWidth,
			height: totalHeight,
			lines,
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
	]);
}

function wrapLineByWidth(
	charBitmaps: Bitmap[],
	maxWidthPx: number
): WrappedLineInfo[] {
	const wrappedLines: WrappedLineInfo[] = [];
	let currentGlyphs: Bitmap[] = [];
	let currentWidth = 0;

	for (const bitmap of charBitmaps) {
		const charWidth = bitmap.width();
		const charHeight = bitmap.height();

		if (charWidth === 0 || charHeight === 0) {
			continue;
		}

		if (currentWidth + charWidth > maxWidthPx && currentGlyphs.length > 0) {
			// 折り返し
			wrappedLines.push({
				glyphs: currentGlyphs,
				width: currentWidth,
			});
			currentGlyphs = [bitmap];
			currentWidth = charWidth;
		} else {
			currentGlyphs.push(bitmap);
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

function createLineGlyphInfo(charBitmaps: Bitmap[]): WrappedLineInfo {
	const glyphs: Bitmap[] = [];
	let lineWidth = 0;

	for (const bitmap of charBitmaps) {
		const charWidth = bitmap.width();
		const charHeight = bitmap.height();

		if (charWidth > 0 && charHeight > 0) {
			glyphs.push(bitmap);
			lineWidth += charWidth;
		}
	}

	return { glyphs, width: lineWidth };
}

function calculateXPosition(
	baseX: number,
	lineWidth: number,
	maxWidth: number,
	align: "left" | "center" | "right"
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
