import { RGB_COLORS } from "../constants";

import type { RgbColor } from "@web-mon-jrc/canvas-renderer/utils/colorUtil";

export const QUADRANT_SIZE = 14;
const EDGE_SIZE = 4;

const roundedButtonImageCache = new Map<string, OffscreenCanvas>();

function colorToKey(
	width: number,
	height: number,
	fillColor: RgbColor
): string {
	const colorStr = `${fillColor.r},${fillColor.g},${fillColor.b}`;
	return `rounded_${width}x${height}x${colorStr}`;
}

const TRANSPARENT = "0";
const WHITE = "1";
const AQUA = "2";
const FILL = "3";

const LEFT_UP = [
	getLine(11, 3, 0, 0, 0),
	getLine(8, 3, 3, 0, 0),
	getLine(6, 2, 6, 0, 0),
	getLine(5, 1, 5, 3, 0),
	getLine(4, 1, 3, 3, 3),
	getLine(3, 1, 3, 1, 6),
	getLine(2, 1, 3, 1, 7),
	getLine(2, 1, 2, 1, 8),
	getLine(1, 1, 2, 1, 9),
	getLine(1, 1, 2, 1, 9),
	getLine(1, 1, 2, 1, 9),
	getLine(0, 1, 2, 1, 10),
	getLine(0, 1, 2, 1, 10),
	getLine(0, 1, 2, 1, 10),
] as const satisfies readonly string[] & { length: typeof QUADRANT_SIZE };
const LEFT_DOWN = LEFT_UP.slice().reverse();
const RIGHT_UP = LEFT_UP.map((line) => line.split("").reverse().join(""));
const RIGHT_DOWN = RIGHT_UP.slice().reverse();

function getLine(
	transparent: number,
	white1: number,
	aqua: number,
	white2: number,
	fill: number
): string {
	const total = transparent + white1 + aqua + white2 + fill;
	if (total !== 14) {
		throw new Error(
			`getLine: The total of segments must be 14, but got ${total}`
		);
	}
	return (
		TRANSPARENT.repeat(transparent) +
		WHITE.repeat(white1) +
		AQUA.repeat(aqua) +
		WHITE.repeat(white2) +
		FILL.repeat(fill)
	);
}

const BYTES_PER_PIXEL = 4;

export function getRoundedButtonImage(
	width: number,
	height: number,
	fillColor: RgbColor
): OffscreenCanvas {
	if (height < QUADRANT_SIZE * 2 || width < QUADRANT_SIZE * 2) {
		throw new Error(
			`RoundedButton: height/width must be at least ${QUADRANT_SIZE * 2}, but got ${height}`
		);
	}

	const key = colorToKey(width, height, fillColor);

	const cachedImage = roundedButtonImageCache.get(key);
	if (cachedImage != null) {
		return cachedImage;
	}

	const imageData = new ImageData(width, height);
	const data = imageData.data;

	function setPixel(col: number, row: number, rgbColor: RgbColor | undefined) {
		if (rgbColor === undefined) return;
		const offset = row * width * BYTES_PER_PIXEL + col * BYTES_PER_PIXEL;
		rgbColor.setToData(data, offset);
	}

	function drawQuadrant(
		quadrant: readonly string[],
		offsetX: number,
		offsetY: number
	) {
		quadrant.forEach((line, rowIdx) => {
			const finalRow = offsetY + rowIdx;
			if (finalRow < 0 || finalRow >= height) return;

			let col = 0;
			for (const char of line) {
				const finalCol = offsetX + col;
				if (finalCol < 0 || finalCol >= width) {
					col++;
					continue;
				}

				let color: RgbColor | undefined;
				if (char === WHITE) {
					color = RGB_COLORS.WHITE;
				} else if (char === AQUA) {
					color = RGB_COLORS.AQUA;
				} else if (char === FILL) {
					color = fillColor;
				}

				setPixel(finalCol, finalRow, color);
				col++;
			}
		});
	}

	// Draw all four quadrants
	drawQuadrant(LEFT_UP, 0, 0); // Top-left
	drawQuadrant(RIGHT_UP, width - QUADRANT_SIZE, 0); // Top-right
	drawQuadrant(LEFT_DOWN, 0, height - QUADRANT_SIZE); // Bottom-left
	drawQuadrant(RIGHT_DOWN, width - QUADRANT_SIZE, height - QUADRANT_SIZE); // Bottom-right

	// Fill the middle sections
	// horizontal line
	for (let col = QUADRANT_SIZE; col < width - QUADRANT_SIZE; col++) {
		setPixel(col, 0, RGB_COLORS.WHITE);
		setPixel(col, 1, RGB_COLORS.AQUA);
		setPixel(col, 2, RGB_COLORS.AQUA);
		setPixel(col, 3, RGB_COLORS.WHITE);
		setPixel(col, height - 4, RGB_COLORS.WHITE);
		setPixel(col, height - 3, RGB_COLORS.AQUA);
		setPixel(col, height - 2, RGB_COLORS.AQUA);
		setPixel(col, height - 1, RGB_COLORS.WHITE);
	}

	// vertical line
	for (let row = QUADRANT_SIZE; row < height - QUADRANT_SIZE; row++) {
		setPixel(0, row, RGB_COLORS.WHITE);
		setPixel(1, row, RGB_COLORS.AQUA);
		setPixel(2, row, RGB_COLORS.AQUA);
		setPixel(3, row, RGB_COLORS.WHITE);
		setPixel(width - 4, row, RGB_COLORS.WHITE);
		setPixel(width - 3, row, RGB_COLORS.AQUA);
		setPixel(width - 2, row, RGB_COLORS.AQUA);
		setPixel(width - 1, row, RGB_COLORS.WHITE);
	}

	// Fill the center area
	for (let row = EDGE_SIZE; row < height - EDGE_SIZE; row++) {
		for (let col = EDGE_SIZE; col < width - EDGE_SIZE; col++) {
			const isLeftUpArea = row < QUADRANT_SIZE && col < QUADRANT_SIZE;
			const isRightUpArea = row < QUADRANT_SIZE && col >= width - QUADRANT_SIZE;
			const isLeftDownArea =
				row >= height - QUADRANT_SIZE && col < QUADRANT_SIZE;
			const isRightDownArea =
				row >= height - QUADRANT_SIZE && col >= width - QUADRANT_SIZE;
			if (isLeftUpArea || isRightUpArea || isLeftDownArea || isRightDownArea) {
				continue;
			}
			setPixel(col, row, fillColor);
		}
	}

	// キャッシュに保存
	const canvas = new OffscreenCanvas(width, height);
	const canvasCtx = canvas.getContext("2d");
	if (canvasCtx) {
		canvasCtx.putImageData(imageData, 0, 0);
	}
	roundedButtonImageCache.set(key, canvas);

	return canvas;
}
