import { RGB_COLORS } from "../constants";

import type { RgbColor } from "../../../../canvas-renderer/utils/colorUtil";

const buttonImageCache = new Map<string, OffscreenCanvas>();

function colorToKey(
	width: number,
	height: number,
	shadowWidth: number,
	fillColor: RgbColor,
	isShadowColored: boolean
): string {
	const colorStr = `${fillColor.r},${fillColor.g},${fillColor.b}`;
	return `${width}x${height}x${shadowWidth}x${colorStr}x${isShadowColored}`;
}

const LIGHT_COLOR = RGB_COLORS.WHITE;
const BYTES_PER_PIXEL = 4;

export function getButtonImage(
	width: number,
	height: number,
	shadowWidth: number,
	fillColor: RgbColor,
	isShadowColored: boolean = false
): OffscreenCanvas {
	const key = colorToKey(
		width,
		height,
		shadowWidth,
		fillColor,
		isShadowColored
	);

	const cachedImage = buttonImageCache.get(key);
	if (cachedImage != null) {
		return cachedImage;
	}

	const imageData = new ImageData(width, height);
	const data = imageData.data;

	const shadowColor = isShadowColored ? fillColor : RGB_COLORS.BLUE;

	function setPixel(col: number, row: number, rgbColor: RgbColor) {
		const offset = row * width * BYTES_PER_PIXEL + col * BYTES_PER_PIXEL;
		data[offset] = rgbColor.r;
		data[offset + 1] = rgbColor.g;
		data[offset + 2] = rgbColor.b;
		data[offset + 3] = 0xff;
	}
	function setPixelRow(row: number, rgbColor: RgbColor) {
		for (let col = 0; col < width; col++) {
			setPixel(col, row, rgbColor);
		}
	}
	function fillRange(
		row: number,
		startCol: number,
		endCol: number,
		rgbColor: RgbColor
	) {
		for (let col = startCol; col < endCol; col++) {
			setPixel(col, row, rgbColor);
		}
	}

	// 一番下の辺
	setPixelRow(height - 1, shadowColor);

	// 上部の処理（shadowWidth + 1行）
	for (let row = 0; row <= shadowWidth + 1; row++) {
		// 上の白い部分
		setPixelRow(row, LIGHT_COLOR);
		if (row > 1) {
			// 右上の段々
			fillRange(row, width - row, width - 1, shadowColor);
		}
	}

	// 真ん中らへんの色
	for (let row = 2 + shadowWidth; row < height - 2 - shadowWidth; row++) {
		fillRange(row, 0, 2 + shadowWidth, LIGHT_COLOR);
		fillRange(row, 2 + shadowWidth, width - 2 - shadowWidth, fillColor);
		setPixel(width - 2 - shadowWidth, row, LIGHT_COLOR);
		fillRange(row, width - 1 - shadowWidth, width - 1, shadowColor);
		setPixel(width - 1, row, LIGHT_COLOR);
	}

	// 下から2番目の辺
	{
		const row = height - 2 - shadowWidth;
		fillRange(row, 0, width - 1 - shadowWidth, LIGHT_COLOR);
		fillRange(row, width - 1 - shadowWidth, width - 1, shadowColor);
		setPixel(width - 1, row, LIGHT_COLOR);
	}

	// 左下の段々
	for (let row = height - 1 - shadowWidth; row < height - 1; row++) {
		const v = row - (height - 1 - shadowWidth);
		const fillColorTargetCol = 1 + shadowWidth - v;
		// setPixel(fillColorTargetCol, row, shadowColor);
		// setPixelRow(row, LIGHT_COLOR);
		fillRange(row, 0, fillColorTargetCol, LIGHT_COLOR);
		fillRange(row, fillColorTargetCol, width - 1, shadowColor);
		setPixel(width - 1, row, LIGHT_COLOR);
	}

	// 一番下の辺
	setPixelRow(height - 1, LIGHT_COLOR);

	// キャッシュに保存
	const canvas = new OffscreenCanvas(width, height);
	const canvasCtx = canvas.getContext("2d");
	if (canvasCtx) {
		canvasCtx.putImageData(imageData, 0, 0);
	}
	buttonImageCache.set(key, canvas);

	return canvas;
}
