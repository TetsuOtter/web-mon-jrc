export type BaseCarImageInfo = {
	isLeftCab: boolean;
	isRightCab: boolean;

	hasLeftPantograph: boolean;
	hasRightPantograph: boolean;
};

export const isBaseCarImageEqual = (
	a: BaseCarImageInfo,
	b: BaseCarImageInfo,
): boolean =>
	a.isLeftCab === b.isLeftCab &&
	a.isRightCab === b.isRightCab &&
	a.hasLeftPantograph === b.hasLeftPantograph &&
	a.hasRightPantograph === b.hasRightPantograph;

export const BOGIE_STATE = {
	NONE: 0,
	MOTORED: 1,
	WORKING: 2,
} as const;
export type BogieState = (typeof BOGIE_STATE)[keyof typeof BOGIE_STATE];
export type CarImageBogieInfo = {
	left: BogieState;
	right: BogieState;
};

export const isCarImageBogieInfoEqual = (
	a: CarImageBogieInfo,
	b: CarImageBogieInfo,
): boolean => a.left === b.left && a.right === b.right;
