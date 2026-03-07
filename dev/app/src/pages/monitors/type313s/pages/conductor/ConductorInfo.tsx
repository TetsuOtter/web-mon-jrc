import { memo } from "react";

import { CanvasText } from "@web-mon-jrc/canvas-renderer";

import { useAppSelector } from "../../../../../store/hooks";
import {
	conductorIsGuidanceOnSelector,
	conductorIsRoomLightOnSelector,
	createCarStateByCarIndexSelector,
} from "../../../../../store/monitors/type313s/type313sSelector";
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

import {
	AIR_CONDITIONER_STATE_LABEL_STYLE,
	DOOR_STATE_GRID_ROW_DEFINITION,
	GRID_2X_CONTENT_HEIGHT,
	GRID_2X_CONTENT_Y,
	GRID_LABEL_X,
	HUMIDITY_GRID_ROW_DEFINITION,
	TEMPERATURE_GRID_ROW_DEFINITION,
} from "./ConductorGridRowDefinitions";
import CarStateLabel from "./components/CarStateLabel";
import ConductorInfoOnOffState from "./components/ConductorInfoOnOffState";
import ConductorStateGrid from "./components/ConductorStateGrid";
import { FOOTER_MENU } from "./constants";

import type { LabelStyle } from "./components/CarStateLabel";
import type { GridRowDefinition } from "./components/ConductorStateGrid";
import type {
	AirConditionerState,
	FanState,
} from "../../../../../store/monitors/type313s/type313sTypes";

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
	const isRoomLightOn = useAppSelector(conductorIsRoomLightOnSelector);
	const isGuidanceOn = useAppSelector(conductorIsGuidanceOnSelector);

	return (
		<FooterPageFrame
			mode={mode}
			footerItems={FOOTER_MENU}
		>
			<LocationLabel />

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
				isOn={isRoomLightOn ?? false}
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
				isOn={isGuidanceOn ?? false}
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
	DOOR_STATE_GRID_ROW_DEFINITION,
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
		rowHeight: GRID_2X_CONTENT_HEIGHT,
	},
	TEMPERATURE_GRID_ROW_DEFINITION,
	HUMIDITY_GRID_ROW_DEFINITION,
] as const satisfies GridRowDefinition[];

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
const announceStateSelector = createCarStateByCarIndexSelector<AnnounceState>(
	(carState) => {
		if (carState.isAnnounceOn === true) return "ON";
		if (carState.isAnnounceOn === false) return "OFF";
		return "UNKNOWN";
	},
);

const airConditionerStateSelector = createCarStateByCarIndexSelector<
	AirConditionerState | "UNKNOWN"
>((carState) => carState.airConditionerState ?? "UNKNOWN");

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
} as const satisfies Record<FanState | "UNKNOWN", LabelStyle>;
const fanStateSelector = createCarStateByCarIndexSelector<FanState | "UNKNOWN">(
	(carState) => carState.fanState ?? "UNKNOWN",
);
