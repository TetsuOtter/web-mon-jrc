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
} from "./constants";

// キャッシュ（基本イメージのみ保持）
const BaseCarImageCache = new Map<string, ImageData>();

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

/**
 * 基本イメージを取得（色情報なし、枠のみ）
 */
export function getBaseCarImage(info: BaseCarImageInfo): ImageData {
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

	// 背景は透明（RGBA: 0,0,0,0）
	// 白色フィル（RGBA: 255,255,255,255）

	if (info.isLeftCab || info.isRightCab) {
		drawCabBorder(
			data,
			info.isLeftCab ? LEFT_CAB_PATTERN : RIGHT_CAB_PATTERN,
			info.isLeftCab ? 0 : RIGHT_CAB_CLIFF_COL
		);
	}

	// 屋根、分離線などの枠線
	drawBorders(data, info);

	// パンタグラフ
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

	BaseCarImageCache.set(key, imageData);
	return imageData;
}

/**
 * キャブの枠線を描画
 */
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

/**
 * 屋根、分離線などの枠線を描画
 */
function drawBorders(data: Uint8ClampedArray, info: BaseCarImageInfo) {
	// 屋根線
	const roofRow = ROOF_Y;
	const roofRowIdx = roofRow * WIDTH * 4;

	const roofStartCol = info.isLeftCab ? CAB_WIDTH - 1 : 0;
	const roofEndCol = info.isRightCab ? WIDTH - CAB_WIDTH + 1 : WIDTH;

	for (let col = roofStartCol; col < roofEndCol; col++) {
		const pixelIdx = roofRowIdx + col * 4;
		BORDER_COLOR.setToData(data, pixelIdx);
	}

	// 左キャブ時の左端線
	if (info.isLeftCab) {
		const pixelIdx = roofRowIdx + 0 * 4;
		BORDER_COLOR.setToData(data, pixelIdx);
	}

	// 右キャブ時の右端線
	if (info.isRightCab) {
		const pixelIdx = roofRowIdx + (WIDTH - 1) * 4;
		BORDER_COLOR.setToData(data, pixelIdx);
	}

	// キャブ下部線と分離線
	for (let row = ROOF_Y; row < HEIGHT; row++) {
		const rowIdx = row * WIDTH * 4;
		if (
			row === ROOF_Y ||
			(row >= SEPARATOR_Y && row < SEPARATOR_Y + SEPARATOR_HEIGHT)
		) {
			// 全幅の線
			for (let col = 0; col < WIDTH; col++) {
				const pixelIdx = rowIdx + col * 4;
				BORDER_COLOR.setToData(data, pixelIdx);
			}
		} else {
			// 両端の線のみ
			const pixelIdxLeft = rowIdx + 0 * 4;
			BORDER_COLOR.setToData(data, pixelIdxLeft);

			const pixelIdxRight = rowIdx + (WIDTH - 1) * 4;
			BORDER_COLOR.setToData(data, pixelIdxRight);
		}
	}
}

/**
 * パンタグラフを描画
 */
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
