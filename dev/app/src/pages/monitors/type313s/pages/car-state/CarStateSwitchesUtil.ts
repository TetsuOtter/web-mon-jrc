import { carStateListSelector } from "../../../../../store/monitors/type313s/type313sSelector";
import {
	CAB_SES_STATE,
	VVVF2_STATE,
} from "../../../../../store/monitors/type313s/type313sTypes";
import { COLORS } from "../../constants";

import type {
	Type313sCarState,
	VVVF2State,
	CabSesState,
} from "../../../../../store/monitors/type313s/type313sTypes";
import type { AppSelector } from "../../../../../store/types";
import type { CellInfo, CellListForRow, RowList } from "../../components/Table";
import type { ColorValue } from "../../constants";

const TABLE_ROW_COUNT = 18;

export type ValueFromStateSelector<T> = (
	carState: Type313sCarState,
) => T | null | undefined;
type ToCellListForRowSelector = (
	carStateList: Type313sCarState[],
) => CellListForRow;

type CellCreator<T> = (value: T | null | undefined) => CellInfo;
function createCellInfoCreator<T>(
	cellInfoCreator: (value: T) => CellInfo,
): CellCreator<T> {
	return (value) => {
		if (value === null) {
			return {
				text: "－",
				textColor: COLORS.WHITE,
				horizontalAlign: "center",
			};
		} else if (value === undefined) {
			return {
				text: "",
				textColor: COLORS.GRAY,
			};
		}
		return cellInfoCreator(value);
	};
}

function createYWCellCreator(trueLabel: string, falseLabel: string) {
	return createCellInfoCreator<boolean>((v) => {
		if (v) {
			return {
				text: trueLabel,
				textColor: COLORS.BLACK,
				backgroundColor: COLORS.YELLOW,
				horizontalAlign: "center",
			};
		} else {
			return {
				text: falseLabel,
				textColor: COLORS.BLACK,
				backgroundColor: COLORS.WHITE,
				horizontalAlign: "center",
			};
		}
	});
}

function createNormalOrNotCellCreator(
	normalLabel: string,
	normalTextColor: ColorValue,
	normalBackgroundColor: ColorValue,
) {
	return createCellInfoCreator<boolean>((v) => {
		if (v) {
			return {
				text: normalLabel,
				textColor: normalTextColor,
				backgroundColor: normalBackgroundColor,
				horizontalAlign: "center",
			};
		} else {
			return {
				text: "異常",
				textColor: COLORS.WHITE,
				backgroundColor: COLORS.RED,
				horizontalAlign: "center",
			};
		}
	});
}

const createCabSesCell = createCellInfoCreator<CabSesState>((v) => {
	const text = (() => {
		switch (v) {
			case CAB_SES_STATE.FORWARD:
				return "前";
			case CAB_SES_STATE.REVERSE:
				return "後";
			case CAB_SES_STATE.NEUTRAL:
				return "中";
		}
	})();
	return {
		text,
		textColor: COLORS.BLACK,
		backgroundColor: COLORS.WHITE,
		horizontalAlign: "center",
	};
});

const createVVVF2Cell = createCellInfoCreator<VVVF2State>((v) => {
	switch (v) {
		case VVVF2_STATE.VVVF:
			return {
				text: "VVVF",
				textColor: COLORS.BLACK,
				backgroundColor: COLORS.YELLOW,
				horizontalAlign: "center",
			};
		case VVVF2_STATE.VVVF2:
			return {
				text: "VVVF2",
				textColor: COLORS.WHITE,
				backgroundColor: COLORS.RED,
				horizontalAlign: "center",
			};
	}
});

const createIsTestSWOnCell = createCellInfoCreator<boolean>((v) => {
	if (v) {
		return {
			text: "入",
			textColor: COLORS.BLACK,
			backgroundColor: COLORS.YELLOW,
			horizontalAlign: "center",
		};
	} else {
		return {
			text: "",
			textColor: COLORS.GRAY,
		};
	}
});

const createNumberCell = createCellInfoCreator<number>((v) => {
	return {
		text: `${v} `,
		textColor: COLORS.WHITE,
		backgroundColor: COLORS.BLACK,
		horizontalAlign: "right",
	};
});
const createPowerBrakeNumberCell = (
	color: ColorValue,
	maxCharCount: number,
): CellCreator<number> => {
	const backgroundMargin: CellInfo["backgroundMargin"] = {
		left: 8 * Math.max(5 - maxCharCount, 0),
		top: 0,
		right: 8,
		bottom: 0,
	};
	const valueIfNoData = "".padStart(maxCharCount, "－");
	return (value) => {
		if (value !== undefined) {
			return {
				text: `${value ?? valueIfNoData} `,
				textColor: COLORS.BLACK,
				backgroundColor: color,
				horizontalAlign: "right",
				backgroundMargin,
			};
		} else {
			return {
				text: "",
				textColor: COLORS.GRAY,
			};
		}
	};
};

const NOTCH_CELL_BG_MARGIN = {
	left: 2,
	top: 0,
	right: 2,
	bottom: 0,
} as const satisfies CellInfo["backgroundMargin"];
const createNotchCell = createCellInfoCreator<string>((v) => {
	return {
		text: v.slice(0, 2),
		textColor: COLORS.BLACK,
		backgroundColor: COLORS.WHITE,
		horizontalAlign: "center",
		verticalAlign: "center",
		backgroundMargin: NOTCH_CELL_BG_MARGIN,
	};
});
function createSelectorWithLabel<T>(
	label: string,
	sel: ValueFromStateSelector<T>,
	cellCreator: CellCreator<T>,
): ToCellListForRowSelector {
	return (carStateList) => [
		{
			text: label,
			textColor: COLORS.WHITE,
		},
		...carStateList.map((carState) => cellCreator(sel(carState))),
	];
}
function createPowerBrakeSelectorWithLabel<T>(
	label: string,
	color: ColorValue,
	sel: ValueFromStateSelector<T>,
	cellCreator: CellCreator<T>,
): ToCellListForRowSelector {
	return (carStateList) => [
		{
			text: label,
			textColor: color,
		},
		...carStateList.map((carState) => cellCreator(sel(carState))),
	];
}
export function createOnOffCellListSelector(
	label: string,
	sel: ValueFromStateSelector<boolean>,
): ToCellListForRowSelector {
	return createSelectorWithLabel(label, sel, createYWCellCreator("入", "切"));
}
export function createWorkingOrNotCellListSelector(
	label: string,
	sel: ValueFromStateSelector<boolean>,
): ToCellListForRowSelector {
	return createSelectorWithLabel(
		label,
		sel,
		createYWCellCreator("動作", "停止"),
	);
}
export function createNormalOrNotYRCellListSelector(
	label: string,
	sel: ValueFromStateSelector<boolean>,
): ToCellListForRowSelector {
	return createSelectorWithLabel(
		label,
		sel,
		createYWCellCreator("正常", "異常"),
	);
}

export function createNormalOrNotWhiteCellListSelector(
	label: string,
	sel: ValueFromStateSelector<boolean>,
): ToCellListForRowSelector {
	return createSelectorWithLabel(
		label,
		sel,
		createNormalOrNotCellCreator("平常", COLORS.BLACK, COLORS.BLACK),
	);
}
export function createNormalOrNotYellowCellListSelector(
	label: string,
	sel: ValueFromStateSelector<boolean>,
): ToCellListForRowSelector {
	return createSelectorWithLabel(
		label,
		sel,
		createNormalOrNotCellCreator("正常", COLORS.BLACK, COLORS.YELLOW),
	);
}

export function createCabSesCellListSelector(
	label: string,
	sel: ValueFromStateSelector<CabSesState>,
): ToCellListForRowSelector {
	return createSelectorWithLabel(label, sel, createCabSesCell);
}
export function createVVVF2CellListSelector(
	label: string,
	sel: ValueFromStateSelector<VVVF2State>,
): ToCellListForRowSelector {
	return createSelectorWithLabel(label, sel, createVVVF2Cell);
}
export function createIsTestSWOnCellListSelector(
	label: string,
	sel: ValueFromStateSelector<boolean>,
): ToCellListForRowSelector {
	return createSelectorWithLabel(label, sel, createIsTestSWOnCell);
}

export function createIsIvCNOnCellListSelector(
	label: string,
	sel: ValueFromStateSelector<boolean>,
): ToCellListForRowSelector {
	return createSelectorWithLabel(label, sel, createIsTestSWOnCell);
}

export function createNumberCellListSelector(
	label: string,
	sel: ValueFromStateSelector<number>,
): ToCellListForRowSelector {
	return createSelectorWithLabel(label, sel, createNumberCell);
}

export function createPowerCellListSelector(
	label: string,
	sel: ValueFromStateSelector<number>,
): ToCellListForRowSelector {
	return createPowerBrakeSelectorWithLabel(
		label,
		COLORS.AQUA,
		sel,
		createPowerBrakeNumberCell(COLORS.AQUA, 3),
	);
}
export function createBrakeCellListSelector(
	label: string,
	sel: ValueFromStateSelector<number>,
): ToCellListForRowSelector {
	return createPowerBrakeSelectorWithLabel(
		label,
		COLORS.YELLOW,
		sel,
		createPowerBrakeNumberCell(COLORS.YELLOW, 3),
	);
}

export function createNotchCellListSelector(
	label: string,
	sel: ValueFromStateSelector<string>,
): ToCellListForRowSelector {
	return createSelectorWithLabel(label, sel, createNotchCell);
}

export function createTableRowListSelector(
	...selectorList: ToCellListForRowSelector[]
): AppSelector<RowList> {
	return (state) => {
		const carStateList = carStateListSelector(state);
		return Array.from(
			{ length: TABLE_ROW_COUNT },
			(_, rowIndex) => selectorList[rowIndex]?.(carStateList) ?? [],
		);
	};
}
