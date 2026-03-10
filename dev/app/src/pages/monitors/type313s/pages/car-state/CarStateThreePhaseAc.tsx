import { memo, useMemo } from "react";

import { useAppSelector } from "../../../../../store/hooks";
import { carCountSelector } from "../../../../../store/monitors/type313s/type313sSelector";
import { toWide } from "../../../../../utils/toWide";
import FooterPageFrame from "../../components/FooterPageFrame";
import LocationLabel from "../../components/LocationLabel";
import Table, { areRowListsEqual } from "../../components/Table";
import TrainFormationImage from "../../components/car-image/TrainFormationImage";
import { WIDTH as CAR_IMAGE_WIDTH } from "../../components/car-image/constants";
import { COLORS, FONT_SIZE_1X } from "../../constants";
import { useCarStatePageMode } from "../../hooks/usePageMode";

import {
	createNumberCellListSelector,
	createOnOffCellListSelector,
	createTableRowListSelector,
	createVVVF2CellListSelector,
} from "./CarStateSwitchesUtil";
import ThreePhaseAcLineStateGraph from "./components/ThreePhaseAcLineStateGraph";
import { FOOTER_MENU } from "./constants";

const LINE_VOLTAGE_TOP = 144;
const LINE_VOLTAGE_LEFT = 15;
const LINE_VOLTAGE_LABEL_COL_WIDTH = 178;

const TABLE_TOP = 348;
const TABLE_LEFT = 36;

const SIV_TABLE_TOP = 440;
const SIV_TABLE_LEFT = TABLE_LEFT;

const LABEL_COL_WIDTH = 156;
const CAR_COL_WIDTH = CAR_IMAGE_WIDTH - 1;
const ROW_HEIGHT = FONT_SIZE_1X + 1;

const LABEL_CELL_PADDING_X = { left: 2 + FONT_SIZE_1X, right: 0 };
const CELL_PADDING_X_LIST = [LABEL_CELL_PADDING_X];

const TABLE_ROW_COUNT = 4;

export default memo(function CarStateThreePhaseAc() {
	const mode = useCarStatePageMode();
	const carCount = useAppSelector(carCountSelector);
	const lineVoltageTableDefinition = useTableDefinition(
		carCount,
		1,
		LINE_VOLTAGE_LABEL_COL_WIDTH,
	);
	const tableDefinition = useTableDefinition(
		carCount,
		TABLE_ROW_COUNT,
		LABEL_COL_WIDTH,
	);
	const sivTableDefinition = useTableDefinition(carCount, 2, LABEL_COL_WIDTH);
	const lineVoltageTableRowList = useAppSelector(
		lineVoltageRowListSelector,
		areRowListsEqual,
	);
	const tableRowList = useAppSelector(rowListSelector, areRowListsEqual);
	const sivTableRowList = useAppSelector(sivRowListSelector, areRowListsEqual);

	return (
		<FooterPageFrame
			mode={mode}
			footerItems={FOOTER_MENU}
		>
			<LocationLabel />
			<TrainFormationImage />

			<ThreePhaseAcLineStateGraph />

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
				relX={TABLE_LEFT}
				relY={TABLE_TOP}
				rowList={tableRowList}
				cellPaddingXList={CELL_PADDING_X_LIST}
				cellWidthList={tableDefinition.cellWidthList}
				cellHeightList={tableDefinition.cellHeightList}
				borderColor={COLORS.LIME}
				borderWidth={1}
				borderHeight={1}
			/>
			<Table
				relX={SIV_TABLE_LEFT}
				relY={SIV_TABLE_TOP}
				rowList={sivTableRowList}
				cellPaddingXList={CELL_PADDING_X_LIST}
				cellWidthList={sivTableDefinition.cellWidthList}
				cellHeightList={sivTableDefinition.cellHeightList}
				borderColor={null}
				borderWidth={1}
				borderHeight={4}
			/>
		</FooterPageFrame>
	);
});

function useTableDefinition(
	carCount: number,
	rowCount: number,
	labelColWidth: number,
) {
	return useMemo(
		() => ({
			cellHeightList: Array.from({ length: rowCount }, () => ROW_HEIGHT),
			cellWidthList: [labelColWidth].concat(
				Array.from({ length: carCount }, () => CAR_COL_WIDTH),
			),
		}),
		[carCount, rowCount, labelColWidth],
	);
}

const lineVoltageRowListSelector = createTableRowListSelector(
	createNumberCellListSelector(
		"架線電圧        (V)",
		(carState) => carState.bogieState?.lineVoltage,
	),
);

const rowListSelector = createTableRowListSelector(
	createVVVF2CellListSelector(
		toWide("VVVF2"),
		(carState) => carState.bogieState?.vvvf2State,
	),
	createOnOffCellListSelector(
		toWide("IvCN"),
		(carState) => carState.carState.sivLineState?.isIvCNOn,
	),
	createOnOffCellListSelector(
		toWide("IVS/MDS"),
		(carState) => carState.carState.sivLineState?.isIVSMDSOn,
	),
	createOnOffCellListSelector(
		"負荷半減",
		(carState) => carState.carState.isReduceLoadOn,
	),
);

const sivRowListSelector = createTableRowListSelector(
	createNumberCellListSelector(
		toWide("SIV") + "電圧   (V)",
		(carState) => carState.carState.sivLineState?.sivVoltage,
	),
	createNumberCellListSelector(
		toWide("SIV") + "周波数(Hz)",
		(carState) => carState.carState.sivLineState?.sivFrequency,
	),
);
