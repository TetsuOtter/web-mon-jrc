import { CanvasText } from "@web-mon-jrc/canvas-renderer";
import { createCarStateByCarIndexSelector } from "../../../../../store/monitors/type313s/type313sSelector";
import { COLORS, FONT_SIZE_2X } from "../../constants";

import CarStateLabel from "./components/CarStateLabel";

import type { LabelStyle } from "./components/CarStateLabel";
import type { GridRowDefinition } from "./components/ConductorStateGrid";

export const GRID_LABEL_X = 10;
export const GRID_2X_CONTENT_HEIGHT = FONT_SIZE_2X + 2;
export const GRID_2X_CONTENT_Y = 4;

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
	UNKNOWN: {
		text: "-",
		fillColor: COLORS.BLACK,
		textColor: COLORS.WHITE,
	},
} as const satisfies Record<DoorState, LabelStyle>;

const doorStateSelector = createCarStateByCarIndexSelector<DoorState>(
	(carState) => {
		if (carState.isDoorClosed === true) return "CLOSED";
		if (carState.isDoorClosed === false) return "OPEN";
		return "UNKNOWN";
	}
);
