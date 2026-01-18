import { memo, useMemo } from "react";

import {
	CanvasLine,
	CanvasRect,
	CanvasText,
} from "../../../../../canvas-renderer";
import CanvasObjectGroup from "../../../../../canvas-renderer/objects/CanvasObjectGroup";
import FooterPageFrame from "../../components/FooterPageFrame";
import LocationLabel from "../../components/LocationLabel";
import { COLORS, DISPLAY_WIDTH } from "../../constants";
import { PAGE_TYPES } from "../pageTypes";
import { usePageNavigationTo } from "../usePageNavigation";

import type { FooterButtonInfo } from "../../footer/FooterArea";

// Table layout constants
const TABLE_TOP = 60;
const TABLE_LEFT = 20;
const TABLE_WIDTH = DISPLAY_WIDTH - 40;
const HEADER_ROW_HEIGHT = 28;
const DATA_ROW_HEIGHT = 28;

// Column widths
const COL_SECTION_WIDTH = 140;
const COL_LOCATION_START_WIDTH = 150;
const COL_LOCATION_END_WIDTH = 150;

// Column positions
const COL_LOCATION_START_X = COL_SECTION_WIDTH;
const COL_LOCATION_END_X = COL_LOCATION_START_X + COL_LOCATION_START_WIDTH;
const COL_SPEED_X = COL_LOCATION_END_X + COL_LOCATION_END_WIDTH;

// Cyan/AQUA color for table
const TABLE_BG_COLOR = COLORS.AQUA;

// Sample reduce speed data
const SAMPLE_DATA: {
	section: string;
	locationStart: string;
	locationEnd: string;
	speed: string;
}[] = [
	{
		section: "東岐子の浦",
		locationStart: "1234K567m",
		locationEnd: "1234K589m",
		speed: "50km/h",
	},
	...Array(17)
		.fill(null)
		.map(() => ({
			section: "—",
			locationStart: "K m—",
			locationEnd: "K m",
			speed: "km/h",
		})),
];

export default memo(function DriverReduceSpeed() {
	const navigateToDriverInfo = usePageNavigationTo(PAGE_TYPES["DRIVER-INFO"]);
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
				isSelected: false,
				handleClick: navigateToDriverInfo,
			},
			{
				label: "徐行情報",
				isSelected: true,
				handleClick: () => {},
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
			navigateToDriverInfo,
			navigateToMenu,
			navigateToRoomLight,
			navigateToLocationCorrection,
			navigateToConductorInfo,
		]
	);

	return (
		<FooterPageFrame footerItems={footerItems}>
			{/* Location Label */}
			<LocationLabel locationKm={0.0} />

			{/* Table Header */}
			<CanvasObjectGroup
				relX={TABLE_LEFT}
				relY={TABLE_TOP}
				width={TABLE_WIDTH}
				height={HEADER_ROW_HEIGHT}>
				{/* Header background */}
				<CanvasRect
					relX={0}
					relY={0}
					width={TABLE_WIDTH}
					height={HEADER_ROW_HEIGHT}
					fillColor={TABLE_BG_COLOR}
					strokeColor={COLORS.WHITE}
					strokeWidth={1}
				/>
				{/* Header text */}
				<CanvasText
					relX={4}
					relY={4}
					text="区間"
					fillColor={COLORS.BLACK}
				/>
				<CanvasText
					relX={COL_LOCATION_START_X + 4}
					relY={4}
					text="キロ程"
					fillColor={COLORS.BLACK}
				/>
				<CanvasText
					relX={COL_LOCATION_END_X + 4}
					relY={4}
					text="キロ程"
					fillColor={COLORS.BLACK}
				/>
				<CanvasText
					relX={COL_SPEED_X + 4}
					relY={4}
					text="徐行速度"
					fillColor={COLORS.BLACK}
				/>
				{/* Column separators */}
				<CanvasLine
					relX1={COL_LOCATION_START_X}
					relY1={0}
					relX2={COL_LOCATION_START_X}
					relY2={HEADER_ROW_HEIGHT}
					color={COLORS.WHITE}
					width={1}
				/>
				<CanvasLine
					relX1={COL_LOCATION_END_X}
					relY1={0}
					relX2={COL_LOCATION_END_X}
					relY2={HEADER_ROW_HEIGHT}
					color={COLORS.WHITE}
					width={1}
				/>
				<CanvasLine
					relX1={COL_SPEED_X}
					relY1={0}
					relX2={COL_SPEED_X}
					relY2={HEADER_ROW_HEIGHT}
					color={COLORS.WHITE}
					width={1}
				/>
			</CanvasObjectGroup>

			{/* Data Rows */}
			{SAMPLE_DATA.map((item, index) => (
				<CanvasObjectGroup
					// eslint-disable-next-line react/no-array-index-key
					key={`row-${index}`}
					relX={TABLE_LEFT}
					relY={TABLE_TOP + HEADER_ROW_HEIGHT + index * DATA_ROW_HEIGHT}
					width={TABLE_WIDTH}
					height={DATA_ROW_HEIGHT}>
					{/* Row background */}
					<CanvasRect
						relX={0}
						relY={0}
						width={TABLE_WIDTH}
						height={DATA_ROW_HEIGHT}
						fillColor={TABLE_BG_COLOR}
						strokeColor={COLORS.WHITE}
						strokeWidth={1}
					/>
					{/* Row data */}
					<CanvasText
						relX={4}
						relY={6}
						text={item.section}
						fillColor={COLORS.BLACK}
					/>
					<CanvasText
						relX={COL_LOCATION_START_X + 4}
						relY={6}
						text={item.locationStart}
						fillColor={COLORS.BLACK}
					/>
					<CanvasText
						relX={COL_LOCATION_END_X + 4}
						relY={6}
						text={item.locationEnd}
						fillColor={COLORS.BLACK}
					/>
					<CanvasText
						relX={COL_SPEED_X + 4}
						relY={6}
						text={item.speed}
						fillColor={COLORS.BLACK}
					/>
					{/* Column separators */}
					<CanvasLine
						relX1={COL_LOCATION_START_X}
						relY1={0}
						relX2={COL_LOCATION_START_X}
						relY2={DATA_ROW_HEIGHT}
						color={COLORS.WHITE}
						width={1}
					/>
					<CanvasLine
						relX1={COL_LOCATION_END_X}
						relY1={0}
						relX2={COL_LOCATION_END_X}
						relY2={DATA_ROW_HEIGHT}
						color={COLORS.WHITE}
						width={1}
					/>
					<CanvasLine
						relX1={COL_SPEED_X}
						relY1={0}
						relX2={COL_SPEED_X}
						relY2={DATA_ROW_HEIGHT}
						color={COLORS.WHITE}
						width={1}
					/>
				</CanvasObjectGroup>
			))}

			{/* Bottom instruction */}
			<CanvasText
				relX={TABLE_LEFT}
				relY={
					TABLE_TOP +
					HEADER_ROW_HEIGHT +
					SAMPLE_DATA.length * DATA_ROW_HEIGHT +
					8
				}
				text="ＩＣカード内の徐行情報を表示します。"
				fillColor={COLORS.WHITE}
			/>
		</FooterPageFrame>
	);
});
