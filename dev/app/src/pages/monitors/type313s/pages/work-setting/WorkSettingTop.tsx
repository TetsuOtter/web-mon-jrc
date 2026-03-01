import { memo, useCallback } from "react";

import { CanvasRect, CanvasText } from "../../../../../canvas-renderer";
import CanvasRoundedRect from "../../../../../canvas-renderer/objects/CanvasRoundedRect";
import { useAppSelector } from "../../../../../store/hooks";
import {
	trainNumberSelector,
	trainTypeSelector,
} from "../../../../../store/monitors/type313s/type313sSelector";
import Button, { SHADOW_WIDTH } from "../../components/Button";
import FooterPageFrame from "../../components/FooterPageFrame";
import LocationLabel from "../../components/LocationLabel";
import RoundedButton from "../../components/RoundedButton";
import { COLORS, FONT_SIZE_1X, RGB_COLORS } from "../../constants";
import { useWorkSettingPageMode } from "../../hooks/usePageMode";
import { ICONS } from "../../icons";
import { PAGE_TYPES } from "../pageTypes";
import {
	FORMATION_NUM,
	usePageNavigation,
	usePageNavigationTo,
} from "../usePageNavigation";

import BulkDirectionRow from "./components/BulkDirectionRow";
import TrainDirectionRow from "./components/TrainDirectionRow";
import { PAGE_NAME_MAP } from "./constants";

import type { FooterButtonInfo } from "../../footer/FooterArea";
import type { FormationNum } from "../usePageNavigation";

const INNER_BUTTON_TEXT_X = SHADOW_WIDTH.DEFAULT + 2;
const INNER_BUTTON_PADDING_X = 4;

// Constants from C# DirectionMenu.cs
const LABEL_LEFT = 16;

const BUTTON_WIDTH = 100;
const TITLE_HEIGHT = 42;
const BUTTON_HEIGHT = TITLE_HEIGHT + 10; // = 52
const TITLE_WIDTH = FONT_SIZE_1X * 9; // = 144

const TYPE_DIRECTION_DISPLAY_WIDTH = FONT_SIZE_1X * 15; // = 240
const BUTTON_DISPLAY_PADDING = 8;

// Train Number Area Constants
const TRAIN_NUMBER_AREA_TOP = 82;
const TRAIN_NUMBER_AREA_LEFT = 12;
const TRAIN_NUMBER_AREA_HEIGHT = 122;
const TRAIN_NUMBER_AREA_WIDTH = 345;
const TRAIN_NUMBER_BUTTON_LEFT = 44;
const TRAIN_NUMBER_BUTTON_TOP = (TRAIN_NUMBER_AREA_HEIGHT - BUTTON_HEIGHT) / 2;
const TRAIN_NUMBER_DISPLAY_SPACING = 24;
const TRAIN_NUMBER_DISPLAY_LEFT =
	TRAIN_NUMBER_BUTTON_LEFT + BUTTON_WIDTH + TRAIN_NUMBER_DISPLAY_SPACING;
const TRAIN_NUMBER_DISPLAY_WIDTH = 140;

// Train Type Area Constants
const TRAIN_TYPE_AREA_TOP = 234;
const TRAIN_TYPE_AREA_LEFT = TRAIN_NUMBER_AREA_LEFT;
const TRAIN_TYPE_AREA_HEIGHT = 142;
const TRAIN_TYPE_AREA_WIDTH = 382;
const TRAIN_TYPE_CORNER_RADIUS = 8;
const TRAIN_TYPE_BUTTON_LEFT = FONT_SIZE_1X;
const TRAIN_TYPE_TITLE_TOP = 16;
const TRAIN_TYPE_TITLE_LEFT = TRAIN_TYPE_BUTTON_LEFT + BUTTON_WIDTH;
const TRAIN_TYPE_TITLE_SPACING = 16;
const TRAIN_TYPE_BUTTON_TOP =
	TRAIN_TYPE_TITLE_TOP + TITLE_HEIGHT + TRAIN_TYPE_TITLE_SPACING;
const TRAIN_TYPE_DISPLAY_LEFT =
	TRAIN_TYPE_BUTTON_LEFT + BUTTON_WIDTH + BUTTON_DISPLAY_PADDING;

// Direction Area Constants
const DIRECTION_AREA_TOP = 28;
const DIRECTION_AREA_LEFT = 408;
const DIRECTION_AREA_HEIGHT = 454;
const DIRECTION_AREA_WIDTH = 382;
const DIRECTION_CORNER_RADIUS = TRAIN_TYPE_CORNER_RADIUS;
const DIRECTION_BUTTON_LEFT = 16;
const DIRECTION_DISPLAY_DISPLAY_SPACING = 5;
const DIRECTION_TITLE_LEFT =
	DIRECTION_BUTTON_LEFT + BUTTON_WIDTH + BUTTON_DISPLAY_PADDING;
const DIRECTION_TITLE_TOP = 12;
const DIRECTION_BULK_BUTTON_TOP =
	DIRECTION_TITLE_TOP + TITLE_HEIGHT + DIRECTION_DISPLAY_DISPLAY_SPACING;
const DIRECTION_BUTTON_TOP =
	DIRECTION_BULK_BUTTON_TOP + DIRECTION_DISPLAY_DISPLAY_SPACING;

// Submit Button Constants
const SUBMIT_BUTTON_LEFT =
	TRAIN_TYPE_DISPLAY_LEFT + TYPE_DIRECTION_DISPLAY_WIDTH - 90;
const SUBMIT_BUTTON_TOP = TRAIN_TYPE_AREA_TOP + TRAIN_TYPE_AREA_HEIGHT + 18;
const SUBMIT_BUTTON_HEIGHT = 30;
const SUBMIT_BUTTON_WIDTH = 90;

const CHANGE_DIR_ANNOUNCE_LABEL_X = 56;
const CHANGE_DIR_ANNOUNCE_LABEL_Y =
	TRAIN_TYPE_AREA_TOP + TRAIN_TYPE_AREA_HEIGHT + 16;
const CHANGE_DIR_ANNOUNCE_ON_BUTTON_X = CHANGE_DIR_ANNOUNCE_LABEL_X - 40;
const CHANGE_DIR_ANNOUNCE_BUTTON_Y = CHANGE_DIR_ANNOUNCE_LABEL_Y + 26;
const CHANGE_DIR_ANNOUNCE_BUTTON_WIDTH = 72;
const CHANGE_DIR_ANNOUNCE_OFF_BUTTON_X = CHANGE_DIR_ANNOUNCE_LABEL_X + 64;

const GUIDE_1_Y = 450;
const GUIDE_2_Y = GUIDE_1_Y + FONT_SIZE_1X * 2;
const GUIDE_3_Y = GUIDE_2_Y + FONT_SIZE_1X;

export default memo(function WorkSettingTop() {
	const mode = useWorkSettingPageMode();
	const navigate = usePageNavigation();

	const handleTrainNumberClick = usePageNavigationTo(
		PAGE_TYPES.WORK_SETTING_TRAIN_NUMBER
	);
	const handleBulkTypeClick = usePageNavigationTo(PAGE_TYPES.WORK_SETTING_TYPE);
	const handleBulkDirectionClick = usePageNavigationTo(
		PAGE_TYPES.WORK_SETTING_DESTINATION
	);

	const handleDirectionRowClick = useCallback(
		(index: number) => {
			const formationNum = getFormationNumFromIndex(index);
			if (formationNum != null) {
				navigate(PAGE_TYPES.WORK_SETTING_DESTINATION, {
					formationNum,
				});
			}
		},
		[navigate]
	);

	const handleStartupClick = useCallback(() => {
		// TODO: Navigate to DirectionSetting page with startup
		console.log("Startup button clicked");
	}, []);

	const trainNumber = useAppSelector(trainNumberSelector);
	const trainType = useAppSelector(trainTypeSelector);

	return (
		<FooterPageFrame
			mode={mode}
			pageIcon={ICONS.WORK_SETTING_1}
			pageName={PAGE_NAME_MAP[mode]}
			footerItems={FOOTER_MENU}>
			<LocationLabel />

			<CanvasRoundedRect
				relX={TRAIN_NUMBER_AREA_LEFT}
				relY={TRAIN_NUMBER_AREA_TOP}
				width={TRAIN_NUMBER_AREA_WIDTH}
				height={TRAIN_NUMBER_AREA_HEIGHT}
				radius={TRAIN_NUMBER_AREA_HEIGHT / 2}
				fillColor={COLORS.GRAY}>
				<Button
					relX={TRAIN_NUMBER_BUTTON_LEFT}
					relY={TRAIN_NUMBER_BUTTON_TOP}
					width={BUTTON_WIDTH}
					height={BUTTON_HEIGHT}
					shadowWidth={SHADOW_WIDTH.SMALL}
					onClick={handleTrainNumberClick}>
					<CanvasText
						relX={0}
						relY={0}
						align="center"
						verticalAlign="center"
						text="列車番号"
						fillColor={COLORS.WHITE}
						scaleY={2}
					/>
				</Button>
				<Button
					relX={TRAIN_NUMBER_DISPLAY_LEFT}
					relY={TRAIN_NUMBER_BUTTON_TOP}
					width={TRAIN_NUMBER_DISPLAY_WIDTH}
					height={BUTTON_HEIGHT}
					fillColor={RGB_COLORS.BLACK}>
					<CanvasText
						relX={INNER_BUTTON_TEXT_X + INNER_BUTTON_PADDING_X}
						relY={0}
						maxWidthPx={
							TRAIN_NUMBER_DISPLAY_WIDTH -
							(INNER_BUTTON_TEXT_X + INNER_BUTTON_PADDING_X) * 2
						}
						align="right"
						verticalAlign="center"
						text={trainNumber ?? ""}
						fillColor={COLORS.WHITE}
					/>
				</Button>
			</CanvasRoundedRect>

			<CanvasRoundedRect
				relX={TRAIN_TYPE_AREA_LEFT}
				relY={TRAIN_TYPE_AREA_TOP}
				width={TRAIN_TYPE_AREA_WIDTH}
				height={TRAIN_TYPE_AREA_HEIGHT}
				radius={TRAIN_TYPE_CORNER_RADIUS}
				fillColor={COLORS.GRAY}>
				<CanvasRect
					relX={TRAIN_TYPE_TITLE_LEFT}
					relY={TRAIN_TYPE_TITLE_TOP}
					width={TITLE_WIDTH}
					height={TITLE_HEIGHT}
					fillColor={COLORS.BLACK}>
					<CanvasText
						relX={0}
						relY={0}
						align="center"
						verticalAlign="center"
						text="種別表示器"
						fillColor={COLORS.WHITE}
						scaleY={2}
					/>
				</CanvasRect>

				<Button
					relX={TRAIN_TYPE_BUTTON_LEFT}
					relY={TRAIN_TYPE_BUTTON_TOP}
					width={BUTTON_WIDTH}
					height={BUTTON_HEIGHT}
					shadowWidth={SHADOW_WIDTH.SMALL}
					onClick={handleBulkTypeClick}>
					<CanvasText
						relX={0}
						relY={0}
						align="center"
						verticalAlign="center"
						text="一　括"
						fillColor={COLORS.WHITE}
						scaleY={2}
					/>
				</Button>
				<Button
					relX={TRAIN_TYPE_DISPLAY_LEFT}
					relY={TRAIN_TYPE_BUTTON_TOP}
					width={TYPE_DIRECTION_DISPLAY_WIDTH}
					height={BUTTON_HEIGHT}
					fillColor={RGB_COLORS.BLACK}>
					<CanvasText
						relX={INNER_BUTTON_TEXT_X + INNER_BUTTON_PADDING_X}
						relY={0}
						maxWidthPx={
							TYPE_DIRECTION_DISPLAY_WIDTH -
							(INNER_BUTTON_TEXT_X + INNER_BUTTON_PADDING_X) * 2
						}
						align="left"
						verticalAlign="center"
						text={trainType ?? ""}
						fillColor={COLORS.WHITE}
					/>
				</Button>
			</CanvasRoundedRect>

			<CanvasRoundedRect
				relX={DIRECTION_AREA_LEFT}
				relY={DIRECTION_AREA_TOP}
				width={DIRECTION_AREA_WIDTH}
				height={DIRECTION_AREA_HEIGHT}
				radius={DIRECTION_CORNER_RADIUS}
				fillColor={COLORS.GRAY}>
				<CanvasRect
					relX={DIRECTION_TITLE_LEFT}
					relY={DIRECTION_TITLE_TOP}
					width={TITLE_WIDTH}
					height={TITLE_HEIGHT}
					fillColor={COLORS.BLACK}>
					<CanvasText
						relX={0}
						relY={0}
						align="center"
						verticalAlign="center"
						text="行先表示器"
						fillColor={COLORS.WHITE}
						scaleY={2}
					/>
				</CanvasRect>

				<BulkDirectionRow
					key="bulk"
					relY={DIRECTION_BULK_BUTTON_TOP}
					onClick={handleBulkDirectionClick}
				/>

				{Array.from({ length: 6 }, (_, i) => (
					<TrainDirectionRow
						key={`direction-${i + 1}`}
						index={i + 1}
						relY={DIRECTION_BUTTON_TOP + (i + 1) * BUTTON_HEIGHT}
						onClick={handleDirectionRowClick}
					/>
				))}
			</CanvasRoundedRect>

			{/* Submit Button (起動) */}
			<Button
				relX={SUBMIT_BUTTON_LEFT}
				relY={SUBMIT_BUTTON_TOP}
				width={SUBMIT_BUTTON_WIDTH}
				height={SUBMIT_BUTTON_HEIGHT}
				shadowWidth={SHADOW_WIDTH.EXTRA_SMALL}
				onClick={handleStartupClick}>
				<CanvasText
					relX={0}
					relY={0}
					align="center"
					verticalAlign="center"
					text="起　動"
					fillColor={COLORS.WHITE}
				/>
			</Button>

			<CanvasText
				relX={CHANGE_DIR_ANNOUNCE_LABEL_X}
				relY={CHANGE_DIR_ANNOUNCE_LABEL_Y}
				text="行先変更案内"
				fillColor={COLORS.WHITE}
			/>
			<RoundedButton
				relX={CHANGE_DIR_ANNOUNCE_ON_BUTTON_X}
				relY={CHANGE_DIR_ANNOUNCE_BUTTON_Y}
				width={CHANGE_DIR_ANNOUNCE_BUTTON_WIDTH}
				fillColor={RGB_COLORS.BLACK}>
				<CanvasText
					relX={0}
					relY={0}
					text="する"
					verticalAlign="center"
					align="center"
					fillColor={COLORS.WHITE}
				/>
			</RoundedButton>
			<RoundedButton
				relX={CHANGE_DIR_ANNOUNCE_OFF_BUTTON_X}
				relY={CHANGE_DIR_ANNOUNCE_BUTTON_Y}
				width={CHANGE_DIR_ANNOUNCE_BUTTON_WIDTH}
				fillColor={RGB_COLORS.YELLOW}>
				<CanvasText
					relX={0}
					relY={0}
					text="しない"
					verticalAlign="center"
					align="center"
					fillColor={COLORS.BLACK}
				/>
			</RoundedButton>

			{/* Warning Messages */}
			{/* Message 1 */}
			<CanvasText
				relX={LABEL_LEFT}
				relY={GUIDE_1_Y}
				text="車内案内表示器は、作動しません。"
				fillColor={COLORS.WHITE}
			/>

			{/* Message 2 */}
			<CanvasText
				relX={LABEL_LEFT}
				relY={GUIDE_2_Y}
				text="種別、行先、行先変更案内を設定してください。"
				fillColor={COLORS.WHITE}
			/>

			{/* Message 3 */}
			<CanvasText
				relX={LABEL_LEFT}
				relY={GUIDE_3_Y}
				text="設定内容を確認して、「起動」キーを押すと、字幕表示器が動作します。"
				fillColor={COLORS.WHITE}
			/>
		</FooterPageFrame>
	);
});

const FOOTER_MENU = [
	{
		label: "行先設定",
		navigateTo: PAGE_TYPES.WORK_SETTING_TOP,
	},
	{
		label: "メニュー",
		navigateTo: PAGE_TYPES.MENU,
		queryParams: { mode: "MENU" },
	},
] as const satisfies FooterButtonInfo[];

const getFormationNumFromIndex = (index: number): FormationNum | undefined => {
	switch (index) {
		case 0:
			return FORMATION_NUM[1];
		case 1:
			return FORMATION_NUM[2];
		case 2:
			return FORMATION_NUM[3];
		case 3:
			return FORMATION_NUM[4];
		case 4:
			return FORMATION_NUM[5];
		case 5:
			return FORMATION_NUM[6];
		default:
			return undefined;
	}
};
