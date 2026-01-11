import {
	WIDTH,
	HEIGHT,
	BOGIE_PADDING_LR,
	BOGIE_AREA_WIDTH,
	BORDER_COLOR,
	BOGIE_H_W,
	BOGIE_PATTERN,
} from "./constants";

const BogieImageCache = new Map<string, ImageData>();

export const BOGIE_STATE = {
	NONE: 0,
	MOTORED: 1,
	WORKING: 2,
} as const;
export type BogieState = (typeof BOGIE_STATE)[keyof typeof BOGIE_STATE];
const isMotoredOrWorking = (
	state: BogieState
): state is Extract<BogieState, "MOTORED" | "WORKING"> =>
	state === BOGIE_STATE.MOTORED || state === BOGIE_STATE.WORKING;

export type CarImageBogieInfo = {
	left: BogieState;
	right: BogieState;
};

const BOGIE_FILL_COLOR = BORDER_COLOR;

function getBogieImageInfoKey(info: CarImageBogieInfo): string {
	return [info.left, info.right].join("");
}

/**
 * ボギーイメージを取得（構造と状態を反映）
 */
export function getBogieImage(info: CarImageBogieInfo): ImageData {
	const key = getBogieImageInfoKey(info);
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
	if (isMotoredOrWorking(info.left)) {
		const isWorking = info.left === BOGIE_STATE.WORKING;
		drawBogieImage(data, BOGIE_PADDING_LR, isWorking);
		drawBogieImage(data, BOGIE_AREA_WIDTH + BOGIE_PADDING_LR, isWorking);
	}
	if (isMotoredOrWorking(info.right)) {
		const isWorking = info.right === BOGIE_STATE.WORKING;
		drawBogieImage(
			data,
			WIDTH - BOGIE_AREA_WIDTH + BOGIE_PADDING_LR,
			isWorking
		);
		drawBogieImage(
			data,
			WIDTH - BOGIE_AREA_WIDTH * 2 + BOGIE_PADDING_LR,
			isWorking
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
					BOGIE_FILL_COLOR.setToData(data, pixelIdx);
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
