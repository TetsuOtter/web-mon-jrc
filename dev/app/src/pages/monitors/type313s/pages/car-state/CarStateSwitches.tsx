import { memo, useMemo } from "react";

import { toWide } from "../../../../../utils/toWide";
import FooterPageFrame from "../../components/FooterPageFrame";
import LocationLabel from "../../components/LocationLabel";
import Table from "../../components/Table";
import TrainFormationImage, {
	SAMPLE_TRAIN_FORMATION,
} from "../../components/car-image/TrainFormationImage";
import { WIDTH as CAR_IMAGE_WIDTH } from "../../components/car-image/constants";
import { COLORS, FONT_SIZE_1X } from "../../constants";
import { useFooterAreaWithPagerProps } from "../../footer/FooterAreaWithPagerPropsHook";
import { useCarStatePageMode } from "../../hooks/usePageMode";

import { FOOTER_MENU } from "./constants";

import type { CellListForRow, RowList } from "../../components/Table";

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
	const tableDefinition = useTableDefinition(SAMPLE_TRAIN_FORMATION.length);
	const tableRowList = useTableCells(
		SAMPLE_TRAIN_FORMATION.length,
		pagerProps.currentPageIndex
	);

	return (
		<FooterPageFrame
			mode={mode}
			footerItems={FOOTER_MENU}
			pagerProps={pagerProps}>
			<LocationLabel locationKm={123.4} />

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

function useTableCells(carCount: number, page: number) {
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
			for (let carIndex = 0; carIndex < carCount; carIndex++) {
				// TODO: スイッチの状態に応じて表示切り替え
				// cellList.push({
				// 	text: "ON",
				// 	textColor: COLORS.WHITE,
				// 	horizontalAlign: "center",
				// });
			}
			rowList.push(cellList);
		}
		return rowList;
	}, [carCount, labelList]);
}
