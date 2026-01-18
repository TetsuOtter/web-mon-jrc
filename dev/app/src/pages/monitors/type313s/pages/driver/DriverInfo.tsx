import { memo, useMemo } from "react";

import { CanvasLine, CanvasText } from "../../../../../canvas-renderer";
import CanvasObjectGroup from "../../../../../canvas-renderer/objects/CanvasObjectGroup";
import LocationLabel from "../../components/LocationLabel";
import TrainFormationImage from "../../components/car-image/TrainFormationImage";
import { BrightnessControlButton } from "../../components/controls";
import FooterPageFrame from "../../components/FooterPageFrame";
import {
	COLORS,
	DISPLAY_HEIGHT,
	DISPLAY_WIDTH,
	FONT_SIZE_1X,
	HEADER_HEIGHT,
} from "../../constants";
import { PAGE_TYPES } from "../pageTypes";
import { usePageNavigationTo } from "../usePageNavigation";

import type { FooterButtonInfo } from "../../footer/FooterArea";
import type { BaseCarImageInfo } from "../../components/car-image/baseCarImageCache";
import type { CarImageBogieInfo } from "../../components/car-image/bogieImageCache";
import { BOGIE_STATE } from "../../components/car-image/bogieImageCache";

// Layout constants
const CONTENT_HEIGHT = DISPLAY_HEIGHT - HEADER_HEIGHT;
const LINE_THICKNESS = 1;
const LOWER_BOX_HEIGHT = FONT_SIZE_1X * 3;
const SEPARATOR_X = 160;
const LOWER_BOX_Y = CONTENT_HEIGHT - LOWER_BOX_HEIGHT;

// Next stop label positioning
const NEXT_STOP_LABEL_PADDING = 4;

// Driver assist area
const DRIVER_ASSIST_X = SEPARATOR_X + 8;
const DRIVER_ASSIST_Y = LOWER_BOX_Y + 8;
const DRIVER_ASSIST_WIDTH = DISPLAY_WIDTH - SEPARATOR_X - 16;

// Sample train formation data (4 cars: 313-3000 series)
const SAMPLE_TRAIN_FORMATION: {
	key: string;
	baseInfo: BaseCarImageInfo;
	bogieInfo: CarImageBogieInfo;
}[] = [
	{
		key: "car1",
		baseInfo: {
			isLeftCab: true,
			isRightCab: false,
			hasLeftPantograph: false,
			hasRightPantograph: true,
		},
		bogieInfo: { left: BOGIE_STATE.MOTORED, right: BOGIE_STATE.MOTORED },
	},
	{
		key: "car2",
		baseInfo: {
			isLeftCab: false,
			isRightCab: false,
			hasLeftPantograph: false,
			hasRightPantograph: false,
		},
		bogieInfo: { left: BOGIE_STATE.NONE, right: BOGIE_STATE.NONE },
	},
	{
		key: "car3",
		baseInfo: {
			isLeftCab: false,
			isRightCab: false,
			hasLeftPantograph: true,
			hasRightPantograph: false,
		},
		bogieInfo: { left: BOGIE_STATE.MOTORED, right: BOGIE_STATE.MOTORED },
	},
	{
		key: "car4",
		baseInfo: {
			isLeftCab: false,
			isRightCab: true,
			hasLeftPantograph: false,
			hasRightPantograph: false,
		},
		bogieInfo: { left: BOGIE_STATE.NONE, right: BOGIE_STATE.NONE },
	},
];

export default memo(function DriverInfo() {
	const navigateToReduceSpeed = usePageNavigationTo(
		PAGE_TYPES["DRIVER-REDUCE_SPEED"]
	);
	const navigateToMenu = usePageNavigationTo(PAGE_TYPES.MENU);
	const navigateToRoomLight = usePageNavigationTo(
		PAGE_TYPES["DRIVER-ROOM_LIGHT"]
	);
	const navigateToLocationCorrection = usePageNavigationTo(
		PAGE_TYPES["DRIVER-LOCATION_CORRECTION"]
	);
	const navigateToConductorInfo = usePageNavigationTo(
		PAGE_TYPES["CONDUCTOR-INFO"]
	);

	const footerItems: FooterButtonInfo[] = useMemo(
		() => [
			{
				label: "運転士",
				isSelected: true,
				handleClick: () => {},
			},
			{
				label: "徐行情報",
				isSelected: false,
				handleClick: navigateToReduceSpeed,
			},
			{
				label: "室内灯",
				isSelected: false,
				handleClick: navigateToRoomLight,
			},
			{
				label: "位置補正",
				isSelected: false,
				handleClick: navigateToLocationCorrection,
			},
			{
				label: "車掌",
				isSelected: false,
				handleClick: navigateToConductorInfo,
			},
			{
				label: "メニュー",
				isSelected: false,
				handleClick: navigateToMenu,
			},
		],
		[
			navigateToReduceSpeed,
			navigateToMenu,
			navigateToRoomLight,
			navigateToLocationCorrection,
			navigateToConductorInfo,
		]
	);

	return (
		<FooterPageFrame footerItems={footerItems}>
			{/* Location Label (top-left) */}
			<LocationLabel locationKm={123.4} />

			{/* Brightness Control Button (top-right) */}
			<BrightnessControlButton relX={686} relY={3} />

			{/* Train Formation Image */}
			<TrainFormationImage infoList={SAMPLE_TRAIN_FORMATION} />

			{/* Left vertical line */}
			<CanvasLine
				relX1={LINE_THICKNESS / 2}
				relY1={0}
				relX2={LINE_THICKNESS / 2}
				relY2={CONTENT_HEIGHT}
				color={COLORS.WHITE}
				width={LINE_THICKNESS}
			/>

			{/* Horizontal line dividing upper/lower sections */}
			<CanvasLine
				relX1={0}
				relY1={LOWER_BOX_Y}
				relX2={DISPLAY_WIDTH}
				relY2={LOWER_BOX_Y}
				color={COLORS.WHITE}
				width={LINE_THICKNESS}
			/>

			{/* Vertical separator at 160px */}
			<CanvasLine
				relX1={SEPARATOR_X}
				relY1={LOWER_BOX_Y}
				relX2={SEPARATOR_X}
				relY2={CONTENT_HEIGHT}
				color={COLORS.WHITE}
				width={LINE_THICKNESS}
			/>

			{/* Next Stop Label Area */}
			<CanvasObjectGroup
				relX={0}
				relY={LOWER_BOX_Y}
				width={SEPARATOR_X}
				height={LOWER_BOX_HEIGHT}>
				<CanvasText
					relX={NEXT_STOP_LABEL_PADDING}
					relY={NEXT_STOP_LABEL_PADDING}
					text="次停車駅"
					fillColor={COLORS.WHITE}
				/>
				<CanvasText
					relX={0}
					relY={FONT_SIZE_1X + NEXT_STOP_LABEL_PADDING * 2}
					maxWidthPx={SEPARATOR_X}
					text="名古屋"
					fillColor={COLORS.LIME}
					align="center"
					scaleX={2}
					scaleY={2}
				/>
			</CanvasObjectGroup>

			{/* Driver Assist Area */}
			<CanvasObjectGroup
				relX={DRIVER_ASSIST_X}
				relY={DRIVER_ASSIST_Y}
				width={DRIVER_ASSIST_WIDTH}
				height={LOWER_BOX_HEIGHT - 16}>
				<CanvasText
					relX={0}
					relY={0}
					text="運転士支援情報"
					fillColor={COLORS.WHITE}
				/>
			</CanvasObjectGroup>
		</FooterPageFrame>
	);
});
