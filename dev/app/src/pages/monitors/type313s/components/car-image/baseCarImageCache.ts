import {
	WIDTH,
	HEIGHT,
	LEFT_CAB_PATTERN,
	RIGHT_CAB_PATTERN,
	RIGHT_CAB_CLIFF_COL,
	PANTOGRAPH_H_W,
	CAB_WIDTH,
	CAB_Y,
	CAB_BORDER,
	BORDER_COLOR,
	ROOF_Y,
	SEPARATOR_Y,
	SEPARATOR_HEIGHT,
	FLOOR_Y,
} from "./constants";

const BaseCarImageCache = new Map<string, OffscreenCanvas>();

export type BaseCarImageInfo = {
	isLeftCab: boolean;
	isRightCab: boolean;

	hasLeftPantograph: boolean;
	hasRightPantograph: boolean;
};

function getBaseCarImageInfoKey(info: BaseCarImageInfo): string {
	if (info.isLeftCab && info.isRightCab) {
		throw new Error("A car cannot have both left and right cabs");
	}
	const cabKey = info.isLeftCab ? "L" : info.isRightCab ? "R" : "N";
	return [
		cabKey,
		info.hasLeftPantograph ? "1" : "0",
		info.hasRightPantograph ? "1" : "0",
	].join("");
}

export function getBaseCarImage(info: BaseCarImageInfo): OffscreenCanvas {
	const key = getBaseCarImageInfoKey(info);
	const cached = BaseCarImageCache.get(key);
	if (cached) {
		return cached;
	}

	const canvas = new OffscreenCanvas(WIDTH, HEIGHT);
	const ctx = canvas.getContext("2d");
	if (!ctx) {
		throw new Error("Failed to get 2D context for base car image");
	}

	const imageData = ctx.createImageData(WIDTH, HEIGHT);
	const data = imageData.data;

	if (info.isLeftCab || info.isRightCab) {
		drawCabBorder(
			data,
			info.isLeftCab ? LEFT_CAB_PATTERN : RIGHT_CAB_PATTERN,
			info.isLeftCab ? 0 : RIGHT_CAB_CLIFF_COL
		);
	}

	drawBorders(data, info);

	if (info.hasLeftPantograph) {
		const col = info.isRightCab
			? 0
			: info.isLeftCab
				? WIDTH - PANTOGRAPH_H_W
				: Math.floor(WIDTH / 2 - PANTOGRAPH_H_W / 2);
		drawPantograph(data, col);
	}

	if (info.hasRightPantograph) {
		const col = info.isLeftCab
			? CAB_WIDTH
			: info.isRightCab
				? WIDTH - CAB_WIDTH - PANTOGRAPH_H_W
				: -1; // 中間車は未対応
		if (col >= 0) {
			drawPantograph(data, col);
		}
	}

	ctx.imageSmoothingEnabled = false;
	ctx.putImageData(imageData, 0, 0);
	BaseCarImageCache.set(key, canvas);
	return canvas;
}

function drawCabBorder(
	data: Uint8ClampedArray,
	cabPattern: number[][],
	startCol: number
) {
	for (let cabRow = 0; cabRow < cabPattern.length; cabRow++) {
		const imgRow = CAB_Y + cabRow;
		const rowStartIdx = imgRow * WIDTH * 4;

		for (let cabCol = 0; cabCol < cabPattern[cabRow].length; cabCol++) {
			const imgCol = startCol + cabCol;
			if (imgCol >= 0 && imgCol < WIDTH) {
				const pixelIdx = rowStartIdx + imgCol * 4;
				if (cabPattern[cabRow][cabCol] === CAB_BORDER) {
					BORDER_COLOR.setToData(data, pixelIdx);
				}
			}
		}
	}
}

function drawBorders(data: Uint8ClampedArray, info: BaseCarImageInfo) {
	const roofStartCol = info.isLeftCab ? CAB_WIDTH - 1 : 0;
	const roofEndCol = info.isRightCab ? WIDTH - CAB_WIDTH + 1 : WIDTH;

	for (let row = ROOF_Y; row < FLOOR_Y; row++) {
		const rowIdx = row * WIDTH * 4;
		const isRoofRow = row === ROOF_Y;
		const isSeparatorRow =
			SEPARATOR_Y <= row && row < SEPARATOR_Y + SEPARATOR_HEIGHT;
		const isFloorRow = row === FLOOR_Y - 1;
		if (isRoofRow) {
			for (let col = roofStartCol; col < roofEndCol; col++) {
				const pixelIdx = rowIdx + col * 4;
				BORDER_COLOR.setToData(data, pixelIdx);
			}
		} else if (isSeparatorRow || isFloorRow) {
			for (let col = 0; col < WIDTH; col++) {
				const pixelIdx = rowIdx + col * 4;
				BORDER_COLOR.setToData(data, pixelIdx);
			}
		} else {
			const pixelIdxLeft = rowIdx + 0 * 4;
			BORDER_COLOR.setToData(data, pixelIdxLeft);

			const pixelIdxRight = rowIdx + (WIDTH - 1) * 4;
			BORDER_COLOR.setToData(data, pixelIdxRight);
		}
	}
}

function drawPantograph(data: Uint8ClampedArray, col: number) {
	for (let pantographRow = 0; pantographRow < PANTOGRAPH_H_W; pantographRow++) {
		const isUpper = pantographRow <= Math.floor(PANTOGRAPH_H_W / 2);
		const imgRow = pantographRow;
		const rowIdx = imgRow * WIDTH * 4;

		const subtractVal = isUpper
			? pantographRow
			: PANTOGRAPH_H_W - pantographRow - 1;
		const startPanCol = 5 - subtractVal;
		const endPanCol = PANTOGRAPH_H_W - startPanCol;

		const startImgCol = col + startPanCol;
		const endImgCol = col + endPanCol;

		for (let imgCol = startImgCol; imgCol < endImgCol; imgCol++) {
			if (imgCol >= 0 && imgCol < WIDTH) {
				const pixelIdx = rowIdx + imgCol * 4;
				BORDER_COLOR.setToData(data, pixelIdx);
			}
		}
	}
}
