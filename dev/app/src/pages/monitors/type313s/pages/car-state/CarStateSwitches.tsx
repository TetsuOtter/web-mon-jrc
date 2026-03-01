import { memo, useMemo } from "react";

import { toWide } from "../../../../../utils/toWide";
import { useAppSelector } from "../../../../../store/hooks";
import { carStateListSelector } from "../../../../../store/monitors/type313s/type313sSelector";
import FooterPageFrame from "../../components/FooterPageFrame";
import LocationLabel from "../../components/LocationLabel";
import Table from "../../components/Table";
import TrainFormationImage from "../../components/car-image/TrainFormationImage";
import { WIDTH as CAR_IMAGE_WIDTH } from "../../components/car-image/constants";
import { COLORS, FONT_SIZE_1X } from "../../constants";
import { useFooterAreaWithPagerProps } from "../../footer/FooterAreaWithPagerPropsHook";
import { useCarStatePageMode } from "../../hooks/usePageMode";

import { FOOTER_MENU } from "./constants";

import type { Type313sCarState } from "../../../../../store/monitors/type313s/type313sTypes";
import type { CellInfo, CellListForRow, RowList } from "../../components/Table";

const TABLE_TOP = 186;
const TABLE_LEFT = 36;

const LABEL_COL_WIDTH = 156;
const CAR_COL_WIDTH = CAR_IMAGE_WIDTH - 1;
const ROW_HEIGHT = FONT_SIZE_1X + 1;

const LABEL_CELL_PADDING_X = { left: 7, right: 0 };
const CELL_PADDING_X_LIST = [LABEL_CELL_PADDING_X];

const TABLE_ROW_COUNT = 18;

const SWITCH_TYPES_1 = [
	"MS",
	"HB",
	"LB1",
	"LB2",
	"LB3",
	"MCOS1",
	"MCOS2",
	"MCOS3",
	"MCOS4",
	"CCOS",
].map(toWide);
const SWITCH_TYPES_2 = [
	toWide("SIV"),
	toWide("CP"),
	"元溜圧力",
	toWide("CabSes"),
	toWide("VVVF2"),
	`${toWide("CgK(")}SIV${toWide(")")}`,
	`${toWide("CgK(")}VVVF2${toWide(")")}`,
	toWide("車上試験SW"),
	toWide("BH非常"),
	"車掌非常",
	toWide("耐雪B"),
	toWide("直予備B"),
];
const SWITCH_LABEL_MAP: string[][] = [SWITCH_TYPES_1, SWITCH_TYPES_2];

export default memo(function CarStateSwitches() {
	const mode = useCarStatePageMode();
	const pagerProps = useFooterAreaWithPagerProps(SWITCH_LABEL_MAP.length - 1);
	const carStateList = useAppSelector(carStateListSelector);
	const tableDefinition = useTableDefinition(carStateList.length);
	const tableRowList = useTableCells(carStateList, pagerProps.currentPageIndex);

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

function useTableCells(carStateList: Type313sCarState[], page: number) {
	const labelList = SWITCH_LABEL_MAP[page];
	return useMemo(() => {
		if (!labelList) {
			return [];
		}
		const rowList: RowList = [];
		for (let rowIndex = 0; rowIndex < TABLE_ROW_COUNT; rowIndex++) {
			const label = labelList[rowIndex];
			if (!label) {
				rowList.push([]);
				continue;
			}
			const cellList: CellListForRow = [
				{
					text: label,
					textColor: COLORS.WHITE,
				},
			];
			for (const carState of carStateList) {
				const cell =
					page === 0
						? getSwitchPage1Cell(carState, rowIndex)
						: getSwitchPage2Cell(carState, rowIndex);
				cellList.push(cell);
			}
			rowList.push(cellList);
		}
		return rowList;
	}, [carStateList, labelList]);
}

function boolCell(value: boolean | null | undefined): CellInfo {
	if (value === true) {
		return { text: "○", textColor: COLORS.LIME, horizontalAlign: "center" };
	}
	if (value === false) {
		return { text: "×", textColor: COLORS.GRAY, horizontalAlign: "center" };
	}
	return { text: "-", textColor: COLORS.GRAY, horizontalAlign: "center" };
}

function getSwitchPage1Cell(
	carState: Type313sCarState,
	rowIndex: number
): CellInfo {
	const { carStates, bogieState } = carState;
	switch (rowIndex) {
		case 0:
			return boolCell(carStates.isMSOn);
		case 1:
			return boolCell(bogieState?.isHBOn);
		case 2:
			return boolCell(bogieState?.isLB1On);
		case 3:
			return boolCell(bogieState?.left?.isLbOn);
		case 4:
			return boolCell(bogieState?.right?.isLbOn);
		case 5:
			return boolCell(bogieState?.left?.isMCOS1On);
		case 6:
			return boolCell(bogieState?.left?.isMCOS2On);
		case 7:
			return boolCell(bogieState?.right?.isMCOS1On);
		case 8:
			return boolCell(bogieState?.right?.isMCOS2On);
		case 9:
			return boolCell(bogieState?.isCCOSNormal);
		default:
			return { text: "-", textColor: COLORS.GRAY, horizontalAlign: "center" };
	}
}

function getSwitchPage2Cell(
	carState: Type313sCarState,
	rowIndex: number
): CellInfo {
	const { carStates, bogieState, cabState } = carState;
	switch (rowIndex) {
		case 0:
			return boolCell(carStates.sivLineState?.isSIVOn);
		case 1:
			return boolCell(carStates.isCPOn);
		case 2:
			return boolCell(carStates.isMRPressureNormal);
		case 3: {
			const cabSes = cabState?.cabSesState;
			if (cabSes === "FORWARD")
				return {
					text: "前進",
					textColor: COLORS.WHITE,
					horizontalAlign: "center",
				};
			if (cabSes === "NEUTRAL")
				return {
					text: "中立",
					textColor: COLORS.YELLOW,
					horizontalAlign: "center",
				};
			if (cabSes === "REVERSE")
				return {
					text: "後退",
					textColor: COLORS.WHITE,
					horizontalAlign: "center",
				};
			return { text: "-", textColor: COLORS.GRAY, horizontalAlign: "center" };
		}
		case 4: {
			const vvvf2 = bogieState?.vvvf2State;
			if (vvvf2 === "VVVF")
				return {
					text: "VVVF",
					textColor: COLORS.WHITE,
					horizontalAlign: "center",
				};
			if (vvvf2 === "VVVF2")
				return {
					text: "VVV2",
					textColor: COLORS.AQUA,
					horizontalAlign: "center",
				};
			return { text: "-", textColor: COLORS.GRAY, horizontalAlign: "center" };
		}
		case 5:
			return boolCell(carStates.sivLineState?.isCgKForSIVOn);
		case 6:
			return boolCell(bogieState?.isCgKForVVVF2On);
		case 7:
			return boolCell(carStates.isTestSWOn);
		case 8:
			return boolCell(cabState?.isBHEBOn);
		case 9:
			return boolCell(cabState?.isConductorEBOn);
		case 10:
			return boolCell(carStates.isSnowBrakeOn);
		case 11:
			return boolCell(cabState?.isSpareStraightBrakeOn);
		default:
			return { text: "-", textColor: COLORS.GRAY, horizontalAlign: "center" };
	}
}
