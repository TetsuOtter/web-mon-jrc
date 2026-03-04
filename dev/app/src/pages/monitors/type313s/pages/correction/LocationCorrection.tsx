import { memo, useCallback, useState } from "react";

import { CanvasRect, CanvasText } from "@web-mon-jrc/canvas-renderer";
import Button, { SHADOW_WIDTH } from "../../components/Button";
import FooterPageFrame from "../../components/FooterPageFrame";
import LocationLabel from "../../components/LocationLabel";
import TrainFormationImage from "../../components/car-image/TrainFormationImage";
import { COLORS } from "../../constants";
import { useFooterAreaWithPagerProps } from "../../footer/FooterAreaWithPagerPropsHook";
import { useCorrectionPageMode } from "../../hooks/usePageMode";
import { DOOR_STATE_GRID_ROW_DEFINITION } from "../conductor/ConductorGridRowDefinitions";
import ConductorStateGrid from "../conductor/components/ConductorStateGrid";
import { PAGE_TYPES } from "../pageTypes";

import LocationCorrectionLineImage, {
	CELL_COUNT as LINE_IMAGE_CELL_COUNT,
} from "./components/LocationCorrectionLineImage";

import type { FooterButtonInfo } from "../../footer/FooterArea";
import type { GridRowDefinition } from "../conductor/components/ConductorStateGrid";

const CELL_PER_PAGE = LINE_IMAGE_CELL_COUNT * 2;

const CONFIRM_RECT_X = 200;
const CONFIRM_RECT_Y = 416;
const CONFIRM_RECT_WIDTH = 432;
const CONFIRM_RECT_HEIGHT = 64;

const LABEL_X = 16;

const CONFIRM_BUTTON_X = 320;
const CONFIRM_BUTTON_Y = 16;
const CONFIRM_BUTTON_WIDTH = 96;
const CONFIRM_BUTTON_HEIGHT = 32;

export default memo(function DriverLocationCorrection() {
	const mode = useCorrectionPageMode();
	const [carImageStationIndex, setCarImageStationIndex] = useState<number>(0);
	const pagerProps = useFooterAreaWithPagerProps(
		Math.floor(STA_NAME_LIST.length / CELL_PER_PAGE)
	);
	const onClickConfirm = useCallback(() => {
		console.log("確認", {
			carImageStationIndex,
		});
	}, [carImageStationIndex]);
	return (
		<FooterPageFrame
			mode={mode}
			footerItems={FOOTER_MENU}
			pagerProps={pagerProps}>
			<LocationLabel />
			<TrainFormationImage />
			<ConductorStateGrid rowDefinitionList={GRID_DEFINITION} />

			<LocationCorrectionLineImage
				row={0}
				carImageStationIndex={carImageStationIndex}
				onClick={setCarImageStationIndex}
				stationNameStartIndex={pagerProps.currentPageIndex * CELL_PER_PAGE}
				stationNameList={STA_NAME_LIST}
			/>
			<LocationCorrectionLineImage
				row={1}
				carImageStationIndex={carImageStationIndex}
				onClick={setCarImageStationIndex}
				stationNameStartIndex={
					pagerProps.currentPageIndex * CELL_PER_PAGE + LINE_IMAGE_CELL_COUNT
				}
				stationNameList={STA_NAME_LIST}
			/>

			<CanvasRect
				relX={CONFIRM_RECT_X}
				relY={CONFIRM_RECT_Y}
				width={CONFIRM_RECT_WIDTH}
				height={CONFIRM_RECT_HEIGHT}
				strokeColor={COLORS.WHITE}
				strokeWidth={1}>
				<CanvasText
					text={
						"駅名にタッチして下さい。\nよろしければ「確認」を押して下さい。"
					}
					fillColor={COLORS.WHITE}
					relX={LABEL_X}
					relY={0}
					verticalAlign="center"
				/>
				<Button
					relX={CONFIRM_BUTTON_X}
					relY={CONFIRM_BUTTON_Y}
					width={CONFIRM_BUTTON_WIDTH}
					height={CONFIRM_BUTTON_HEIGHT}
					onClick={onClickConfirm}
					shadowWidth={SHADOW_WIDTH.SMALL}>
					<CanvasText
						text="確　認"
						fillColor={COLORS.WHITE}
						relX={0}
						relY={0}
						align="center"
						verticalAlign="center"
					/>
				</Button>
			</CanvasRect>
		</FooterPageFrame>
	);
});

const FOOTER_MENU = [
	{
		label: "地点補正",
		navigateTo: PAGE_TYPES.LOCATION_CORRECTION,
	},
	{
		label: "戻る",
		useBackNavigation: true,
	},
] as const satisfies FooterButtonInfo[];

const GRID_DEFINITION = [
	DOOR_STATE_GRID_ROW_DEFINITION,
] as const satisfies GridRowDefinition[];

const STA_NAME_LIST = [
	"東京",
	"神田",
	"秋葉原",
	"御徒町",
	"上野",
	"鶯谷",
	"日暮里",
	"西日暮里",
	"田端",
	"駒込",
	"巣鴨",
	"大塚",
	"池袋",
	"目白",
	"高田馬場",
	"新大久保",
	"新宿",
	"代々木",
	"原宿",
	"渋谷",
	"恵比寿",
	"目黒",
	"五反田",
	"大崎",
	"品川",
	"高輪ゲートウェイ",
	"田町",
	"浜松町",
	"新橋",
	"有楽町",
];
