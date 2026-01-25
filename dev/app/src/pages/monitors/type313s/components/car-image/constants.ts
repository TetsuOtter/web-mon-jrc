import { FONT_SIZE_1X, RGB_COLORS } from "../../constants";

export const HEIGHT = 60;
export const WIDTH = 48;

export const CAB_Y = 1;
export const ROOF_Y = 11;
export const SEPARATOR_Y = ROOF_Y + FONT_SIZE_1X;
export const SEPARATOR_HEIGHT = 2;
export const CAB_WIDTH = 25;
export const CAB_BORDER_ROW_COUNT = ROOF_Y - CAB_Y + 1;
export const CAB_BORDER_WIDTH = CAB_WIDTH / CAB_BORDER_ROW_COUNT;
export const RIGHT_CAB_CLIFF_COL = WIDTH - CAB_WIDTH;

export const BOGIE_H_W = 7;
export const BOGIE_PADDING_LR = 1;
export const BOGIE_AREA_WIDTH = BOGIE_H_W + BOGIE_PADDING_LR * 2;
export const PANTOGRAPH_H_W = 11;

export const FLOOR_Y = HEIGHT - BOGIE_H_W;

export const CAB_BORDER = 1;
export const CAB_INNER = 2;

export const BORDER_COLOR = RGB_COLORS.WHITE;

export const BOGIE_PATTERN = [
	[0, 0, 1, 1, 1, 0, 0],
	[0, 1, 0, 0, 0, 1, 0],
	[1, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 1],
	[0, 1, 0, 0, 0, 1, 0],
	[0, 0, 1, 1, 1, 0, 0],
];

export const LEFT_CAB_PATTERN = generateLeftCab();
export const RIGHT_CAB_PATTERN = generateRightCab();

/**
 * 左キャブパターンを生成
 */
function generateLeftCab(): number[][] {
	const cab: number[][] = [];
	for (let row = 0; row < CAB_BORDER_ROW_COUNT; row++) {
		const rowData: number[] = new Array(CAB_WIDTH).fill(0);
		const startCol = Math.floor(
			CAB_BORDER_WIDTH * (CAB_BORDER_ROW_COUNT - row - 1)
		);
		const endCol = Math.floor(CAB_BORDER_WIDTH * (CAB_BORDER_ROW_COUNT - row));

		for (let col = startCol; col < endCol; col++) {
			rowData[col] = CAB_BORDER;
		}
		if (endCol < CAB_WIDTH - 1) {
			for (let col = endCol; col < CAB_WIDTH - 1; col++) {
				rowData[col] = CAB_INNER;
			}
		}
		rowData[CAB_WIDTH - 1] = CAB_BORDER;
		cab.push(rowData);
	}
	return cab;
}

/**
 * 右キャブパターンを生成（左を反転）
 */
function generateRightCab(): number[][] {
	const leftCab = generateLeftCab();
	return leftCab.map((row) => [...row].reverse());
}
