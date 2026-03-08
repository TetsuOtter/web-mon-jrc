import { memo, useMemo } from "react";

import { useAppSelector } from "../../../../../store/hooks";
import {
	carCountSelector,
	createCarStateByCarIndexSelector,
} from "../../../../../store/monitors/type313s/type313sSelector";
import { toWide } from "../../../../../utils/toWide";
import FooterPageFrame from "../../components/FooterPageFrame";
import LocationLabel from "../../components/LocationLabel";
import Table, { areRowListsEqual } from "../../components/Table";
import TrainFormationImage, {
	LEFT as TRAIN_FORMATION_LEFT,
} from "../../components/car-image/TrainFormationImage";
import { WIDTH as CAR_IMAGE_WIDTH } from "../../components/car-image/constants";
import { COLORS, FONT_SIZE_1X } from "../../constants";
import { useCarStatePageMode } from "../../hooks/usePageMode";

import {
	createBrakeCellListSelector,
	createBrakeChopperOnCellListSelector,
	createNotchCellListSelector,
	createNumberCellListSelector,
	createPowerCellListSelector,
	createTableRowListSelector,
} from "./CarStateSwitchesUtil";
import BarGraph from "./components/BarGraph";
import BarGraphLegend from "./components/BarGraphLegend";
import { FOOTER_MENU } from "./constants";

import type { ValueFromStateSelector } from "./CarStateSwitchesUtil";
import type { ValueDef } from "./components/BarGraph";
import type { BarLabelProps, ScaleProps } from "./components/BarGraphLegend";
import type { Type313sBogieState } from "../../../../../store/monitors/type313s/type313sTypes";

const BRAKE_CHOPPER_TOP = 144;
const BRAKE_CHOPPER_LEFT = 15;
const BRAKE_CHOPPER_LABEL_COL_WIDTH = 178;

const BAR_GRAPH_TOP = 208;
const BAR_GRAPH_LEFT = 16;
const BAR_GRAPH_HEIGHT = 101;

const MM_BC_TABLE_TOP = 325;
const MM_BC_TABLE_LEFT = 40;
const MM_BC_TABLE_LABEL_COL_WIDTH = TRAIN_FORMATION_LEFT - MM_BC_TABLE_LEFT;
const MM_BC_TABLE_BORDER_HEIGHT = 4;

const NOTCH_TABLE_TOP = 435;
const NOTCH_TABLE_LEFT = MM_BC_TABLE_LEFT;
const NOTCH_TABLE_ROW_HEIGHT = 21;
const NOTCH_TABLE_LABEL_COL_WIDTH = MM_BC_TABLE_LABEL_COL_WIDTH + 1;
const NOTCH_TABLE_BORDER_HEIGHT = 3;

const CAR_COL_WIDTH = CAR_IMAGE_WIDTH - 1;
const ROW_HEIGHT = FONT_SIZE_1X + 1;

export default memo(function CarStatePowerBrake() {
	const mode = useCarStatePageMode();
	const carCount = useAppSelector(carCountSelector);
	const brakeChopperTableRowList = useAppSelector(
		brakeChopperRowListSelector,
		areRowListsEqual,
	);
	const mmBcTableRowList = useAppSelector(
		mmBcTableRowListSelector,
		areRowListsEqual,
	);
	const notchTableRowList = useAppSelector(
		notchRowListSelector,
		areRowListsEqual,
	);

	const brakeChopperTableDefinition = useTableDefinition(
		carCount,
		ROW_HEIGHT,
		brakeChopperTableRowList.length,
		BRAKE_CHOPPER_LABEL_COL_WIDTH,
	);
	const mmBcTableDefinition = useTableDefinition(
		carCount,
		FONT_SIZE_1X,
		mmBcTableRowList.length,
		MM_BC_TABLE_LABEL_COL_WIDTH,
	);
	const notchTableDefinition = useTableDefinition(
		carCount,
		NOTCH_TABLE_ROW_HEIGHT,
		notchTableRowList.length,
		NOTCH_TABLE_LABEL_COL_WIDTH,
	);

	return (
		<FooterPageFrame
			mode={mode}
			footerItems={FOOTER_MENU}
		>
			<LocationLabel />
			<TrainFormationImage />

			<BarGraphLegend
				leftSideScale={MM_BAR_LEGEND_SCALE}
				rightSideScale={BC_BAR_LEGEND_SCALE}
				relX={BAR_GRAPH_LEFT}
				barTop={BAR_GRAPH_TOP}
				barAreaHeight={BAR_GRAPH_HEIGHT}
				barLabelList={BAR_LEGEND_LABEL_LIST}
			/>

			{Array.from({ length: carCount }, (_, index) => (
				<BarGraph
					key={`bar-graph-${index}`}
					barTop={BAR_GRAPH_TOP}
					barAreaHeight={BAR_GRAPH_HEIGHT}
					carIndex={index}
					valueDefList={BAR_VALUE_DEF_LIST}
				/>
			))}

			<Table
				relX={BRAKE_CHOPPER_LEFT}
				relY={BRAKE_CHOPPER_TOP}
				rowList={brakeChopperTableRowList}
				cellWidthList={brakeChopperTableDefinition.cellWidthList}
				cellHeightList={brakeChopperTableDefinition.cellHeightList}
				borderColor={null}
				borderWidth={1}
				borderHeight={1}
			/>
			<Table
				relX={MM_BC_TABLE_LEFT}
				relY={MM_BC_TABLE_TOP}
				rowList={mmBcTableRowList}
				cellWidthList={mmBcTableDefinition.cellWidthList}
				cellHeightList={mmBcTableDefinition.cellHeightList}
				borderColor={null}
				borderWidth={0}
				borderHeight={MM_BC_TABLE_BORDER_HEIGHT}
			/>
			<Table
				relX={NOTCH_TABLE_LEFT}
				relY={NOTCH_TABLE_TOP}
				rowList={notchTableRowList}
				cellWidthList={notchTableDefinition.cellWidthList}
				cellHeightList={notchTableDefinition.cellHeightList}
				borderColor={null}
				borderWidth={0}
				borderHeight={NOTCH_TABLE_BORDER_HEIGHT}
			/>
		</FooterPageFrame>
	);
});

function useTableDefinition(
	carCount: number,
	rowHeight: number,
	rowCount: number,
	labelColWidth: number,
) {
	return useMemo(
		() => ({
			cellHeightList: Array.from({ length: rowCount }, () => rowHeight),
			cellWidthList: [labelColWidth].concat(
				Array.from({ length: carCount }, () => CAR_COL_WIDTH),
			),
		}),
		[carCount, rowHeight, rowCount, labelColWidth],
	);
}

const MM_BAR_COLOR = COLORS.AQUA;
const MM_BAR_MAX_VALUE = 500;
const MM_BAR_LEGEND_SCALE = {
	unit: "A",
	color: MM_BAR_COLOR,
	scaleStepList: [0, MM_BAR_MAX_VALUE / 2, MM_BAR_MAX_VALUE],
} as const satisfies ScaleProps;
const BC_BAR_COLOR = COLORS.YELLOW;
const BC_BAR_MAX_VALUE = 700;
const BC_BAR_LEGEND_SCALE = {
	unit: "kPa",
	color: BC_BAR_COLOR,
	scaleStepList: [0, BC_BAR_MAX_VALUE / 2, BC_BAR_MAX_VALUE],
} as const satisfies ScaleProps;
const BAR_LEGEND_LABEL_LIST = Array.from({ length: 2 })
	.map(
		(_, index): BarLabelProps => ({
			label: `MM${index + 1}`,
			color: MM_BAR_COLOR,
		}),
	)
	.concat(
		Array.from({ length: 2 }).map(
			(_, index): BarLabelProps => ({
				label: `BC${index + 1}`,
				color: BC_BAR_COLOR,
			}),
		),
	);

const avg = (value1: number | null, value2: number | null) => {
	if (value1 == null) {
		return value2;
	} else if (value2 == null) {
		return value1;
	} else {
		return (value1 + value2) / 2;
	}
};
const getMMCurrent = (bogie: Type313sBogieState | undefined) => {
	if (bogie == null) {
		return undefined;
	}
	return avg(bogie.mmCurrent1, bogie.mmCurrent2);
};
const MM_SELECTOR_LIST = [
	(carState) =>
		getMMCurrent(carState.bogieState?.left ?? carState.bogieState?.right),
	(carState) =>
		carState.bogieState?.left != null
			? getMMCurrent(carState.bogieState.right)
			: undefined,
] as const satisfies ValueFromStateSelector<number>[];
const BC_SELECTOR_LIST = [
	(carState) => {
		const list = carState.carStates.bcPressure;
		if (carState.cabState?.side === "left") {
			return avg(list[2], list[3]);
		} else {
			return avg(list[0], list[1]);
		}
	},
	(carState) => {
		const list = carState.carStates.bcPressure;
		if (carState.cabState?.side != null) {
			return undefined;
		} else {
			return avg(list[2], list[3]);
		}
	},
] as const satisfies ValueFromStateSelector<number>[];
const BAR_VALUE_DEF_LIST = MM_SELECTOR_LIST.map(
	(sel): ValueDef => ({
		valueSelector: createCarStateByCarIndexSelector(sel),
		color: MM_BAR_COLOR,
		maxValue: MM_BAR_MAX_VALUE,
	}),
).concat(
	BC_SELECTOR_LIST.map(
		(sel): ValueDef => ({
			valueSelector: createCarStateByCarIndexSelector(sel),
			color: BC_BAR_COLOR,
			maxValue: BC_BAR_MAX_VALUE,
		}),
	),
);

const brakeChopperRowListSelector = createTableRowListSelector(
	createBrakeChopperOnCellListSelector(
		"ブレーキチョッパ",
		(carState) => carState.carStates.isBrakeChopperOn,
	),
);

const mmBcTableRowListSelector = createTableRowListSelector(
	...MM_SELECTOR_LIST.map((sel, index) =>
		createPowerCellListSelector(toWide(`MM電流${index + 1}`) + "(A)", sel),
	),
	...BC_SELECTOR_LIST.map((sel, index) =>
		createBrakeCellListSelector(toWide(`BC圧力${index + 1}`) + "(kPa)", sel),
	),
	createNumberCellListSelector(
		"架線電圧  (V)",
		(carState) => carState.bogieState?.lineVoltage,
	),
);

const notchRowListSelector = createTableRowListSelector(
	createNotchCellListSelector(
		"受信ノッチ",
		(carState) => carState.carStates.receivedNotchCommand,
	),
	createNotchCellListSelector(
		"先頭ノッチ",
		(carState) => carState.cabState?.orderedNotchCommand,
	),
);
