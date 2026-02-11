import { memo, useCallback } from "react";

import {
	CanvasLine,
	CanvasRect,
	CanvasText,
} from "../../../../../canvas-renderer";
import CanvasRoundedRect from "../../../../../canvas-renderer/objects/CanvasRoundedRect";
import Button, { SHADOW_WIDTH } from "../../components/Button";
import FooterPageFrame from "../../components/FooterPageFrame";
import {
	COLORS,
	DISPLAY_WIDTH,
	FONT_SIZE_1X,
	RGB_COLORS,
} from "../../constants";
import { useWorkSettingPageMode } from "../../hooks/usePageMode";
import { ICONS } from "../../icons";
import { PAGE_TYPES } from "../pageTypes";

import TenKeyButton, { TEN_KEY_TYPE } from "./components/TenKeyButton";
import { PAGE_NAME_MAP } from "./constants";

import type { TenKeyType } from "./components/TenKeyButton";
import type { FooterButtonInfo } from "../../footer/FooterArea";

const DISPLAY_RECT_X = 24;
const DISPLAY_RECT_Y = 16;
const DISPLAY_RECT_WIDTH = 752;
const DISPLAY_RECT_HEIGHT = 108;

const EACH_DISPLAY_WIDTH = 200;
const EACH_DISPLAY_HEIGHT = 60;
const EACH_DISPLAY_TOP = 32;
const EACH_DISPLAY_LABEL_TOP = 8;

const EACH_DISPLAY_TEXT_X = 16;

const TYPE_DISPLAY_X = 40;
const DESTINATION_DISPLAY_X = 276;
const TRAIN_NUMBER_DISPLAY_X = 512;

const TOP_AREA_HR_Y = 139;

const TEN_KEY_AREA_X = 304;
const TEN_KEY_AREA_Y = 180;
const TEN_KEY_AREA_WIDTH = 484;
const TEN_KEY_AREA_HEIGHT = 272;
const TEN_KEY_CORNER_RADIUS = 12;

const SET_BUTTON_X = 368;
const SET_BUTTON_Y = 84;
const SET_BUTTON_WIDTH = 96;
const SET_BUTTON_HEIGHT = 32;

const CONFIRM_BUTTON_X = SET_BUTTON_X;
const CONFIRM_BUTTON_Y = SET_BUTTON_Y + 64;
const CONFIRM_BUTTON_WIDTH = SET_BUTTON_WIDTH;
const CONFIRM_BUTTON_HEIGHT = SET_BUTTON_HEIGHT;

const GUIDE_TEXT_1_X = 10;
const GUIDE_TEXT_1_Y = 482;
const GUIDE_TEXT_2_X = GUIDE_TEXT_1_X;
const GUIDE_TEXT_2_Y = GUIDE_TEXT_1_Y + FONT_SIZE_1X;

export default memo(function WorkSettingTrainNumber() {
	const mode = useWorkSettingPageMode();
	const onClickTenKey = useCallback((type: TenKeyType) => {
		console.log(`Ten key clicked: ${type}`);
	}, []);
	return (
		<FooterPageFrame
			mode={mode}
			pageIcon={ICONS.WORK_SETTING_1}
			pageName={PAGE_NAME_MAP[mode]}
			footerItems={FOOTER_MENU}>
			<CanvasLine
				relX1={0}
				relY1={TOP_AREA_HR_Y}
				relX2={DISPLAY_WIDTH - 1}
				relY2={TOP_AREA_HR_Y}
				color={COLORS.WHITE}
			/>
			<CanvasRect
				relX={DISPLAY_RECT_X}
				relY={DISPLAY_RECT_Y}
				width={DISPLAY_RECT_WIDTH}
				height={DISPLAY_RECT_HEIGHT}
				fillColor={COLORS.BLACK}
				strokeColor={COLORS.WHITE}
				strokeWidth={1}>
				<CanvasText
					relX={TYPE_DISPLAY_X}
					relY={EACH_DISPLAY_LABEL_TOP}
					maxWidthPx={EACH_DISPLAY_WIDTH}
					align="center"
					text="種　別"
					scaleX={2}
					fillColor={COLORS.WHITE}
				/>
				<Button
					relX={TYPE_DISPLAY_X}
					relY={EACH_DISPLAY_TOP}
					width={EACH_DISPLAY_WIDTH}
					height={EACH_DISPLAY_HEIGHT}
					fillColor={RGB_COLORS.BLACK}>
					<CanvasText
						relX={EACH_DISPLAY_TEXT_X}
						relY={0}
						align="left"
						verticalAlign="center"
						text="種別1"
						scaleY={2}
						fillColor={COLORS.WHITE}
					/>
				</Button>

				<CanvasText
					relX={DESTINATION_DISPLAY_X}
					relY={EACH_DISPLAY_LABEL_TOP}
					maxWidthPx={EACH_DISPLAY_WIDTH}
					align="center"
					text="行　先"
					scaleX={2}
					fillColor={COLORS.WHITE}
				/>
				<Button
					relX={DESTINATION_DISPLAY_X}
					relY={EACH_DISPLAY_TOP}
					width={EACH_DISPLAY_WIDTH}
					height={EACH_DISPLAY_HEIGHT}
					fillColor={RGB_COLORS.BLACK}>
					<CanvasText
						relX={EACH_DISPLAY_TEXT_X}
						relY={0}
						align="left"
						verticalAlign="center"
						text="行先1"
						scaleY={2}
						fillColor={COLORS.WHITE}
					/>
				</Button>

				<CanvasText
					relX={TRAIN_NUMBER_DISPLAY_X}
					relY={EACH_DISPLAY_LABEL_TOP}
					maxWidthPx={EACH_DISPLAY_WIDTH}
					align="center"
					text="列車番号"
					scaleX={2}
					fillColor={COLORS.WHITE}
				/>
				<Button
					relX={TRAIN_NUMBER_DISPLAY_X}
					relY={EACH_DISPLAY_TOP}
					width={EACH_DISPLAY_WIDTH}
					height={EACH_DISPLAY_HEIGHT}
					fillColor={RGB_COLORS.BLACK}>
					<CanvasText
						relX={EACH_DISPLAY_TEXT_X}
						relY={0}
						align="left"
						verticalAlign="center"
						text="列車番号1"
						scaleY={2}
						fillColor={COLORS.WHITE}
					/>
				</Button>
			</CanvasRect>

			<CanvasRoundedRect
				relX={TEN_KEY_AREA_X}
				relY={TEN_KEY_AREA_Y}
				width={TEN_KEY_AREA_WIDTH}
				height={TEN_KEY_AREA_HEIGHT}
				radius={TEN_KEY_CORNER_RADIUS}
				fillColor={COLORS.GRAY}>
				{TEN_KEY_LAYOUT.map((row, rowIndex) =>
					row.map((type, colIndex) => (
						<TenKeyButton
							// eslint-disable-next-line react/no-array-index-key
							key={`tenkey-${rowIndex}-${colIndex}`}
							row={rowIndex}
							col={colIndex}
							type={type}
							onClick={onClickTenKey}
						/>
					))
				).flat()}
				<Button
					relX={SET_BUTTON_X}
					relY={SET_BUTTON_Y}
					width={SET_BUTTON_WIDTH}
					height={SET_BUTTON_HEIGHT}
					shadowWidth={SHADOW_WIDTH.SMALL}>
					<CanvasText
						relX={0}
						relY={0}
						align="center"
						verticalAlign="center"
						text="セット"
						fillColor={COLORS.WHITE}
					/>
				</Button>
				<Button
					relX={CONFIRM_BUTTON_X}
					relY={CONFIRM_BUTTON_Y}
					width={CONFIRM_BUTTON_WIDTH}
					height={CONFIRM_BUTTON_HEIGHT}
					shadowWidth={SHADOW_WIDTH.SMALL}>
					<CanvasText
						relX={0}
						relY={0}
						align="center"
						verticalAlign="center"
						text="確　認"
						fillColor={COLORS.WHITE}
					/>
				</Button>
			</CanvasRoundedRect>
			<CanvasText
				relX={GUIDE_TEXT_1_X}
				relY={GUIDE_TEXT_1_Y}
				text="列車番号を入力後、「セット」キーを押し、最後に「確認」キーを押して下さい。"
				fillColor={COLORS.WHITE}
			/>
			<CanvasText
				relX={GUIDE_TEXT_2_X}
				relY={GUIDE_TEXT_2_Y}
				text="（停車パターン選択画面へ切り替わったら、停車パターンを選択して下さい。）"
				fillColor={COLORS.WHITE}
			/>
		</FooterPageFrame>
	);
});

const FOOTER_MENU = [
	{
		label: "列番設定",
		navigateTo: PAGE_TYPES.WORK_SETTING_TRAIN_NUMBER,
	},
	{
		label: "戻る",
		navigateTo: PAGE_TYPES.WORK_SETTING_TOP,
	},
] as const satisfies FooterButtonInfo[];

type TenKeyRow = readonly (TenKeyType | undefined)[] & { length: 6 };
type TenKeyLayout = readonly TenKeyRow[] & { length: 4 };
const TEN_KEY_LAYOUT = [
	[
		TEN_KEY_TYPE["EMPTY"],
		TEN_KEY_TYPE[7],
		TEN_KEY_TYPE[8],
		TEN_KEY_TYPE[9],
		TEN_KEY_TYPE["M"],
		TEN_KEY_TYPE["EMPTY"],
	],
	[
		TEN_KEY_TYPE["回"],
		TEN_KEY_TYPE[4],
		TEN_KEY_TYPE[5],
		TEN_KEY_TYPE[6],
		TEN_KEY_TYPE["G"],
		TEN_KEY_TYPE["EMPTY"],
	],
	[
		TEN_KEY_TYPE["救"],
		TEN_KEY_TYPE[1],
		TEN_KEY_TYPE[2],
		TEN_KEY_TYPE[3],
		TEN_KEY_TYPE["D"],
		TEN_KEY_TYPE["F"],
	],
	[
		TEN_KEY_TYPE["試"],
		TEN_KEY_TYPE[0],
		TEN_KEY_TYPE["CLEAR"],
		undefined,
		TEN_KEY_TYPE["A"],
		TEN_KEY_TYPE["C"],
	],
] as const satisfies TenKeyLayout;
