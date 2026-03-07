import { memo } from "react";

import { CanvasText } from "@web-mon-jrc/canvas-renderer";

import { createCarStateByCarIndexSelector } from "../../../../../store/monitors/type313s/type313sSelector";
import FooterPageFrame from "../../components/FooterPageFrame";
import LocationLabel from "../../components/LocationLabel";
import RoundedButton from "../../components/RoundedButton";
import TrainFormationImage, {
	LEFT as TRAIN_FORMATION_LEFT,
} from "../../components/car-image/TrainFormationImage";
import {
	COLORS,
	COLORS_TO_RGB_MAP,
	FONT_SIZE_1X,
	RGB_COLORS,
} from "../../constants";
import { useConductorPageMode } from "../../hooks/usePageMode";

import {
	AIR_CONDITIONER_STATE_LABEL_STYLE,
	GRID_LABEL_X,
	HUMIDITY_GRID_ROW_DEFINITION,
	TEMPERATURE_GRID_ROW_DEFINITION,
	UNKNOWN_STATE_LABEL_STYLE,
} from "./ConductorGridRowDefinitions";
import CarStateLabel, { RECT_HEIGHT } from "./components/CarStateLabel";
import ConductorStateGrid from "./components/ConductorStateGrid";
import { FOOTER_MENU_AC_RIGHT, FOOTER_MENU_AC_LEFT } from "./constants";

import type { LabelStyleWithFullText } from "./ConductorGridRowDefinitions";
import type { LabelStyle } from "./components/CarStateLabel";
import type { GridRowDefinition } from "./components/ConductorStateGrid";
import type {
	AirConditionerCtrlUnit,
	AirConditionerRunMode,
} from "../../../../../store/monitors/type313s/type313sTypes";

const AC_SETTING_MODE_SPACING_Y = 3;

const CAR_SELECT_LABEL_X = 10;
const CAR_SELECT_LABEL_Y = 264;

const MODE_SELECT_LABEL_X = CAR_SELECT_LABEL_X;
const MODE_SELECT_LABEL_Y = 320;

const MODE_SELECT_BUTTON_X = TRAIN_FORMATION_LEFT;
const MODE_SELECT_BUTTON_Y = MODE_SELECT_LABEL_Y + 2;
const MODE_SELECT_BUTTON_WIDTH = 72;
const MODE_SELECT_BUTTON_SPACING_X = 16;

const CONFIRM_BUTTON_X = 680;
const CONFIRM_BUTTON_Y = 378;
const CONFIRM_BUTTON_WIDTH = 104;

const GUIDE_LABEL_X = 10;
const GUIDE_LABEL_Y_1 = 480;
const GUIDE_LABEL_Y_2 = GUIDE_LABEL_Y_1 + FONT_SIZE_1X * 1.5;

export default memo(function ConductorAirCondMode() {
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
				relX={CAR_SELECT_LABEL_X}
				relY={CAR_SELECT_LABEL_Y}
				text="車両選択"
				fillColor={COLORS.WHITE}
				scaleY={2}
			/>
			<RoundedButton
				relX={TRAIN_FORMATION_LEFT - 80}
				relY={CAR_SELECT_LABEL_Y + 2}
				width={72}
				fillColor={RGB_COLORS.AQUA}
			>
				<CanvasText
					relX={0}
					relY={0}
					text="一括"
					verticalAlign="center"
					align="center"
					fillColor={COLORS.BLACK}
				/>
			</RoundedButton>

			<CanvasText
				relX={MODE_SELECT_LABEL_X}
				relY={MODE_SELECT_LABEL_Y}
				text="モード選択"
				fillColor={COLORS.WHITE}
				scaleY={2}
			/>

			{MODE_SELECT_BUTTON_STYLE_LIST.map((style, index) => (
				<RoundedButton
					key={style.text}
					relX={
						MODE_SELECT_BUTTON_X +
						index * (MODE_SELECT_BUTTON_WIDTH + MODE_SELECT_BUTTON_SPACING_X)
					}
					relY={MODE_SELECT_BUTTON_Y}
					width={MODE_SELECT_BUTTON_WIDTH}
					fillColor={COLORS_TO_RGB_MAP[style.fillColor]}
				>
					<CanvasText
						relX={0}
						relY={0}
						text={style.fullText}
						verticalAlign="center"
						align="center"
						fillColor={style.textColor}
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
				relY={GUIDE_LABEL_Y_1}
				text="手元運転時は設定できません。"
				fillColor={COLORS.WHITE}
			/>
			<CanvasText
				relX={GUIDE_LABEL_X}
				relY={GUIDE_LABEL_Y_2}
				text="車両選択キーを押してからモード選択キーを押し、最後に「確認」キーを押して下さい。"
				fillColor={COLORS.WHITE}
			/>
		</FooterPageFrame>
	);
});

const AC_SETTING_MODE_ROW_HEIGHT = RECT_HEIGHT * 2 + AC_SETTING_MODE_SPACING_Y;
const GRID_DEFINITION = [
	TEMPERATURE_GRID_ROW_DEFINITION,
	HUMIDITY_GRID_ROW_DEFINITION,
	{
		renderLabel: (relX, relY) => (
			<CanvasText
				relX={relX + GRID_LABEL_X}
				relY={relY}
				maxHeightPx={AC_SETTING_MODE_ROW_HEIGHT}
				verticalAlign="center"
				text="空調設定モード"
				fillColor={COLORS.WHITE}
				scaleY={2}
			/>
		),
		renderCell: (relX, relY, carIndex) => (
			<>
				<CarStateLabel
					relX={relX}
					relY={relY}
					carIndex={carIndex}
					styleMap={AIR_CONDITIONER_CTRL_UNIT_STYLE}
					stateSelector={airConditionerCtrlUnitSelector}
				/>
				<CarStateLabel
					relX={relX}
					relY={relY + RECT_HEIGHT + AC_SETTING_MODE_SPACING_Y}
					carIndex={carIndex}
					styleMap={AIR_CONDITIONER_MODE_LABEL_STYLE}
					stateSelector={airConditionerRunModeSelector}
				/>
			</>
		),
		rowHeight: AC_SETTING_MODE_ROW_HEIGHT,
		marginTop: 18,
	},
] as const satisfies GridRowDefinition[];

const AIR_CONDITIONER_CTRL_UNIT_STYLE = {
	CENTRAL: {
		text: "総括",
		fillColor: COLORS.LIME,
		textColor: COLORS.BLACK,
	},
	UNKNOWN: UNKNOWN_STATE_LABEL_STYLE,
} as const satisfies Record<AirConditionerCtrlUnit | "UNKNOWN", LabelStyle>;
const airConditionerCtrlUnitSelector = createCarStateByCarIndexSelector<
	AirConditionerCtrlUnit | "UNKNOWN"
>((carState) => carState.airConditionerCtrlUnit ?? "UNKNOWN");
const AIR_CONDITIONER_MODE_LABEL_STYLE = {
	FULL_AUTO: {
		text: "全自",
		fullText: "全自動",
		fillColor: COLORS.YELLOW,
		textColor: COLORS.BLACK,
	},
	...AIR_CONDITIONER_STATE_LABEL_STYLE,
} as const satisfies Record<
	AirConditionerRunMode | "UNKNOWN",
	LabelStyleWithFullText
>;
const airConditionerRunModeSelector = createCarStateByCarIndexSelector<
	AirConditionerRunMode | "UNKNOWN"
>((carState) => carState.airConditionerRunMode ?? "UNKNOWN");

const MODE_SELECT_BUTTON_STYLE_LIST = [
	AIR_CONDITIONER_MODE_LABEL_STYLE.FULL_AUTO,
	AIR_CONDITIONER_MODE_LABEL_STYLE.AUTO_COOLING,
	AIR_CONDITIONER_MODE_LABEL_STYLE.AUTO_HEATING,
	AIR_CONDITIONER_MODE_LABEL_STYLE.OFF,
] as const satisfies LabelStyleWithFullText[];
