import { memo, useEffect, useMemo } from "react";

import { Container, Sprite } from "pixi.js";

import {
	useCanvasObjectContext,
	type ClickEventHandler,
} from "../contexts/CanvasObjectContext";
import { usePixiObject, clearContainer } from "../hooks/usePixiObject";
import { isFullWidthChar, DEFAULT_FONT_INFO } from "../types/FontInfo";
import { loadFont, type AvailableFont } from "../utils/fontLoader";
import { getGlyphTexture, getTofu } from "../utils/glyphTextureCache";

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

type DrawLine = {
	glyphs: GlyphData[];
	x: number;
	y: number;
	lineWidth: number;
	height: number;
};

type DrawContent = {
	lines: DrawLine[];
};

type WrappedLineInfo = {
	glyphs: GlyphData[];
	width: number;
};

/**
 * BDF フォントを使用するテキスト描画オブジェクト（PIXI.Sprite版）
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

	const charBitmapsPromise = useCharBitmaps({ fontInfo, text });

	const drawContentPromise = useMemo(async (): Promise<DrawContent> => {
		const charBitmaps = await charBitmapsPromise;
		const normalizedSkipLineCount = Math.max(0, Math.floor(skipLineCount));
		const fontHeightPx = fontInfo.fontSize * scaleY;
		const lineHeightPx = fontInfo.fontSize * lineHeight * scaleY;

		let visibleHeight = 0;
		const lines: DrawLine[] = [];

		for (let lineIndex = 0; lineIndex < charBitmaps.length; lineIndex++) {
			if (lineIndex < normalizedSkipLineCount) continue;

			const lineGlyphs = charBitmaps[lineIndex];

			const wrappedLines = maxWidthPx
				? wrapLineByWidth(lineGlyphs, maxWidthPx)
				: [createLineGlyphInfo(lineGlyphs)];

			for (const { glyphs, width: lineWidth } of wrappedLines) {
				if (maxHeightPx && visibleHeight + lineHeightPx > maxHeightPx) {
					break;
				}

				if (glyphs.length === 0) {
					visibleHeight += lineHeightPx;
					continue;
				}

				const scaledWidth = lineWidth * scaleX;
				const lineX = calculateXPosition(0, scaledWidth, maxWidthPx, align);

				lines.push({
					glyphs,
					x: lineX,
					y: visibleHeight,
					lineWidth,
					height: fontHeightPx,
				});

				visibleHeight += lineHeightPx;
			}
		}

		// 垂直アライメント調整
		const adjustedLines = lines.map((line) => ({
			...line,
			y: calculateYPosition(line.y, visibleHeight, maxHeightPx, verticalAlign),
		}));

		return { lines: adjustedLines };
	}, [
		charBitmapsPromise,
		fontInfo.fontSize,
		scaleX,
		scaleY,
		lineHeight,
		maxWidthPx,
		maxHeightPx,
		skipLineCount,
		align,
		verticalAlign,
	]);

	// onLineInfoChanged を非同期で更新
	useEffect(() => {
		if (!onLineInfoChanged) return;
		drawContentPromise.then((drawContent) => {
			onLineInfoChanged(drawContent.lines.length, drawContent.lines.length);
		});
	}, [drawContentPromise, onLineInfoChanged]);

	const { graphicsContainer } = usePixiObject({
		relX,
		relY,
		width: maxWidthPx,
		height: maxHeightPx,
		onClick,
	});

	useEffect(() => {
		if (graphicsContainer.destroyed) return;

		let cancelled = false;

		(async () => {
			const drawContent = await drawContentPromise;
			if (cancelled || graphicsContainer.destroyed) return;

			clearContainer(graphicsContainer);

			for (const line of drawContent.lines) {
				const lineContainer = new Container();
				lineContainer.x = roundToPixel(line.x);
				lineContainer.y = roundToPixel(line.y);

				let currentX = 0;
				for (const glyph of line.glyphs) {
					const texture = getGlyphTexture(glyph, fillColor);

					if (texture.width > 0 && texture.height > 0) {
						const sprite = new Sprite(texture);
						sprite.roundPixels = true;
						sprite.x = roundToPixel(currentX + glyph.xOffset);
						sprite.y = roundToPixel(glyph.yOffset);
						lineContainer.addChild(sprite);
					}

					currentX += glyph.advanceWidth;
				}

				lineContainer.scale.set(scaleX, scaleY);
				graphicsContainer.addChild(lineContainer);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [graphicsContainer, drawContentPromise, fillColor, scaleX, scaleY]);

	return null;
});

type UseCharBitmapsParams = {
	fontInfo: FontInfo;
	text: string;
};

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

function glyphToGlyphData(
	glyph: NonNullable<ReturnType<Awaited<ReturnType<typeof loadFont>>["glyph"]>>,
	fontSize: number,
): GlyphData {
	const bitmap = glyph.draw(1);
	const advanceWidth = glyph.meta.dwx0 ?? glyph.meta.bbw;
	const xOffset = glyph.meta.bbxoff;
	const bbyoff = glyph.meta.bbyoff ?? 0;
	const fontAscentStr = glyph.font.props["font_ascent"];
	const fontAscent = fontAscentStr != null ? parseInt(fontAscentStr) : fontSize;
	const yOffset = fontAscent - bbyoff - glyph.meta.bbh;
	return { bitmap, advanceWidth, xOffset, yOffset };
}

function useCharBitmaps({
	fontInfo,
	text,
}: UseCharBitmapsParams): Promise<GlyphData[][]> {
	const tofu = getTofu(fontInfo.fontSize);

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

function wrapLineByWidth(
	charGlyphs: GlyphData[],
	maxWidthPx: number,
): WrappedLineInfo[] {
	const wrappedLines: WrappedLineInfo[] = [];
	let currentGlyphs: GlyphData[] = [];
	let currentWidth = 0;

	for (const glyphData of charGlyphs) {
		const charWidth = glyphData.advanceWidth;
		if (charWidth === 0) continue;

		if (currentWidth + charWidth > maxWidthPx && currentGlyphs.length > 0) {
			wrappedLines.push({ glyphs: currentGlyphs, width: currentWidth });
			currentGlyphs = [glyphData];
			currentWidth = charWidth;
		} else {
			currentGlyphs.push(glyphData);
			currentWidth += charWidth;
		}
	}

	if (currentGlyphs.length > 0) {
		wrappedLines.push({ glyphs: currentGlyphs, width: currentWidth });
	}

	return wrappedLines.length > 0 ? wrappedLines : [{ glyphs: [], width: 0 }];
}

function createLineGlyphInfo(charGlyphs: GlyphData[]): WrappedLineInfo {
	const glyphs: GlyphData[] = [];
	let lineWidth = 0;

	for (const glyphData of charGlyphs) {
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
	if (maxWidth === 0) return baseX;

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

	if (totalHeight >= availableHeight) return currentY;

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

function roundToPixel(value: number): number {
	return Math.round(value);
}
