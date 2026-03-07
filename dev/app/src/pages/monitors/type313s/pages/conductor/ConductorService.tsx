import { memo } from "react";

import { CanvasLine, CanvasText } from "@web-mon-jrc/canvas-renderer";

import { createCarStateByCarIndexSelector } from "../../../../../store/monitors/type313s/type313sSelector";
import FooterPageFrame from "../../components/FooterPageFrame";
import LocationLabel from "../../components/LocationLabel";
import RoundedButton from "../../components/RoundedButton";
import TrainFormationImage, {
	LEFT as TRAIN_FORMATION_LEFT,
} from "../../components/car-image/TrainFormationImage";
import {
	COLORS,
	FONT_SIZE_1X,
	FONT_SIZE_2X,
	RGB_COLORS,
	WITH_FOOTER_CONTENT_HEIGHT,
} from "../../constants";
import { useConductorPageMode } from "../../hooks/usePageMode";

import CarStateLabel from "./components/CarStateLabel";
import ConductorRoundedButton from "./components/ConductorRoundedButton";
import ConductorStateGrid, {
	BASE_Y as CONDUCTOR_GRID_BASE_Y,
} from "./components/ConductorStateGrid";
import { FOOTER_MENU } from "./constants";

import type { LabelStyle } from "./components/CarStateLabel";
import type { RoundedButtonStyle } from "./components/ConductorRoundedButton";
import type { GridRowDefinition } from "./components/ConductorStateGrid";

const GRID_LABEL_X = 10;
const GRID_2X_CONTENT_HEIGHT = FONT_SIZE_2X + 2;

const ROOM_LIGHT_CTRL_LINE_X = 16;
const ROOM_LIGHT_CTRL_LINE_Y1 = 244;
const ROOM_LIGHT_CTRL_LINE_Y2 = 310;

const ROOM_LIGHT_CAR_SELECT_LINE_Y = 271;
const ROOM_LIGHT_CAR_SELECT_LINE_X2 = 31;
const ROOM_LIGHT_MODE_SELECT_LINE_Y = 311;

const ROOM_LIGHT_CAR_SELECT_LABEL_X = 38;
const ROOM_LIGHT_CAR_SELECT_LABEL_Y = 256;
const ROOM_LIGHT_MODE_SELECT_LABEL_Y = 296;

const ROOM_LIGHT_MODE_ON_X = ROOM_LIGHT_CAR_SELECT_LABEL_X + 156;
const ROOM_LIGHT_MODE_OFF_X = ROOM_LIGHT_MODE_ON_X + 100;

const NAVI_LABEL_X = 10;
const NAVI_LABEL_Y = 360;
const NAVI_BUTTON_X = ROOM_LIGHT_MODE_ON_X;
const NAVI_BUTTON_Y = NAVI_LABEL_Y + 2;

const CONFIRM_BUTTON_X = 608;
const CONFIRM_BUTTON_Y = NAVI_BUTTON_Y;

const GUIDE_LABEL_X = 9;
const GUIDE_LABEL_Y = WITH_FOOTER_CONTENT_HEIGHT - FONT_SIZE_1X - 8;

export default memo(function ConductorService() {
	const mode = useConductorPageMode();
	return (
		<FooterPageFrame
			mode={mode}
			footerItems={FOOTER_MENU}
		>
			<LocationLabel />

			<TrainFormationImage />

			<ConductorStateGrid
				offsetY={4}
				rowDefinitionList={GRID_DEFINITION}
			/>

			<RoundedButton
				relX={TRAIN_FORMATION_LEFT - 80}
				relY={CONDUCTOR_GRID_BASE_Y + 6}
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

			<CanvasLine
				relX1={ROOM_LIGHT_CTRL_LINE_X}
				relY1={ROOM_LIGHT_CTRL_LINE_Y1}
				relX2={ROOM_LIGHT_CTRL_LINE_X}
				relY2={ROOM_LIGHT_CTRL_LINE_Y2}
				color={COLORS.WHITE}
			/>
			<CanvasLine
				relX1={ROOM_LIGHT_CTRL_LINE_X}
				relY1={ROOM_LIGHT_CAR_SELECT_LINE_Y}
				relX2={ROOM_LIGHT_CAR_SELECT_LINE_X2}
				relY2={ROOM_LIGHT_CAR_SELECT_LINE_Y}
				color={COLORS.WHITE}
			/>
			<CanvasLine
				relX1={ROOM_LIGHT_CTRL_LINE_X}
				relY1={ROOM_LIGHT_MODE_SELECT_LINE_Y}
				relX2={ROOM_LIGHT_CAR_SELECT_LINE_X2}
				relY2={ROOM_LIGHT_MODE_SELECT_LINE_Y}
				color={COLORS.WHITE}
			/>

			<CanvasText
				relX={ROOM_LIGHT_CAR_SELECT_LABEL_X}
				relY={ROOM_LIGHT_CAR_SELECT_LABEL_Y}
				text="車両選択"
				fillColor={COLORS.WHITE}
				scaleY={2}
			/>
			<RoundedButton
				relX={TRAIN_FORMATION_LEFT - 80}
				relY={ROOM_LIGHT_CAR_SELECT_LABEL_Y + 2}
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
				relX={ROOM_LIGHT_CAR_SELECT_LABEL_X}
				relY={ROOM_LIGHT_MODE_SELECT_LABEL_Y}
				text="ﾓｰﾄﾞ選択"
				fillColor={COLORS.WHITE}
				scaleY={2}
			/>

			<RoundedButton
				relX={ROOM_LIGHT_MODE_ON_X}
				relY={ROOM_LIGHT_MODE_SELECT_LABEL_Y + 2}
				width={72}
				fillColor={RGB_COLORS.YELLOW}
			>
				<CanvasText
					relX={0}
					relY={0}
					text="入"
					verticalAlign="center"
					align="center"
					fillColor={COLORS.BLACK}
				/>
			</RoundedButton>
			<RoundedButton
				relX={ROOM_LIGHT_MODE_OFF_X}
				relY={ROOM_LIGHT_MODE_SELECT_LABEL_Y + 2}
				width={72}
				fillColor={RGB_COLORS.BLACK}
			>
				<CanvasText
					relX={0}
					relY={0}
					text="切"
					verticalAlign="center"
					align="center"
					fillColor={COLORS.WHITE}
				/>
			</RoundedButton>

			<CanvasText
				relX={NAVI_LABEL_X}
				relY={NAVI_LABEL_Y}
				text="車内案内"
				fillColor={COLORS.WHITE}
				scaleX={2}
				scaleY={2}
			/>

			<RoundedButton
				relX={NAVI_BUTTON_X}
				relY={NAVI_BUTTON_Y}
				width={72}
				fillColor={RGB_COLORS.YELLOW}
			>
				<CanvasText
					relX={0}
					relY={0}
					text="入"
					verticalAlign="center"
					align="center"
					fillColor={COLORS.BLACK}
				/>
			</RoundedButton>

			<RoundedButton
				relX={CONFIRM_BUTTON_X}
				relY={CONFIRM_BUTTON_Y}
				width={104}
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
				text="それぞれのキーを押すと、内容が変化します。最後に「確認」キーを押して下さい。"
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
				text="放送"
				fillColor={COLORS.WHITE}
				scaleX={2}
				scaleY={2}
			/>
		),
		renderCell: (relX, relY, carIndex) => (
			<ConductorRoundedButton
				relX={relX}
				relY={relY + 2}
				carIndex={carIndex}
				styleMap={ANNOUNCE_BUTTON_STYLE}
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
				text="室内灯"
				fillColor={COLORS.WHITE}
				scaleX={2}
				scaleY={2}
			/>
		),
		renderCell: (relX, relY, carIndex) => (
			<CarStateLabel
				relX={relX}
				relY={relY + 4}
				carIndex={carIndex}
				styleMap={ROOM_LIGHT_STATE_LABEL_STYLE}
				stateSelector={roomLightStateSelector}
			/>
		),
		rowHeight: GRID_2X_CONTENT_HEIGHT * 2,
		marginTop: GRID_2X_CONTENT_HEIGHT - 4,
	},
] as const satisfies GridRowDefinition[];

type AnnounceState = "ON" | "OFF" | "UNKNOWN";
const ANNOUNCE_BUTTON_STYLE = {
	ON: {
		text: "入",
		fillColor: RGB_COLORS.AQUA,
		textColor: COLORS.BLACK,
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
} as const satisfies Record<AnnounceState, RoundedButtonStyle>;
const announceStateSelector = createCarStateByCarIndexSelector<AnnounceState>(
	(carState) => {
		if (carState.isAnnounceOn === true) return "ON";
		if (carState.isAnnounceOn === false) return "OFF";
		return "UNKNOWN";
	},
);
type RoomLightState = "ON" | "OFF" | "UNKNOWN";
const ROOM_LIGHT_STATE_LABEL_STYLE = {
	ON: {
		text: "入",
		fillColor: COLORS.YELLOW,
		textColor: COLORS.BLACK,
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
} as const satisfies Record<RoomLightState, LabelStyle>;
const roomLightStateSelector = createCarStateByCarIndexSelector<RoomLightState>(
	(carState) => {
		if (carState.isRoomLightOn === true) return "ON";
		if (carState.isRoomLightOn === false) return "OFF";
		return "UNKNOWN";
	},
);
