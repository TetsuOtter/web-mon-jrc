import { Bitmap } from "bdfparser";
import { Texture } from "pixi.js";

import { hexToRgb, setTransparentToData } from "./colorUtil";

import type { GlyphData } from "../types/FontInfo";

/**
 * GlyphData (by reference) → fillColor → PIXI.Texture のキャッシュ
 */
const textureCache = new WeakMap<GlyphData, Map<string, Texture>>();

/**
 * GlyphDataからPIXI.Textureを取得（キャッシュ付き）
 * @param glyphData グリフデータ
 * @param fillColor 塗りつぶし色（hex文字列）
 */
export function getGlyphTexture(
	glyphData: GlyphData,
	fillColor: string,
): Texture {
	let colorMap = textureCache.get(glyphData);
	if (!colorMap) {
		colorMap = new Map<string, Texture>();
		textureCache.set(glyphData, colorMap);
	}

	const cached = colorMap.get(fillColor);
	if (cached) {
		return cached;
	}

	const bitmap = glyphData.bitmap;
	const w = bitmap.width();
	const h = bitmap.height();

	if (w === 0 || h === 0) {
		colorMap.set(fillColor, Texture.EMPTY);
		return Texture.EMPTY;
	}

	// ImageData を作成してグリフビットマップを描画
	const canvas = new OffscreenCanvas(w, h);
	const ctx = canvas.getContext("2d");
	if (!ctx) {
		colorMap.set(fillColor, Texture.EMPTY);
		return Texture.EMPTY;
	}

	const imageData = ctx.createImageData(w, h);
	const data = imageData.data;
	const fillColorRgb = hexToRgb(fillColor);

	for (let row = 0; row < h; row++) {
		for (let col = 0; col < w; col++) {
			const pixelIndex = (row * w + col) * 4;
			if (bitmap.bindata[row][col] === "1") {
				fillColorRgb.setToData(data, pixelIndex);
			} else {
				setTransparentToData(data, pixelIndex);
			}
		}
	}

	ctx.putImageData(imageData, 0, 0);

	// OffscreenCanvas から PIXI.Texture を作成
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const texture = Texture.from(canvas as any);
	texture.source.scaleMode = "nearest";
	texture.source.antialias = false;
	colorMap.set(fillColor, texture);
	return texture;
}

function getTofuPixel(
	row: number,
	col: number,
	height: number,
	width: number,
): "1" | "0" {
	const isFirstOrLastRow = row === 0 || row === height - 1;
	const isFirstOrLastCol = col === 0 || col === width - 1;
	const isFirstOrLast = isFirstOrLastRow || isFirstOrLastCol;

	const isOneInnerRow = row === 1 || row === height - 2;
	const isOneInnerCol = col === 1 || col === width - 2;
	const isOneInner = isOneInnerRow || isOneInnerCol;

	return isOneInner && !isFirstOrLast ? "1" : "0";
}

function generateTofuGlyphs(fontWidth: number): {
	halfWidth: GlyphData;
	fullWidth: GlyphData;
} {
	const widthForHalfWidth = fontWidth / 2;
	const halfWidthRows: string[] = [];
	const fullWidthRows: string[] = [];

	for (let row = 0; row < fontWidth; row++) {
		let halfWidthRow = "";
		let fullWidthRow = "";
		for (let col = 0; col < fontWidth; col++) {
			fullWidthRow += getTofuPixel(row, col, fontWidth, fontWidth);

			const isInHalfWidth = col < widthForHalfWidth;
			if (!isInHalfWidth) {
				continue;
			}
			halfWidthRow += getTofuPixel(row, col, fontWidth, widthForHalfWidth);
		}
		halfWidthRows.push(halfWidthRow);
		fullWidthRows.push(fullWidthRow);
	}

	return {
		halfWidth: {
			bitmap: new Bitmap(halfWidthRows),
			advanceWidth: widthForHalfWidth,
			xOffset: 0,
			yOffset: 0,
		},
		fullWidth: {
			bitmap: new Bitmap(fullWidthRows),
			advanceWidth: fontWidth,
			xOffset: 0,
			yOffset: 0,
		},
	};
}

/** fontWidth → tofu のキャッシュ */
const tofuCache = new Map<
	number,
	{ halfWidth: GlyphData; fullWidth: GlyphData }
>();

export function getTofu(fontWidth: number): {
	halfWidth: GlyphData;
	fullWidth: GlyphData;
} {
	const cached = tofuCache.get(fontWidth);
	if (cached) return cached;
	const tofu = generateTofuGlyphs(fontWidth);
	tofuCache.set(fontWidth, tofu);
	return tofu;
}
