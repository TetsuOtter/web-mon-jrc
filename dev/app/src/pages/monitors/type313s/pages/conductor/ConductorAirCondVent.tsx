import { memo } from "react";

import { CanvasText } from "@web-mon-jrc/canvas-renderer";

import { createCarStateByCarIndexSelector } from "../../../../../store/monitors/type313s/type313sSelector";
import FooterPageFrame from "../../components/FooterPageFrame";
import LocationLabel from "../../components/LocationLabel";
import RoundedButton from "../../components/RoundedButton";
import TrainFormationImage, {
	LEFT as TRAIN_FORMATION_LEFT,
} from "../../components/car-image/TrainFormationImage";
import { COLORS, FONT_SIZE_1X, RGB_COLORS } from "../../constants";
import { useConductorPageMode } from "../../hooks/usePageMode";

import {
	GRID_2X_CONTENT_Y,
	GRID_LABEL_X,
	HUMIDITY_GRID_ROW_DEFINITION,
	TEMPERATURE_GRID_ROW_DEFINITION,
} from "./ConductorGridRowDefinitions";
import CarStateLabel from "./components/CarStateLabel";
import ConductorRoundedButton from "./components/ConductorRoundedButton";
import ConductorStateGrid from "./components/ConductorStateGrid";
import { FOOTER_MENU_AC_RIGHT, FOOTER_MENU_AC_LEFT } from "./constants";

import type { LabelStyle } from "./components/CarStateLabel";
import type { RoundedButtonStyle } from "./components/ConductorRoundedButton";
import type { GridRowDefinition } from "./components/ConductorStateGrid";

const CAR_SELECT_LABEL_X = 10;

const CONFIRM_BUTTON_X = 680;
const CONFIRM_BUTTON_Y = 410;
const CONFIRM_BUTTON_WIDTH = 104;

const GUIDE_LABEL_X = 10;
const GUIDE_LABEL_Y_1 = 480;
const GUIDE_LABEL_Y = GUIDE_LABEL_Y_1 + FONT_SIZE_1X * 1.5;

const MODE_SELECT_LABEL_X = CAR_SELECT_LABEL_X;
const MODE_SELECT_LABEL_Y = 336;

const MODE_SELECT_BUTTON_X = 132;
const MODE_SELECT_BUTTON_Y = MODE_SELECT_LABEL_Y + 2;
const MODE_SELECT_BUTTON_WIDTH = 104;
const MODE_SELECT_BUTTON_SPACING_X = 8;

const CAR_SET_COUNT = 2;

export default memo(function ConductorAirCondVent() {
	const mode = useConductorPageMode();
	return (
		<FooterPageFrame
			mode={mode}
			footerItems={FOOTER_MENU_AC_RIGHT}
			leftFooterItems={FOOTER_MENU_AC_LEFT}
		>
			<LocationLabel />

			<TrainFormationImage />

			<ConductorStateGrid rowDefinitionList={GRID_DEFINITION} />

			<CanvasText
				relX={MODE_SELECT_LABEL_X}
				relY={MODE_SELECT_LABEL_Y}
				text="モード選択"
				fillColor={COLORS.WHITE}
				scaleY={2}
			/>
			{Array.from({ length: CAR_SET_COUNT }).map((_, index) => (
				<RoundedButton
					// eslint-disable-next-line react/no-array-index-key
					key={`mode-select-${index}`}
					relX={
						MODE_SELECT_BUTTON_X +
						index * (MODE_SELECT_BUTTON_WIDTH + MODE_SELECT_BUTTON_SPACING_X)
					}
					relY={MODE_SELECT_BUTTON_Y}
					width={MODE_SELECT_BUTTON_WIDTH}
					fillColor={RGB_COLORS.BLUE}
				>
					<CanvasText
						relX={0}
						relY={0}
						text={`${index + 1}編成入`}
						verticalAlign="center"
						align="center"
						fillColor={COLORS.WHITE}
					/>
				</RoundedButton>
			))}

			<RoundedButton
				relX={CONFIRM_BUTTON_X}
				relY={CONFIRM_BUTTON_Y}
				width={CONFIRM_BUTTON_WIDTH}
				fillColor={RGB_COLORS.AQUA}
			>
				<CanvasText
					relX={0}
					relY={0}
					text="確　認"
					verticalAlign="center"
					align="center"
					fillColor={COLORS.BLACK}
				/>
			</RoundedButton>

			<CanvasText
				relX={GUIDE_LABEL_X}
				relY={GUIDE_LABEL_Y}
				text="車両選択キーを押してからモード選択キーを押し、最後に「確認」キーを押して下さい。"
				fillColor={COLORS.WHITE}
			/>
		</FooterPageFrame>
	);
});

const GRID_DEFINITION = [
	TEMPERATURE_GRID_ROW_DEFINITION,
	HUMIDITY_GRID_ROW_DEFINITION,
	{
		renderLabel: (relX, relY) => (
			<CanvasText
				relX={relX + GRID_LABEL_X}
				relY={relY}
				text="換気設定モード"
				fillColor={COLORS.RED}
				scaleY={2}
			/>
		),
		renderCell: (relX, relY, carIndex) => (
			<CarStateLabel
				relX={relX}
				relY={relY + 8}
				carIndex={carIndex}
				styleMap={VENT_STATE_LABEL_STYLE}
				stateSelector={ventStateSelector}
			/>
		),
		rowHeight: 64,
		marginTop: 20,
	},
	{
		renderLabel: (relX, relY) => (
			<>
				<CanvasText
					relX={relX + GRID_LABEL_X}
					relY={relY}
					text="車両選択"
					fillColor={COLORS.WHITE}
					scaleY={2}
				/>
				<RoundedButton
					relX={TRAIN_FORMATION_LEFT - 80}
					relY={relY + 2}
					width={72}
					fillColor={RGB_COLORS.AQUA}
				>
					<CanvasText
						relX={0}
						relY={0}
						text="一括"
						verticalAlign="center"
						align="center"
						fillColor={COLORS.WHITE}
					/>
				</RoundedButton>
			</>
		),
		renderCell: (relX, relY, carIndex) => (
			<ConductorRoundedButton
				relX={relX}
				relY={relY + GRID_2X_CONTENT_Y}
				carIndex={carIndex}
				styleMap={VENT_STATE_ROUNDED_BUTTON_STYLE}
				stateSelector={ventStateSelector}
			/>
		),
		rowHeight: 64,
		marginTop: 24,
	},
] as const satisfies GridRowDefinition[];

type VentState = "ON" | "OFF" | "UNKNOWN";
const VENT_STATE_LABEL_STYLE = {
	ON: {
		text: "入",
		fillColor: COLORS.BLUE,
		textColor: COLORS.WHITE,
		scaleX: 2,
	},
	OFF: {
		text: "切",
		fillColor: COLORS.BLACK,
		textColor: COLORS.WHITE,
		scaleX: 2,
	},
	UNKNOWN: {
		text: "-",
		fillColor: COLORS.BLACK,
		textColor: COLORS.WHITE,
		scaleX: 2,
	},
} as const satisfies Record<VentState, LabelStyle>;
const VENT_STATE_ROUNDED_BUTTON_STYLE = {
	ON: {
		text: "入",
		fillColor: RGB_COLORS.BLUE,
		textColor: COLORS.WHITE,
	},
	OFF: {
		text: "切",
		fillColor: RGB_COLORS.BLACK,
		textColor: COLORS.WHITE,
	},
	UNKNOWN: {
		text: "-",
		fillColor: RGB_COLORS.BLACK,
		textColor: COLORS.WHITE,
	},
} as const satisfies Record<VentState, RoundedButtonStyle>;
const ventStateSelector = createCarStateByCarIndexSelector<VentState>(
	(carState) => {
		if (carState.isVentOn === true) return "ON";
		if (carState.isVentOn === false) return "OFF";
		return "UNKNOWN";
	},
);
