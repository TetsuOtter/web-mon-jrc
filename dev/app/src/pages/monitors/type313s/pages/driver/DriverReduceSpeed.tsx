import { memo, useMemo } from "react";

import { CanvasLine, CanvasRect, CanvasText } from "../../../../../canvas-renderer";
import CanvasObjectGroup from "../../../../../canvas-renderer/objects/CanvasObjectGroup";
import FooterPageFrame from "../../components/FooterPageFrame";
import { COLORS, DISPLAY_WIDTH } from "../../constants";
import { PAGE_TYPES } from "../pageTypes";
import { usePageNavigationTo } from "../usePageNavigation";

import type { FooterButtonInfo } from "../../footer/FooterArea";

// Table layout constants
const TABLE_TOP = 8;
const TABLE_LEFT = 8;
const TABLE_WIDTH = DISPLAY_WIDTH - 16;
const HEADER_ROW_HEIGHT = 24;
const DATA_ROW_HEIGHT = 32;

// Column widths
const COL_NO_WIDTH = 40;
const COL_STATION_WIDTH = 120;
const COL_LOCATION_WIDTH = 120;
const COL_SPEED_WIDTH = 80;
const COL_DISTANCE_WIDTH = 100;

// Column positions
const COL_STATION_X = COL_NO_WIDTH;
const COL_LOCATION_X = COL_STATION_X + COL_STATION_WIDTH;
const COL_SPEED_X = COL_LOCATION_X + COL_LOCATION_WIDTH;
const COL_DISTANCE_X = COL_SPEED_X + COL_SPEED_WIDTH;
const COL_REASON_X = COL_DISTANCE_X + COL_DISTANCE_WIDTH;

// Sample reduce speed data
const SAMPLE_DATA: {
	no: number;
	station: string;
	location: string;
	speed: number;
	distance: string;
	reason: string;
}[] = [
	{
		no: 1,
		station: "岐阜",
		location: "10K200M",
		speed: 45,
		distance: "200M",
		reason: "工事",
	},
	{
		no: 2,
		station: "大垣",
		location: "35K500M",
		speed: 25,
		distance: "500M",
		reason: "踏切",
	},
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
					fillColor={COLORS.BLUE}
					strokeColor={COLORS.WHITE}
					strokeWidth={1}
				/>
				{/* Header text */}
				<CanvasText
					relX={4}
					relY={4}
					text="No"
					fillColor={COLORS.WHITE}
				/>
				<CanvasText
					relX={COL_STATION_X + 4}
					relY={4}
					text="最寄駅"
					fillColor={COLORS.WHITE}
				/>
				<CanvasText
					relX={COL_LOCATION_X + 4}
					relY={4}
					text="位置"
					fillColor={COLORS.WHITE}
				/>
				<CanvasText
					relX={COL_SPEED_X + 4}
					relY={4}
					text="制限"
					fillColor={COLORS.WHITE}
				/>
				<CanvasText
					relX={COL_DISTANCE_X + 4}
					relY={4}
					text="距離"
					fillColor={COLORS.WHITE}
				/>
				<CanvasText
					relX={COL_REASON_X + 4}
					relY={4}
					text="理由"
					fillColor={COLORS.WHITE}
				/>
				{/* Column separators */}
				<CanvasLine
					relX1={COL_STATION_X}
					relY1={0}
					relX2={COL_STATION_X}
					relY2={HEADER_ROW_HEIGHT}
					color={COLORS.WHITE}
					width={1}
				/>
				<CanvasLine
					relX1={COL_LOCATION_X}
					relY1={0}
					relX2={COL_LOCATION_X}
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
				<CanvasLine
					relX1={COL_DISTANCE_X}
					relY1={0}
					relX2={COL_DISTANCE_X}
					relY2={HEADER_ROW_HEIGHT}
					color={COLORS.WHITE}
					width={1}
				/>
				<CanvasLine
					relX1={COL_REASON_X}
					relY1={0}
					relX2={COL_REASON_X}
					relY2={HEADER_ROW_HEIGHT}
					color={COLORS.WHITE}
					width={1}
				/>
			</CanvasObjectGroup>

			{/* Data Rows */}
			{SAMPLE_DATA.map((item, index) => (
				<CanvasObjectGroup
					key={item.no}
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
						strokeColor={COLORS.WHITE}
						strokeWidth={1}
					/>
					{/* Row data */}
					<CanvasText
						relX={4}
						relY={8}
						text={item.no.toString()}
						fillColor={COLORS.WHITE}
					/>
					<CanvasText
						relX={COL_STATION_X + 4}
						relY={8}
						text={item.station}
						fillColor={COLORS.WHITE}
					/>
					<CanvasText
						relX={COL_LOCATION_X + 4}
						relY={8}
						text={item.location}
						fillColor={COLORS.WHITE}
					/>
					<CanvasText
						relX={COL_SPEED_X + 4}
						relY={8}
						text={`${item.speed}km/h`}
						fillColor={COLORS.YELLOW}
					/>
					<CanvasText
						relX={COL_DISTANCE_X + 4}
						relY={8}
						text={item.distance}
						fillColor={COLORS.WHITE}
					/>
					<CanvasText
						relX={COL_REASON_X + 4}
						relY={8}
						text={item.reason}
						fillColor={COLORS.WHITE}
					/>
					{/* Column separators */}
					<CanvasLine
						relX1={COL_STATION_X}
						relY1={0}
						relX2={COL_STATION_X}
						relY2={DATA_ROW_HEIGHT}
						color={COLORS.WHITE}
						width={1}
					/>
					<CanvasLine
						relX1={COL_LOCATION_X}
						relY1={0}
						relX2={COL_LOCATION_X}
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
					<CanvasLine
						relX1={COL_DISTANCE_X}
						relY1={0}
						relX2={COL_DISTANCE_X}
						relY2={DATA_ROW_HEIGHT}
						color={COLORS.WHITE}
						width={1}
					/>
					<CanvasLine
						relX1={COL_REASON_X}
						relY1={0}
						relX2={COL_REASON_X}
						relY2={DATA_ROW_HEIGHT}
						color={COLORS.WHITE}
						width={1}
					/>
				</CanvasObjectGroup>
			))}

			{/* No data message when empty */}
			{SAMPLE_DATA.length === 0 && (
				<CanvasText
					relX={TABLE_LEFT + TABLE_WIDTH / 2}
					relY={TABLE_TOP + HEADER_ROW_HEIGHT + 50}
					text="徐行情報なし"
					fillColor={COLORS.WHITE}
					align="center"
				/>
			)}
		</FooterPageFrame>
	);
});
