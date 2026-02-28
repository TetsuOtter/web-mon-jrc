// TODO: 乗車率ページの実装が必要
import { memo } from "react";

import { CanvasText } from "../../../../../canvas-renderer";
import FooterPageFrame from "../../components/FooterPageFrame";
import LocationLabel from "../../components/LocationLabel";
import TrainFormationImage from "../../components/car-image/TrainFormationImage";
import { WIDTH as CAR_IMG_WIDTH } from "../../components/car-image/constants";
import { COLORS, FONT_SIZE_1X, FONT_SIZE_2X } from "../../constants";
import CarStateStringLabel from "../conductor/components/CarStateStringLabel";
import ConductorStateGrid from "../conductor/components/ConductorStateGrid";
import { PAGE_MODES, PAGE_TYPES } from "../pageTypes";

import type { FooterButtonInfo } from "../../footer/FooterArea";
import type { CarStateStringLabelProps } from "../conductor/components/CarStateStringLabel";
import type { GridRowDefinition } from "../conductor/components/ConductorStateGrid";

const GRID_LABEL_X = 12;
const GRID_1X_CONTENT_HEIGHT = FONT_SIZE_1X + 8;
const GRID_1X_CONTENT_Y = 1;
const GRID_1X_CONTENT_X = 0;
const GRID_1X_CONTENT_WIDTH = CAR_IMG_WIDTH - 14;

const AVG_RATE_Y = 248;
const AVG_RATE_DISPLAY_X = 204;
const AVG_RATE_DISPLAY_Y = AVG_RATE_Y + 2;
const AVG_RATE_DISPLAY_WIDTH = FONT_SIZE_1X * 1.5;
const PASSENGER_COUNT_SUM_Y = 288;
const PASSENGER_COUNT_SUM_DISPLAY_Y = PASSENGER_COUNT_SUM_Y + 2;

export default memo(function OccupancyRate() {
	return (
		<FooterPageFrame
			mode={PAGE_MODES.OCCUPANCY_RATE}
			footerItems={FOOTER_MENU}>
			<LocationLabel />

			<TrainFormationImage />

			<ConductorStateGrid
				offsetY={36}
				rowDefinitionList={GRID_DEFINITION}
			/>

			<CanvasText
				relX={GRID_LABEL_X}
				relY={AVG_RATE_Y}
				text="平均乗車率（％）"
				fillColor={COLORS.WHITE}
				scaleY={2}
			/>
			<CanvasText
				relX={AVG_RATE_DISPLAY_X}
				relY={AVG_RATE_DISPLAY_Y}
				maxWidthPx={AVG_RATE_DISPLAY_WIDTH}
				align="right"
				text="68"
				fillColor={COLORS.WHITE}
				scaleY={2}
			/>
			<CanvasText
				relX={GRID_LABEL_X}
				relY={PASSENGER_COUNT_SUM_Y}
				text="合計人数　（人）"
				fillColor={COLORS.WHITE}
				scaleY={2}
			/>
			<CanvasText
				relX={AVG_RATE_DISPLAY_X}
				relY={PASSENGER_COUNT_SUM_DISPLAY_Y}
				maxWidthPx={AVG_RATE_DISPLAY_WIDTH}
				align="right"
				text="304"
				fillColor={COLORS.WHITE}
				scaleY={2}
			/>
		</FooterPageFrame>
	);
});

const FOOTER_MENU = [
	{
		label: "乗車率",
		navigateTo: PAGE_TYPES.OCCUPANCY_RATE,
	},
	{
		label: "メニュー",
		navigateTo: PAGE_TYPES.MENU,
		queryParams: {
			mode: PAGE_MODES.MENU,
		},
	},
] as const satisfies FooterButtonInfo[];

const GRID_DEFINITION = [
	{
		renderLabel: (relX, relY) => (
			<>
				<CanvasText
					relX={relX + GRID_LABEL_X}
					relY={relY}
					text="乗車率"
					fillColor={COLORS.YELLOW}
					scaleX={2}
				/>
				<CanvasText
					relX={relX + GRID_LABEL_X + FONT_SIZE_2X * 4}
					relY={relY}
					text="（％）"
					fillColor={COLORS.YELLOW}
				/>
			</>
		),
		renderCell: (relX, relY, carIndex) => (
			<CarStateStringLabel
				relX={relX + GRID_1X_CONTENT_X}
				relY={relY + GRID_1X_CONTENT_Y}
				fillWidth={GRID_1X_CONTENT_WIDTH}
				align="right"
				carIndex={carIndex}
				textColor={COLORS.YELLOW}
				textSelector={occupancyRateTextSelector}
			/>
		),
		rowHeight: GRID_1X_CONTENT_HEIGHT,
	},
	{
		renderLabel: (relX, relY) => (
			<>
				<CanvasText
					relX={relX + GRID_LABEL_X}
					relY={relY}
					text="乗車人数"
					fillColor={COLORS.YELLOW}
					scaleX={2}
				/>
				<CanvasText
					relX={relX + GRID_LABEL_X + FONT_SIZE_2X * 4}
					relY={relY}
					text="（人）"
					fillColor={COLORS.YELLOW}
				/>
			</>
		),
		renderCell: (relX, relY, carIndex) => (
			<CarStateStringLabel
				relX={relX + GRID_1X_CONTENT_X}
				relY={relY + GRID_1X_CONTENT_Y}
				fillWidth={GRID_1X_CONTENT_WIDTH}
				align="right"
				carIndex={carIndex}
				textColor={COLORS.YELLOW}
				textSelector={occupancyNumberTextSelector}
			/>
		),
		rowHeight: GRID_1X_CONTENT_HEIGHT,
	},
] as const satisfies GridRowDefinition[];

const occupancyRateTextSelector: CarStateStringLabelProps["textSelector"] =
	() => "82";
const occupancyNumberTextSelector: CarStateStringLabelProps["textSelector"] =
	() => "114";
