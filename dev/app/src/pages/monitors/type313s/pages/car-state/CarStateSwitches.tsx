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
import { useFooterAreaWithPagerProps } from "../../footer/FooterAreaWithPagerPropsHook";
import { useCarStatePageMode } from "../../hooks/usePageMode";

import {
	createCabSesCellListSelector,
	createIsTestSWOnCellListSelector,
	createNormalOrNotWhiteCellListSelector,
	createNormalOrNotYellowCellListSelector,
	createOnOffCellListSelector,
	createSwitchesRowListSelector,
	createVVVF2CellListSelector,
	createWorkingOrNotCellListSelector,
} from "./CarStateSwitchesUtil";
import { FOOTER_MENU } from "./constants";

const TABLE_TOP = 186;
const TABLE_LEFT = 36;

const LABEL_COL_WIDTH = 156;
const CAR_COL_WIDTH = CAR_IMAGE_WIDTH - 1;
const ROW_HEIGHT = FONT_SIZE_1X + 1;

const LABEL_CELL_PADDING_X = { left: 7, right: 0 };
const CELL_PADDING_X_LIST = [LABEL_CELL_PADDING_X];

const TABLE_ROW_COUNT = 18;

export default memo(function CarStateSwitches() {
	const mode = useCarStatePageMode();
	const pagerProps = useFooterAreaWithPagerProps(ROWS_SELECTOR_LIST.length - 1);
	const carCount = useAppSelector(carCountSelector);
	const tableDefinition = useTableDefinition(carCount);
	const tableRowList = useAppSelector(
		ROWS_SELECTOR_LIST[pagerProps.currentPageIndex],
		areRowListsEqual
	);

	return (
		<FooterPageFrame
			mode={mode}
			footerItems={FOOTER_MENU}
			pagerProps={pagerProps}>
			<LocationLabel />

			<TrainFormationImage />

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
		</FooterPageFrame>
	);
});

function useTableDefinition(carCount: number) {
	return useMemo(
		() => ({
			cellHeightList: Array.from({ length: TABLE_ROW_COUNT }, () => ROW_HEIGHT),
			cellWidthList: [LABEL_COL_WIDTH].concat(
				Array.from({ length: carCount }, () => CAR_COL_WIDTH)
			),
		}),
		[carCount]
	);
}

const rowsForPage1Selector = createSwitchesRowListSelector(
	createOnOffCellListSelector(
		toWide("MS"),
		(carState) => carState.carStates.isMSOn
	),
	createOnOffCellListSelector(
		toWide("HB"),
		(carState) => carState.bogieState?.isHBOn
	),
	createOnOffCellListSelector(
		toWide("LB1"),
		(carState) => carState.bogieState?.isLB1On
	),
	createOnOffCellListSelector(toWide("LB2"), (carState) => {
		if (carState.bogieState?.left != null) {
			return carState.bogieState.left.isLbOn;
		} else if (carState.bogieState?.right != null) {
			return carState.bogieState.right.isLbOn;
		}
		return undefined;
	}),
	createOnOffCellListSelector(toWide("LB3"), (carState) => {
		if (
			carState.bogieState?.left != null &&
			carState.bogieState.right != null
		) {
			return carState.bogieState.right.isLbOn;
		}
		return undefined;
	}),
	createOnOffCellListSelector(toWide("MCOS1"), (carState) => {
		if (carState.bogieState?.left != null) {
			return carState.bogieState.left.isMCOS1On;
		} else if (carState.bogieState?.right != null) {
			return carState.bogieState.right.isMCOS1On;
		}
		return undefined;
	}),
	createOnOffCellListSelector(toWide("MCOS2"), (carState) => {
		if (carState.bogieState?.left != null) {
			return carState.bogieState.left.isMCOS2On;
		} else if (carState.bogieState?.right != null) {
			return carState.bogieState.right.isMCOS2On;
		}
		return undefined;
	}),
	createOnOffCellListSelector(toWide("MCOS3"), (carState) => {
		if (
			carState.bogieState?.left != null &&
			carState.bogieState.right != null
		) {
			return carState.bogieState.right.isMCOS1On;
		}
		return undefined;
	}),
	createOnOffCellListSelector(toWide("MCOS4"), (carState) => {
		if (
			carState.bogieState?.left != null &&
			carState.bogieState.right != null
		) {
			return carState.bogieState.right.isMCOS2On;
		}
		return undefined;
	}),
	createNormalOrNotWhiteCellListSelector(
		toWide("CCOS"),
		(carState) => carState.bogieState?.isCCOSNormal
	)
);

// const SWITCH_TYPES_2 = [
// 	toWide("SIV"),
// 	toWide("CP"),
// 	"元溜圧力",
// 	toWide("CabSes"),
// 	toWide("VVVF2"),
// 	`${toWide("CgK(")}SIV${toWide(")")}`,
// 	`${toWide("CgK(")}VVVF2${toWide(")")}`,
// 	toWide("車上試験SW"),
// 	toWide("BH非常"),
// 	"車掌非常",
// 	toWide("耐雪B"),
// 	toWide("直予備B"),
// ];

const rowsForPage2Selector = createSwitchesRowListSelector(
	createOnOffCellListSelector(
		toWide("SIV"),
		(carState) => carState.carStates.sivLineState?.isSIVOn
	),
	createWorkingOrNotCellListSelector(
		toWide("CP"),
		(carState) => carState.carStates.isCPOn
	),
	createNormalOrNotYellowCellListSelector(
		"元溜圧力",
		(carState) => carState.carStates.isMRPressureNormal
	),
	createCabSesCellListSelector(
		toWide("CabSes"),
		(carState) => carState.cabState?.cabSesState
	),
	createVVVF2CellListSelector(
		toWide("VVVF2"),
		(carState) => carState.bogieState?.vvvf2State
	),
	createOnOffCellListSelector(
		`${toWide("CgK(")}SIV${toWide(")")}`,
		(carState) => carState.carStates.sivLineState?.isCgKForSIVOn
	),
	createOnOffCellListSelector(
		`${toWide("CgK(")}VVVF2${toWide(")")}`,
		(carState) => carState.bogieState?.isCgKForVVVF2On
	),
	createIsTestSWOnCellListSelector(
		toWide("車上試験SW"),
		(carState) => carState.carStates.isTestSWOn
	),
	createOnOffCellListSelector(
		toWide("BH非常"),
		(carState) => carState.cabState?.isBHEBOn
	),
	createOnOffCellListSelector(
		"車掌非常",
		(carState) => carState.cabState?.isConductorEBOn
	),
	createOnOffCellListSelector(
		toWide("耐雪B"),
		(carState) => carState.carStates?.isSnowBrakeOn
	),
	createOnOffCellListSelector(
		toWide("直予備B"),
		(carState) => carState.cabState?.isSpareStraightBrakeOn
	)
);

const ROWS_SELECTOR_LIST = [rowsForPage1Selector, rowsForPage2Selector];
