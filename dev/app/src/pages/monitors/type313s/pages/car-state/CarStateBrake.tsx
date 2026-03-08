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
	createNotchCellListSelector,
	createNumberCellListSelector,
	createTableRowListSelector,
} from "./CarStateSwitchesUtil";
import BarGraph from "./components/BarGraph";
import BarGraphLegend from "./components/BarGraphLegend";
import { FOOTER_MENU } from "./constants";

import type { ValueFromStateSelector } from "./CarStateSwitchesUtil";
import type { ValueDef } from "./components/BarGraph";
import type { BarLabelProps, ScaleProps } from "./components/BarGraphLegend";

const BAR_GRAPH_TOP = 172;
const BAR_GRAPH_LEFT = 24;
const BAR_GRAPH_HEIGHT = 141;

const BC_PRESSURE_TABLE_TOP = 324;
const BC_PRESSURE_TABLE_LEFT = 24;
const BC_PRESSURE_TABLE_LABEL_COL_WIDTH =
	TRAIN_FORMATION_LEFT - BC_PRESSURE_TABLE_LEFT;
const BC_PRESSURE_TABLE_BORDER_HEIGHT = 4;

const NOTCH_TABLE_TOP = 435;
const NOTCH_TABLE_LEFT = BC_PRESSURE_TABLE_LEFT;
const NOTCH_TABLE_ROW_HEIGHT = 21;
const NOTCH_TABLE_LABEL_COL_WIDTH = BC_PRESSURE_TABLE_LABEL_COL_WIDTH + 1;
const NOTCH_TABLE_BORDER_HEIGHT = 3;

const CAR_COL_WIDTH = CAR_IMAGE_WIDTH - 1;

const BC_PRESSURE_TABLE_ROW_COUNT = 5;
const NOTCH_TABLE_ROW_COUNT = 2;

export default memo(function CarStateBrake() {
	const mode = useCarStatePageMode();
	const carCount = useAppSelector(carCountSelector);

	const bcPressureTableDefinition = useTableDefinition(
		carCount,
		FONT_SIZE_1X,
		BC_PRESSURE_TABLE_ROW_COUNT,
		BC_PRESSURE_TABLE_LABEL_COL_WIDTH,
	);
	const notchTableDefinition = useTableDefinition(
		carCount,
		NOTCH_TABLE_ROW_HEIGHT,
		NOTCH_TABLE_ROW_COUNT,
		NOTCH_TABLE_LABEL_COL_WIDTH,
	);

	const bcPressureTableRowList = useAppSelector(
		bcPressureTableRowListSelector,
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
				relX={BC_PRESSURE_TABLE_LEFT}
				relY={BC_PRESSURE_TABLE_TOP}
				rowList={bcPressureTableRowList}
				cellWidthList={bcPressureTableDefinition.cellWidthList}
				cellHeightList={bcPressureTableDefinition.cellHeightList}
				borderColor={null}
				borderWidth={0}
				borderHeight={BC_PRESSURE_TABLE_BORDER_HEIGHT}
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

const BAR_COLOR = COLORS.YELLOW;
const BAR_MAX_VALUE = 700;
const BAR_LEGEND_SCALE = {
	unit: "kPa",
	color: BAR_COLOR,
	scaleStepList: [
		0,
		BAR_MAX_VALUE / 4,
		BAR_MAX_VALUE / 2,
		(BAR_MAX_VALUE * 3) / 4,
		BAR_MAX_VALUE,
	],
} as const satisfies ScaleProps;
const BAR_LEGEND_LABEL_LIST = Array.from({ length: 4 }).map(
	(_, index): BarLabelProps => ({
		label: `BC${index + 1}`,
		color: BAR_COLOR,
	}),
);

const BC_PRESSURE_SELECTOR_LIST = [
	(carState) => carState.carStates.bcPressure[0],
	(carState) => carState.carStates.bcPressure[1],
	(carState) => carState.carStates.bcPressure[2],
	(carState) => carState.carStates.bcPressure[3],
] as const satisfies ValueFromStateSelector<number>[];
const BAR_VALUE_DEF_LIST = BC_PRESSURE_SELECTOR_LIST.map(
	(sel): ValueDef => ({
		valueSelector: createCarStateByCarIndexSelector(sel),
		color: BAR_COLOR,
		maxValue: BAR_MAX_VALUE,
	}),
);

const bcPressureTableRowListSelector = createTableRowListSelector(
	...BC_PRESSURE_SELECTOR_LIST.map((sel, index) =>
		createBrakeCellListSelector(toWide(`BC圧力${index + 1}`) + "(kPa)", sel),
	),
	createNumberCellListSelector(
		toWide("MR圧力") + "  (kPa)",
		(carState) => carState.carStates.mrPressure,
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
