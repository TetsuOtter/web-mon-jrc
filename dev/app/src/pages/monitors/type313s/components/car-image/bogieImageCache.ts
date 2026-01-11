import {
	WIDTH,
	HEIGHT,
	BOGIE_PADDING_LR,
	BOGIE_AREA_WIDTH,
	BORDER_COLOR,
	BOGIE_H_W,
	BOGIE_PATTERN,
} from "./constants";

// ボギーイメージキャッシュ
// キー: "L_W" (左ボギー、Working状態) または "L_S" (左ボギー、停止状態) など
const BogieImageCache = new Map<string, ImageData>();

type BogieImageInfo = {
	isLeftBogieMotored: boolean;
	isRightBogieMotored: boolean;
};

type BogieWorkingState = {
	isLeftBogieWorking: boolean;
	isRightBogieWorking: boolean;
};

function getBogieImageInfoKey(
	info: BogieImageInfo,
	working: BogieWorkingState
): string {
	return [
		info.isLeftBogieMotored ? "L" : "_",
		working.isLeftBogieWorking ? "W" : "S",
		info.isRightBogieMotored ? "R" : "_",
		working.isRightBogieWorking ? "W" : "S",
	].join("");
}

/**
 * ボギーイメージを取得（構造と状態を反映）
 */
export function getBogieImage(
	info: BogieImageInfo,
	working: BogieWorkingState
): ImageData {
	const key = getBogieImageInfoKey(info, working);
	const cached = BogieImageCache.get(key);
	if (cached) {
		return cached;
	}

	const canvas = new OffscreenCanvas(WIDTH, HEIGHT);
	const ctx = canvas.getContext("2d");
	if (!ctx) {
		throw new Error("Failed to get 2D context for bogie image");
	}

	const imageData = ctx.createImageData(WIDTH, HEIGHT);
	const data = imageData.data;

	// 背景は透明（RGBA: 0,0,0,0）

	// ボギーの構造を描画
	if (info.isLeftBogieMotored) {
		drawBogieImage(data, BOGIE_PADDING_LR, working.isLeftBogieWorking);
		drawBogieImage(
			data,
			BOGIE_AREA_WIDTH + BOGIE_PADDING_LR,
			working.isLeftBogieWorking
		);
	}
	if (info.isRightBogieMotored) {
		drawBogieImage(
			data,
			WIDTH - BOGIE_AREA_WIDTH + BOGIE_PADDING_LR,
			working.isRightBogieWorking
		);
		drawBogieImage(
			data,
			WIDTH - BOGIE_AREA_WIDTH * 2 + BOGIE_PADDING_LR,
			working.isRightBogieWorking
		);
	}

	BogieImageCache.set(key, imageData);
	return imageData;
}

/**
 * ボギーイメージを描画（Working状態に応じた色付け付き）
 */
function drawBogieImage(
	data: Uint8ClampedArray,
	col: number,
	isWorking: boolean
) {
	for (let bogieRow = 0; bogieRow < BOGIE_PATTERN.length; bogieRow++) {
		const imgRow = HEIGHT - BOGIE_H_W + bogieRow;
		const rowIdx = imgRow * WIDTH * 4;
		const bogieRowPattern = BOGIE_PATTERN[bogieRow];

		if (isWorking) {
			// 動作中は全体を塗りつぶし
			const startBogieCol = bogieRowPattern.indexOf(1);
			let endBogieCol = startBogieCol;
			for (let i = bogieRowPattern.length - 1; i >= 0; i--) {
				if (bogieRowPattern[i] === 1) {
					endBogieCol = i;
					break;
				}
			}

			for (let bogieCol = startBogieCol; bogieCol <= endBogieCol; bogieCol++) {
				const imgCol = col + bogieCol;
				if (imgCol >= 0 && imgCol < WIDTH) {
					const pixelIdx = rowIdx + imgCol * 4;
					// 白色で塗りつぶし (RGBA: 255, 255, 255, 255)
					data[pixelIdx] = 255;
					data[pixelIdx + 1] = 255;
					data[pixelIdx + 2] = 255;
					data[pixelIdx + 3] = 255;
				}
			}
		} else {
			// 停止時は構造のみ（枠線として描画）
			for (let bogieCol = 0; bogieCol < bogieRowPattern.length; bogieCol++) {
				if (bogieRowPattern[bogieCol] === 1) {
					const imgCol = col + bogieCol;
					if (imgCol >= 0 && imgCol < WIDTH) {
						const pixelIdx = rowIdx + imgCol * 4;
						BORDER_COLOR.setToData(data, pixelIdx);
					}
				}
			}
		}
	}
}
