import { memo, useMemo } from "react";

import { CanvasRect, CanvasText } from "../../../../../canvas-renderer";
import CanvasObjectGroup from "../../../../../canvas-renderer/objects/CanvasObjectGroup";
import FooterPageFrame from "../../components/FooterPageFrame";
import LocationLabel from "../../components/LocationLabel";
import TrainFormationImage from "../../components/car-image/TrainFormationImage";
import { COLORS, FONT_SIZE_1X } from "../../constants";
import { useConductorPageMode } from "../../hooks/usePageMode";
import { PAGE_TYPES } from "../pageTypes";
import { usePageNavigationTo } from "../usePageNavigation";

import type { FooterButtonInfo } from "../../footer/FooterArea";

// Layout constants
const STATE_AREA_TOP = 120;
const STATE_AREA_LEFT = 8;
const STATE_AREA_WIDTH = 180;
const STATE_AREA_HEIGHT = 80;
const STATE_AREA_GAP = 8;

const ROOM_LIGHT_TOP = 332;
const GUIDE_TOP = 380;
const INSTRUCTION_TOP = 450;

// Door state for each car
type DoorState = "開" | "閉";

export default memo(function ConductorInfo() {
	const mode = useConductorPageMode();
	const navigateToMenu = usePageNavigationTo(PAGE_TYPES.MENU);
	const navigateToDriverInfo = usePageNavigationTo(PAGE_TYPES.DRIVER_INFO, {
		mode: "DRIVER",
	});
	const navigateToService = usePageNavigationTo(PAGE_TYPES.CONDUCTOR_SERVICE, {
		mode: "CONDUCTOR",
	});
	const navigateToAirCond = usePageNavigationTo(PAGE_TYPES.CONDUCTOR_AIR_COND, {
		mode: "CONDUCTOR",
	});
	const navigateToLocationCorrection = usePageNavigationTo(
		PAGE_TYPES.CONDUCTOR_LOCATION_CORRECTION,
		{ mode: "CONDUCTOR" }
	);

	const footerItems: FooterButtonInfo[] = useMemo(
		() => [
			{
				label: "車掌",
				isSelected: true,
				handleClick: () => {},
			},
			{
				label: "サービス",
				isSelected: false,
				handleClick: navigateToService,
			},
			{
				label: "空調制御",
				isSelected: false,
				handleClick: navigateToAirCond,
			},
			{
				label: "位置補正",
				isSelected: false,
				handleClick: navigateToLocationCorrection,
			},
			{
				label: "運転士",
				isSelected: false,
				handleClick: navigateToDriverInfo,
			},
			{
				label: "メニュー",
				isSelected: false,
				handleClick: navigateToMenu,
			},
		],
		[
			navigateToMenu,
			navigateToDriverInfo,
			navigateToService,
			navigateToAirCond,
			navigateToLocationCorrection,
		]
	);

	// Sample door states
	const doorStates: DoorState[] = ["閉", "閉", "閉", "閉"];

	const doorList: Array<{ id: number; state: DoorState }> = doorStates.map(
		(state, index) => ({
			id: index,
			state,
		})
	);

	return (
		<FooterPageFrame
			mode={mode}
			footerItems={footerItems}>
			{/* Location Label */}
			<LocationLabel locationKm={123.4} />

			{/* Train Formation Image */}
			<TrainFormationImage />

			{/* Door State Area */}
			<CanvasObjectGroup
				relX={STATE_AREA_LEFT}
				relY={STATE_AREA_TOP}
				width={STATE_AREA_WIDTH}
				height={STATE_AREA_HEIGHT}>
				<CanvasRect
					relX={0}
					relY={0}
					width={STATE_AREA_WIDTH}
					height={FONT_SIZE_1X + 4}
					fillColor={COLORS.BLUE}
					strokeColor={COLORS.WHITE}
					strokeWidth={1}
				/>
				<CanvasText
					relX={4}
					relY={2}
					text="ドア状態"
					fillColor={COLORS.WHITE}
				/>
				{doorList.map((door) => (
					<CanvasObjectGroup
						key={door.id}
						relX={4 + door.id * 44}
						relY={FONT_SIZE_1X + 8}
						width={40}
						height={FONT_SIZE_1X + 4}>
						<CanvasText
							relX={0}
							relY={0}
							maxWidthPx={40}
							text={`${door.id + 1}号`}
							fillColor={COLORS.WHITE}
							align="center"
						/>
						<CanvasRect
							relX={0}
							relY={FONT_SIZE_1X + 4}
							width={40}
							height={FONT_SIZE_1X + 4}
							fillColor={door.state === "開" ? COLORS.RED : COLORS.LIME}
						/>
						<CanvasText
							relX={0}
							relY={FONT_SIZE_1X + 6}
							maxWidthPx={40}
							text={door.state}
							fillColor={COLORS.BLACK}
							align="center"
						/>
					</CanvasObjectGroup>
				))}
			</CanvasObjectGroup>

			{/* Air Conditioning State Area */}
			<CanvasObjectGroup
				relX={STATE_AREA_LEFT + STATE_AREA_WIDTH + STATE_AREA_GAP}
				relY={STATE_AREA_TOP}
				width={STATE_AREA_WIDTH}
				height={STATE_AREA_HEIGHT}>
				<CanvasRect
					relX={0}
					relY={0}
					width={STATE_AREA_WIDTH}
					height={FONT_SIZE_1X + 4}
					fillColor={COLORS.BLUE}
					strokeColor={COLORS.WHITE}
					strokeWidth={1}
				/>
				<CanvasText
					relX={4}
					relY={2}
					text="空調状態"
					fillColor={COLORS.WHITE}
				/>
				<CanvasText
					relX={4}
					relY={FONT_SIZE_1X + 12}
					text="冷房運転中"
					fillColor={COLORS.LIME}
				/>
				<CanvasText
					relX={4}
					relY={FONT_SIZE_1X * 2 + 16}
					text="設定温度: 26°C"
					fillColor={COLORS.WHITE}
				/>
			</CanvasObjectGroup>

			{/* Announcement State Area */}
			<CanvasObjectGroup
				relX={STATE_AREA_LEFT + (STATE_AREA_WIDTH + STATE_AREA_GAP) * 2}
				relY={STATE_AREA_TOP}
				width={STATE_AREA_WIDTH}
				height={STATE_AREA_HEIGHT}>
				<CanvasRect
					relX={0}
					relY={0}
					width={STATE_AREA_WIDTH}
					height={FONT_SIZE_1X + 4}
					fillColor={COLORS.BLUE}
					strokeColor={COLORS.WHITE}
					strokeWidth={1}
				/>
				<CanvasText
					relX={4}
					relY={2}
					text="案内放送"
					fillColor={COLORS.WHITE}
				/>
				<CanvasText
					relX={4}
					relY={FONT_SIZE_1X + 12}
					text="自動放送: ON"
					fillColor={COLORS.LIME}
				/>
			</CanvasObjectGroup>

			{/* Room Light Section */}
			<CanvasObjectGroup
				relX={STATE_AREA_LEFT}
				relY={ROOM_LIGHT_TOP}
				width={200}
				height={FONT_SIZE_1X + 8}>
				<CanvasText
					relX={0}
					relY={4}
					text="室内灯"
					fillColor={COLORS.WHITE}
				/>
				<CanvasRect
					relX={80}
					relY={0}
					width={40}
					height={FONT_SIZE_1X + 8}
					fillColor={COLORS.YELLOW}
				/>
				<CanvasText
					relX={80}
					relY={4}
					maxWidthPx={40}
					text="入"
					fillColor={COLORS.BLACK}
					align="center"
				/>
			</CanvasObjectGroup>

			{/* Guide Display Section */}
			<CanvasObjectGroup
				relX={STATE_AREA_LEFT}
				relY={GUIDE_TOP}
				width={300}
				height={FONT_SIZE_1X + 8}>
				<CanvasText
					relX={0}
					relY={4}
					text="車内案内・自動放送"
					fillColor={COLORS.WHITE}
				/>
				<CanvasRect
					relX={160}
					relY={0}
					width={40}
					height={FONT_SIZE_1X + 8}
					fillColor={COLORS.YELLOW}
				/>
				<CanvasText
					relX={160}
					relY={4}
					maxWidthPx={40}
					text="入"
					fillColor={COLORS.BLACK}
					align="center"
				/>
			</CanvasObjectGroup>

			{/* Instruction Text */}
			<CanvasText
				relX={STATE_AREA_LEFT}
				relY={INSTRUCTION_TOP}
				text="サービス機器のスイッチ扱いは「空調制御」または「サービス」キーを押して下さい"
				fillColor={COLORS.WHITE}
			/>
		</FooterPageFrame>
	);
});
