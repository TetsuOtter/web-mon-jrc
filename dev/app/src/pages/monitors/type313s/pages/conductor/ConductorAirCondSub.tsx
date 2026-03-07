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
	GRID_2X_CONTENT_HEIGHT,
	GRID_LABEL_X,
	HUMIDITY_GRID_ROW_DEFINITION,
	TEMPERATURE_GRID_ROW_DEFINITION,
	UNKNOWN_STATE_LABEL_STYLE,
} from "./ConductorGridRowDefinitions";
import CarStateLabel from "./components/CarStateLabel";
import CarStateStringLabel from "./components/CarStateStringLabel";
import ConductorStateGrid from "./components/ConductorStateGrid";
import { FOOTER_MENU_AC_RIGHT, FOOTER_MENU_AC_LEFT } from "./constants";

import type { LabelStyle } from "./components/CarStateLabel";
import type { GridRowDefinition } from "./components/ConductorStateGrid";
import type { AirConditionerAdjustmentMode } from "../../../../../store/monitors/type313s/type313sTypes";

const CONFIRM_BUTTON_X = 602;
const CONFIRM_BUTTON_Y = 362;
const CONFIRM_BUTTON_WIDTH = 104;

const GUIDE_LABEL_X = 10;
const GUIDE_LABEL_Y_1 = 480;
const GUIDE_LABEL_Y = GUIDE_LABEL_Y_1 + FONT_SIZE_1X * 1.5;

const SETTING_STATE_LABEL_X = 10;
const SETTING_STATE_STR_X = 8;

const CAR_SELECT_LABEL_X = 10;
const CAR_SELECT_LABEL_Y = 320;
const SUB_SETTING_SELECT_LABEL_X = CAR_SELECT_LABEL_X;
const SUB_SETTING_SELECT_LABEL_Y = 360;
const SUB_SETTING_BUTTON_X = 194;
const SUB_SETTING_BUTTON_Y = 362;
const SUB_SETTING_BUTTON_WIDTH = 104;
const SUB_SETTING_BUTTON_SPACING_X = 28;

export default memo(function ConductorAirConSub() {
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
				relX={SUB_SETTING_SELECT_LABEL_X}
				relY={SUB_SETTING_SELECT_LABEL_Y}
				text="副設定選択"
				fillColor={COLORS.WHITE}
				scaleY={2}
			/>
			{MODE_SELECT_BUTTON_STYLE_LIST.map((style, index) => (
				<RoundedButton
					key={style.text}
					relX={
						SUB_SETTING_BUTTON_X +
						index * (SUB_SETTING_BUTTON_WIDTH + SUB_SETTING_BUTTON_SPACING_X)
					}
					relY={SUB_SETTING_BUTTON_Y}
					width={SUB_SETTING_BUTTON_WIDTH}
					fillColor={COLORS_TO_RGB_MAP[style.fillColor]}
				>
					<CanvasText
						relX={0}
						relY={0}
						text={style.text}
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
				relY={GUIDE_LABEL_Y}
				text="車両選択キーを押してから副設定選択キーを押し、最後に「確認」キーを押して下さい。"
				fillColor={COLORS.WHITE}
			/>
		</FooterPageFrame>
	);
});

type AirConditionerAdjustmentModeState =
	| AirConditionerAdjustmentMode
	| "UNKNOWN";
const SUB_SETTING_STATE_LABEL_STYLE = {
	HIGH: {
		text: "高め",
		fillColor: COLORS.BLACK,
		textColor: COLORS.MAGENTA,
		scaleY: 1.5,
	},
	NORMAL: {
		text: "標準",
		fillColor: COLORS.BLACK,
		textColor: COLORS.AQUA,
		scaleY: 1.5,
	},
	LOW: {
		text: "低め",
		fillColor: COLORS.BLACK,
		textColor: COLORS.AQUA,
		scaleY: 1.5,
	},
	UNKNOWN: { ...UNKNOWN_STATE_LABEL_STYLE, scaleY: 1.5 },
} as const satisfies Record<AirConditionerAdjustmentModeState, LabelStyle>;
const SUB_SETTING_MODE_LABEL_STYLE = {
	HIGH: {
		text: "高めシフト",
		fillColor: COLORS.BLACK,
		textColor: COLORS.MAGENTA,
	},
	NORMAL: {
		text: "標　準",
		fillColor: COLORS.AQUA,
		textColor: COLORS.WHITE,
	},
	LOW: {
		text: "低めシフト",
		fillColor: COLORS.BLACK,
		textColor: COLORS.AQUA,
	},
} as const satisfies Record<AirConditionerAdjustmentMode, LabelStyle>;

const GRID_DEFINITION = [
	TEMPERATURE_GRID_ROW_DEFINITION,
	HUMIDITY_GRID_ROW_DEFINITION,
	{
		renderLabel: (relX, relY) => (
			<CanvasText
				relX={relX + SETTING_STATE_LABEL_X}
				relY={relY}
				text="冷房設定（℃）"
				fillColor={COLORS.YELLOW}
				scaleY={2}
			/>
		),
		renderCell: (relX, relY, carIndex) => (
			<CarStateStringLabel
				relX={relX + SETTING_STATE_STR_X}
				relY={relY}
				carIndex={carIndex}
				textColor={COLORS.YELLOW}
				textSelector={coolingTargetTemperatureTextSelector}
				scaleY={2}
			/>
		),
		rowHeight: GRID_2X_CONTENT_HEIGHT + 14,
		marginTop: 12,
	},
	{
		renderLabel: (relX, relY) => (
			<CanvasText
				relX={relX + SETTING_STATE_LABEL_X}
				relY={relY}
				text="暖房設定（℃）"
				fillColor={COLORS.RED}
				scaleY={2}
			/>
		),
		renderCell: (relX, relY, carIndex) => (
			<CarStateStringLabel
				relX={relX + SETTING_STATE_STR_X}
				relY={relY}
				carIndex={carIndex}
				textColor={COLORS.RED}
				textSelector={heatingTargetTemperatureTextSelector}
				scaleY={2}
			/>
		),
		rowHeight: GRID_2X_CONTENT_HEIGHT + 8,
	},
	{
		renderLabel: (relX, relY) => (
			<CanvasText
				relX={relX + GRID_LABEL_X}
				relY={relY}
				text="副設定"
				fillColor={COLORS.WHITE}
				scaleY={2}
			/>
		),
		renderCell: (relX, relY, carIndex) => (
			<CarStateLabel
				relX={relX}
				relY={relY}
				carIndex={carIndex}
				styleMap={SUB_SETTING_STATE_LABEL_STYLE}
				stateSelector={airConditionerAdjustmentModeSelector}
			/>
		),
		rowHeight: GRID_2X_CONTENT_HEIGHT,
	},
] as const satisfies GridRowDefinition[];

const airConditionerAdjustmentModeSelector = createCarStateByCarIndexSelector<
	AirConditionerAdjustmentMode | "UNKNOWN"
>((carState) => carState.airConditionerAdjustmentMode ?? "UNKNOWN");

const coolingTargetTemperatureTextSelector = createCarStateByCarIndexSelector<
	string | undefined
>((carState) =>
	carState.coolingTargetTemperature != null
		? carState.coolingTargetTemperature.toFixed(1)
		: undefined,
);
const heatingTargetTemperatureTextSelector = createCarStateByCarIndexSelector<
	string | undefined
>((carState) =>
	carState.heatingTargetTemperature != null
		? carState.heatingTargetTemperature.toFixed(1)
		: undefined,
);

const MODE_SELECT_BUTTON_STYLE_LIST = [
	SUB_SETTING_MODE_LABEL_STYLE.HIGH,
	SUB_SETTING_MODE_LABEL_STYLE.NORMAL,
	SUB_SETTING_MODE_LABEL_STYLE.LOW,
] as const satisfies LabelStyle[];
