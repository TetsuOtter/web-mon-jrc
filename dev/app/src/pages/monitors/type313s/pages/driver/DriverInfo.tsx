import { memo, useMemo } from "react";

import { CanvasLine, CanvasText } from "../../../../../canvas-renderer";
import CanvasObjectGroup from "../../../../../canvas-renderer/objects/CanvasObjectGroup";
import FooterPageFrame from "../../components/FooterPageFrame";
import LocationLabel from "../../components/LocationLabel";
import TrainFormationImage from "../../components/car-image/TrainFormationImage";
import { BOGIE_STATE } from "../../components/car-image/bogieImageCache";
import {
	COLORS,
	DISPLAY_HEIGHT,
	DISPLAY_WIDTH,
	FONT_SIZE_1X,
	HEADER_HEIGHT,
} from "../../constants";
import { PAGE_TYPES } from "../pageTypes";
import { usePageNavigationTo } from "../usePageNavigation";

import type { BaseCarImageInfo } from "../../components/car-image/baseCarImageCache";
import type { CarImageBogieInfo } from "../../components/car-image/bogieImageCache";
import type { FooterButtonInfo } from "../../footer/FooterArea";

// Layout constants
const CONTENT_HEIGHT = DISPLAY_HEIGHT - HEADER_HEIGHT;
const LINE_THICKNESS = 1;
const LOWER_BOX_HEIGHT = FONT_SIZE_1X * 3;
const LOWER_BOX_Y = CONTENT_HEIGHT - LOWER_BOX_HEIGHT;

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
			<LocationLabel locationKm={0.0} />

			{/* Small Train Formation Image (scaled down) */}
			<CanvasObjectGroup
				relX={200}
				relY={70}
				width={200}
				height={100}>
				<TrainFormationImage infoList={SAMPLE_TRAIN_FORMATION} />
			</CanvasObjectGroup>

			{/* Touch instruction text */}
			<CanvasText
				relX={20}
				relY={200}
				text="項目名にタッチ → 処置表示"
				fillColor={COLORS.WHITE}
			/>

			{/* Next Stop Label Box (bottom) */}
			<CanvasObjectGroup
				relX={0}
				relY={LOWER_BOX_Y}
				width={DISPLAY_WIDTH}
				height={LOWER_BOX_HEIGHT}>
				<CanvasLine
					relX1={0}
					relY1={0}
					relX2={DISPLAY_WIDTH}
					relY2={0}
					color={COLORS.WHITE}
					width={LINE_THICKNESS}
				/>
				<CanvasText
					relX={8}
					relY={8}
					text="次停車駅"
					fillColor={COLORS.WHITE}
				/>
			</CanvasObjectGroup>
		</FooterPageFrame>
	);
});
