import { memo } from "react";

import { CanvasText } from "../../../../../canvas-renderer";
import FooterPageFrame from "../../components/FooterPageFrame";
import LocationLabel from "../../components/LocationLabel";
import TrainFormationImage from "../../components/car-image/TrainFormationImage";
import {
	COLORS,
	FONT_SIZE_1X,
	FONT_SIZE_2X,
	WITH_FOOTER_CONTENT_HEIGHT,
} from "../../constants";
import { useConductorPageMode } from "../../hooks/usePageMode";

import CarStateLabel from "./components/CarStateLabel";
import CarStateStringLabel from "./components/CarStateStringLabel";
import ConductorInfoOnOffState from "./components/ConductorInfoOnOffState";
import ConductorStateGrid from "./components/ConductorStateGrid";
import { FOOTER_MENU } from "./constants";

import type {
	LabelStyle,
	CarStateLabelProps,
} from "./components/CarStateLabel";
import type { CarStateStringLabelProps } from "./components/CarStateStringLabel";
import type { GridRowDefinition } from "./components/ConductorStateGrid";

const GRID_LABEL_X = 10;
const GRID_2X_CONTENT_HEIGHT = FONT_SIZE_2X + 2;
const GRID_2X_CONTENT_Y = 4;

const ROOM_TEMP_PADDING_TOP = 2;
const ROOM_HUMIDITY_PADDING_BOTTOM = 2;

const GRID_1X_CONTENT_HEIGHT = FONT_SIZE_1X + 2;
const GRID_1X_LABEL_Y = 2;
const GRID_1X_CONTENT_Y = 3;

const ROOM_TEMP_HUMIDITY_STATE_X = 10;

const ROOM_LIGHT_LABEL_X = 4;
const ROOM_LIGHT_LABEL_Y = 331;
const ROOM_LIGHT_STATE_X = ROOM_LIGHT_LABEL_X + FONT_SIZE_2X * 3 + 8;
const ROOM_LIGHT_STATE_Y = ROOM_LIGHT_LABEL_Y - 1;

const GUIDANCE_LABEL_X = 235;
const GUIDANCE_LABEL_Y = ROOM_LIGHT_LABEL_Y;
const GUIDANCE_STATE_X = GUIDANCE_LABEL_X + FONT_SIZE_2X * 4 + 23;
const GUIDANCE_STATE_Y = GUIDANCE_LABEL_Y - 1;

const INSTRUCTION_X = 8;
const INSTRUCTION_Y = WITH_FOOTER_CONTENT_HEIGHT - FONT_SIZE_1X - 8;

export default memo(function ConductorInfo() {
	const mode = useConductorPageMode();

	return (
		<FooterPageFrame
			mode={mode}
			footerItems={FOOTER_MENU}>
			<LocationLabel locationKm={123.4} />

			<TrainFormationImage />

			<ConductorStateGrid rowDefinitionList={GRID_DEFINITION} />

			<CanvasText
				relX={ROOM_LIGHT_LABEL_X}
				relY={ROOM_LIGHT_LABEL_Y}
				text="室内灯"
				fillColor={COLORS.WHITE}
				scaleX={2}
				scaleY={2}
			/>
			<ConductorInfoOnOffState
				relX={ROOM_LIGHT_STATE_X}
				relY={ROOM_LIGHT_STATE_Y}
				isOn={false}
			/>

			<CanvasText
				relX={GUIDANCE_LABEL_X}
				relY={GUIDANCE_LABEL_Y}
				text="車内案内"
				fillColor={COLORS.WHITE}
				scaleX={2}
				scaleY={2}
			/>
			<ConductorInfoOnOffState
				relX={GUIDANCE_STATE_X}
				relY={GUIDANCE_STATE_Y}
				isOn={false}
			/>

			<CanvasText
				relX={INSTRUCTION_X}
				relY={INSTRUCTION_Y}
				text="サービス機器のスイッチ扱いは「空調制御」または「サービス」キーを押して下さい。"
				fillColor={COLORS.WHITE}
			/>
		</FooterPageFrame>
	);
});

const GRID_DEFINITION = [
	{
		renderLabel: (relX, relY) => (
			<CanvasText
				relX={relX + GRID_LABEL_X}
				relY={relY}
				text="戸　閉"
				fillColor={COLORS.WHITE}
				scaleX={2}
				scaleY={2}
			/>
		),
		renderCell: (relX, relY, carIndex) => (
			<CarStateLabel
				relX={relX}
				relY={relY + GRID_2X_CONTENT_Y}
				carIndex={carIndex}
				styleMap={DOOR_STATE_LABEL_STYLE}
				stateSelector={doorStateSelector}
			/>
		),
		rowHeight: GRID_2X_CONTENT_HEIGHT,
	},
	{
		renderLabel: (relX, relY) => (
			<CanvasText
				relX={relX + GRID_LABEL_X}
				relY={relY}
				text="放　送"
				fillColor={COLORS.WHITE}
				scaleX={2}
				scaleY={2}
			/>
		),
		renderCell: (relX, relY, carIndex) => (
			<CarStateLabel
				relX={relX}
				relY={relY + GRID_2X_CONTENT_Y}
				carIndex={carIndex}
				styleMap={ANNOUNCE_STATE_LABEL_STYLE}
				stateSelector={announceStateSelector}
			/>
		),
		rowHeight: GRID_2X_CONTENT_HEIGHT,
	},
	{
		renderLabel: (relX, relY) => (
			<CanvasText
				relX={relX + GRID_LABEL_X}
				relY={relY}
				text="空調運転モード"
				fillColor={COLORS.WHITE}
				scaleY={2}
			/>
		),
		renderCell: (relX, relY, carIndex) => (
			<CarStateLabel
				relX={relX}
				relY={relY + GRID_2X_CONTENT_Y}
				carIndex={carIndex}
				styleMap={AIR_CONDITIONER_STATE_LABEL_STYLE}
				stateSelector={airConditionerStateSelector}
			/>
		),
		rowHeight: GRID_2X_CONTENT_HEIGHT,
	},
	{
		renderLabel: (relX, relY) => (
			<CanvasText
				relX={relX + GRID_LABEL_X}
				relY={relY}
				text="横流ファンモード"
				fillColor={COLORS.WHITE}
				scaleY={2}
			/>
		),
		renderCell: (relX, relY, carIndex) => (
			<CarStateLabel
				relX={relX}
				relY={relY + GRID_2X_CONTENT_Y}
				carIndex={carIndex}
				styleMap={FAN_STATE_LABEL_STYLE}
				stateSelector={fanStateSelector}
			/>
		),
		rowHeight: GRID_2X_CONTENT_HEIGHT + ROOM_TEMP_PADDING_TOP,
	},
	{
		renderLabel: (relX, relY) => (
			<CanvasText
				relX={relX + GRID_LABEL_X}
				relY={relY + GRID_1X_LABEL_Y}
				text="室温(℃)"
				fillColor={COLORS.YELLOW}
				scaleX={2}
			/>
		),
		renderCell: (relX, relY, carIndex) => (
			<CarStateStringLabel
				relX={relX + ROOM_TEMP_HUMIDITY_STATE_X}
				relY={relY + GRID_1X_CONTENT_Y}
				carIndex={carIndex}
				textColor={COLORS.YELLOW}
				textSelector={roomTemperatureTextSelector}
			/>
		),
		rowHeight: GRID_1X_CONTENT_HEIGHT,
	},
	{
		renderLabel: (relX, relY) => (
			<CanvasText
				relX={relX + GRID_LABEL_X}
				relY={relY + GRID_1X_LABEL_Y}
				text="湿度(％)"
				fillColor={COLORS.AQUA}
				scaleX={2}
			/>
		),
		renderCell: (relX, relY, carIndex) => (
			<CarStateStringLabel
				relX={relX + ROOM_TEMP_HUMIDITY_STATE_X}
				relY={relY + GRID_1X_CONTENT_Y}
				carIndex={carIndex}
				textColor={COLORS.AQUA}
				textSelector={roomHumidityTextSelector}
			/>
		),
		rowHeight: GRID_1X_CONTENT_HEIGHT + ROOM_HUMIDITY_PADDING_BOTTOM,
	},
] as const satisfies GridRowDefinition[];

type DoorState = "OPEN" | "CLOSED" | "UNKNOWN";
const DOOR_STATE_LABEL_STYLE = {
	OPEN: {
		text: "開",
		fillColor: COLORS.RED,
		textColor: COLORS.WHITE,
	},
	CLOSED: {
		text: "閉",
		fillColor: COLORS.BLACK,
		textColor: COLORS.WHITE,
	},
	UNKNOWN: {
		text: "-",
		fillColor: COLORS.BLACK,
		textColor: COLORS.WHITE,
	},
} as const satisfies Record<DoorState, LabelStyle>;
const doorStateSelector: CarStateLabelProps<DoorState>["stateSelector"] = () =>
	"CLOSED";

type AnnounceState = "ON" | "OFF" | "UNKNOWN";
const ANNOUNCE_STATE_LABEL_STYLE = {
	ON: {
		text: "入",
		fillColor: COLORS.WHITE,
		textColor: COLORS.BLACK,
	},
	OFF: {
		text: "切",
		fillColor: COLORS.BLACK,
		textColor: COLORS.WHITE,
	},
	UNKNOWN: {
		text: "-",
		fillColor: COLORS.BLACK,
		textColor: COLORS.WHITE,
	},
} as const satisfies Record<AnnounceState, LabelStyle>;
const announceStateSelector: CarStateLabelProps<AnnounceState>["stateSelector"] =
	() => "ON";

type AirConditionerState = "AUTO_HEATING" | "AUTO_COOLING" | "OFF" | "UNKNOWN";
const AIR_CONDITIONER_STATE_LABEL_STYLE = {
	AUTO_HEATING: {
		text: "自暖",
		fillColor: COLORS.MAGENTA,
		textColor: COLORS.WHITE,
	},
	AUTO_COOLING: {
		text: "自冷",
		fillColor: COLORS.AQUA,
		textColor: COLORS.BLACK,
	},
	OFF: {
		text: "切",
		fillColor: COLORS.BLACK,
		textColor: COLORS.WHITE,
	},
	UNKNOWN: {
		text: "-",
		fillColor: COLORS.BLACK,
		textColor: COLORS.WHITE,
	},
} as const satisfies Record<AirConditionerState, LabelStyle>;
const airConditionerStateSelector: CarStateLabelProps<AirConditionerState>["stateSelector"] =
	() => "AUTO_HEATING";

type FanState =
	| "AUTO_HIGH"
	| "AUTO_LOW"
	| "AUTO_OFF"
	| "MANUAL_HIGH"
	| "MANUAL_LOW"
	| "MANUAL_OFF"
	| "UNKNOWN";
const FAN_STATE_LABEL_STYLE = {
	AUTO_HIGH: {
		text: "自強",
		fillColor: COLORS.BLUE,
		textColor: COLORS.WHITE,
	},
	AUTO_LOW: {
		text: "自弱",
		fillColor: COLORS.LIME,
		textColor: COLORS.BLACK,
	},
	AUTO_OFF: {
		text: "自切",
		fillColor: COLORS.BLACK,
		textColor: COLORS.WHITE,
	},
	MANUAL_HIGH: {
		text: "手強",
		fillColor: COLORS.BLUE,
		textColor: COLORS.WHITE,
	},
	MANUAL_LOW: {
		text: "手弱",
		fillColor: COLORS.LIME,
		textColor: COLORS.BLACK,
	},
	MANUAL_OFF: {
		text: "手切",
		fillColor: COLORS.BLACK,
		textColor: COLORS.WHITE,
	},
	UNKNOWN: {
		text: "-",
		fillColor: COLORS.BLACK,
		textColor: COLORS.WHITE,
	},
} as const satisfies Record<FanState, LabelStyle>;
const fanStateSelector: CarStateLabelProps<FanState>["stateSelector"] = () =>
	"AUTO_OFF";

const roomTemperatureTextSelector: CarStateStringLabelProps["textSelector"] =
	() => "20.5";
const roomHumidityTextSelector: CarStateStringLabelProps["textSelector"] = () =>
	"37";
