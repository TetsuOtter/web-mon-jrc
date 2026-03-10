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
	createNotchCellListSelector,
	createNumberCellListSelector,
	createPowerCellListSelector,
	createTableRowListSelector,
} from "./CarStateSwitchesUtil";
import BarGraph from "./components/BarGraph";
import BarGraphLegend from "./components/BarGraphLegend";
import PowerStateGraph from "./components/PowerStateGraph";
import { FOOTER_MENU } from "./constants";

import type { ValueFromStateSelector } from "./CarStateSwitchesUtil";
import type { ValueDef } from "./components/BarGraph";
import type { BarLabelProps, ScaleProps } from "./components/BarGraphLegend";

const LINE_VOLTAGE_TOP = 144;
const LINE_VOLTAGE_LEFT = 15;
const LINE_VOLTAGE_LABEL_COL_WIDTH = 178;

const BAR_GRAPH_TOP = 280;
const BAR_GRAPH_LEFT = 24;
const BAR_GRAPH_HEIGHT = 101;

const MM_CURRENT_TABLE_TOP = 384;
const MM_CURRENT_TABLE_LEFT = 24;
const MM_CURRENT_TABLE_LABEL_COL_WIDTH =
	TRAIN_FORMATION_LEFT - MM_CURRENT_TABLE_LEFT;
const MM_CURRENT_TABLE_BORDER_HEIGHT = 4;

const NOTCH_TABLE_TOP = 469;
const NOTCH_TABLE_LEFT = MM_CURRENT_TABLE_LEFT;
const NOTCH_TABLE_ROW_HEIGHT = 21;
const NOTCH_TABLE_LABEL_COL_WIDTH = MM_CURRENT_TABLE_LABEL_COL_WIDTH + 1;
const NOTCH_TABLE_BORDER_HEIGHT = 3;

const CAR_COL_WIDTH = CAR_IMAGE_WIDTH - 1;
const ROW_HEIGHT = FONT_SIZE_1X + 1;

const MM_CURRENT_TABLE_ROW_COUNT = 4;
const NOTCH_TABLE_ROW_COUNT = 2;

export default memo(function CarStatePower() {
	const mode = useCarStatePageMode();
	const carCount = useAppSelector(carCountSelector);
	const lineVoltageTableDefinition = useTableDefinition(
		carCount,
		ROW_HEIGHT,
		1,
		LINE_VOLTAGE_LABEL_COL_WIDTH,
	);
	const mmCurrentTableDefinition = useTableDefinition(
		carCount,
		FONT_SIZE_1X,
		MM_CURRENT_TABLE_ROW_COUNT,
		MM_CURRENT_TABLE_LABEL_COL_WIDTH,
	);
	const notchTableDefinition = useTableDefinition(
		carCount,
		NOTCH_TABLE_ROW_HEIGHT,
		NOTCH_TABLE_ROW_COUNT,
		NOTCH_TABLE_LABEL_COL_WIDTH,
	);

	const lineVoltageTableRowList = useAppSelector(
		lineVoltageRowListSelector,
		areRowListsEqual,
	);
	const mmCurrentTableRowList = useAppSelector(
		mmCurrentTableRowListSelector,
		areRowListsEqual,
	);
	const notchTableRowList = useAppSelector(
		notchRowListSelector,
		areRowListsEqual,
	);

	return (
		<FooterPageFrame
			mode={mode}
			footerItems={FOOTER_MENU}
		>
			<LocationLabel />
			<TrainFormationImage />

			<PowerStateGraph />

			<BarGraphLegend
				leftSideScale={BAR_LEGEND_SCALE}
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
				relX={LINE_VOLTAGE_LEFT}
				relY={LINE_VOLTAGE_TOP}
				rowList={lineVoltageTableRowList}
				cellWidthList={lineVoltageTableDefinition.cellWidthList}
				cellHeightList={lineVoltageTableDefinition.cellHeightList}
				borderColor={null}
				borderWidth={1}
				borderHeight={1}
			/>
			<Table
				relX={MM_CURRENT_TABLE_LEFT}
				relY={MM_CURRENT_TABLE_TOP}
				rowList={mmCurrentTableRowList}
				cellWidthList={mmCurrentTableDefinition.cellWidthList}
				cellHeightList={mmCurrentTableDefinition.cellHeightList}
				borderColor={null}
				borderWidth={0}
				borderHeight={MM_CURRENT_TABLE_BORDER_HEIGHT}
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

const BAR_COLOR = COLORS.AQUA;
const BAR_MAX_VALUE = 500;
const BAR_LEGEND_SCALE = {
	unit: "A",
	color: BAR_COLOR,
	scaleStepList: [0, BAR_MAX_VALUE / 2, BAR_MAX_VALUE],
} as const satisfies ScaleProps;
const BAR_LEGEND_LABEL_LIST = Array.from({ length: 4 }).map(
	(_, index): BarLabelProps => ({
		label: `MM${index + 1}`,
		color: BAR_COLOR,
	}),
);

const MM_CURRENT_SELECTOR_LIST = [
	(carState) =>
		(carState.bogieState?.left ?? carState.bogieState?.right)?.mmCurrent1,
	(carState) =>
		(carState.bogieState?.left ?? carState.bogieState?.right)?.mmCurrent2,
	(carState) =>
		carState.bogieState?.left != null && carState.bogieState?.right != null
			? carState.bogieState.right.mmCurrent1
			: undefined,
	(carState) =>
		carState.bogieState?.left != null && carState.bogieState?.right != null
			? carState.bogieState.right.mmCurrent2
			: undefined,
] as const satisfies ValueFromStateSelector<number>[];
const BAR_VALUE_DEF_LIST = MM_CURRENT_SELECTOR_LIST.map(
	(sel): ValueDef => ({
		valueSelector: createCarStateByCarIndexSelector(sel),
		color: BAR_COLOR,
		maxValue: BAR_MAX_VALUE,
	}),
);

const lineVoltageRowListSelector = createTableRowListSelector(
	createNumberCellListSelector(
		"架線電圧        (V)",
		(carState) => carState.bogieState?.lineVoltage,
	),
);

const mmCurrentTableRowListSelector = createTableRowListSelector(
	...MM_CURRENT_SELECTOR_LIST.map((sel, index) =>
		createPowerCellListSelector(toWide(`MM電流${index + 1}`) + "(A)", sel),
	),
);

const notchRowListSelector = createTableRowListSelector(
	createNotchCellListSelector(
		"受信ノッチ",
		(carState) => carState.carState.receivedNotchCommand,
	),
	createNotchCellListSelector(
		"先頭ノッチ",
		(carState) => carState.cabState?.orderedNotchCommand,
	),
);
