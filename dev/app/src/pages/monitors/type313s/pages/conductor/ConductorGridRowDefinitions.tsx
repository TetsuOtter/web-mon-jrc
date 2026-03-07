import { CanvasText } from "@web-mon-jrc/canvas-renderer";

import { createCarStateByCarIndexSelector } from "../../../../../store/monitors/type313s/type313sSelector";
import { COLORS, FONT_SIZE_1X, FONT_SIZE_2X } from "../../constants";

import CarStateLabel from "./components/CarStateLabel";
import CarStateStringLabel from "./components/CarStateStringLabel";

import type { LabelStyle } from "./components/CarStateLabel";
import type { GridRowDefinition } from "./components/ConductorStateGrid";
import type { AirConditionerState } from "../../../../../store/monitors/type313s/type313sTypes";

export const GRID_LABEL_X = 10;
export const GRID_2X_CONTENT_HEIGHT = FONT_SIZE_2X + 2;
export const GRID_2X_CONTENT_Y = 4;

const GRID_1X_CONTENT_HEIGHT = FONT_SIZE_1X + 2;
const GRID_1X_LABEL_Y = 2;
const GRID_1X_CONTENT_Y = 3;
const ROOM_TEMP_HUMIDITY_STATE_X = 10;
const ROOM_TEMP_PADDING_TOP = 2;
const ROOM_HUMIDITY_PADDING_BOTTOM = 2;

export const UNKNOWN_STATE_LABEL_STYLE = {
	text: "-",
	fillColor: COLORS.BLACK,
	textColor: COLORS.WHITE,
} as const satisfies LabelStyle;

export const DOOR_STATE_GRID_ROW_DEFINITION = {
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
} as const satisfies GridRowDefinition;

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
	UNKNOWN: UNKNOWN_STATE_LABEL_STYLE,
} as const satisfies Record<DoorState, LabelStyle>;

const doorStateSelector = createCarStateByCarIndexSelector<DoorState>(
	(carState) => {
		if (carState.isDoorClosed === true) return "CLOSED";
		if (carState.isDoorClosed === false) return "OPEN";
		return "UNKNOWN";
	},
);

export type LabelStyleWithFullText = LabelStyle & {
	fullText?: string;
};
export const AIR_CONDITIONER_STATE_LABEL_STYLE = {
	AUTO_HEATING: {
		text: "自暖",
		fullText: "自暖房",
		fillColor: COLORS.MAGENTA,
		textColor: COLORS.WHITE,
	},
	AUTO_COOLING: {
		text: "自冷",
		fullText: "自冷房",
		fillColor: COLORS.AQUA,
		textColor: COLORS.BLACK,
	},
	OFF: {
		text: "切",
		fullText: "切",
		fillColor: COLORS.BLACK,
		textColor: COLORS.WHITE,
	},
	UNKNOWN: UNKNOWN_STATE_LABEL_STYLE,
} as const satisfies Record<
	AirConditionerState | "UNKNOWN",
	LabelStyleWithFullText
>;

export const TEMPERATURE_GRID_ROW_DEFINITION = {
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
	rowHeight: GRID_1X_CONTENT_HEIGHT + ROOM_TEMP_PADDING_TOP,
	marginTop: ROOM_TEMP_PADDING_TOP,
} as const satisfies GridRowDefinition;
const roomTemperatureTextSelector = createCarStateByCarIndexSelector<
	string | undefined
>((carState) =>
	carState.temperature != null ? carState.temperature.toFixed(1) : undefined,
);
export const HUMIDITY_GRID_ROW_DEFINITION = {
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
} as const satisfies GridRowDefinition;
const roomHumidityTextSelector = createCarStateByCarIndexSelector<
	string | undefined
>((carState) =>
	carState.humidity != null ? carState.humidity.toFixed(0) : undefined,
);
