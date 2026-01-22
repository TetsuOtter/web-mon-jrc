import { memo } from "react";

import { CanvasRect, CanvasText } from "../../../../../canvas-renderer";
import CanvasObjectGroup from "../../../../../canvas-renderer/objects/CanvasObjectGroup";
import FooterPageFrame from "../../components/FooterPageFrame";
import LocationLabel from "../../components/LocationLabel";
import TrainFormationImage from "../../components/car-image/TrainFormationImage";
import { BOGIE_STATE } from "../../components/car-image/bogieImageCache";
import { COLORS, FONT_SIZE_1X } from "../../constants";
import { useCarStatePageMode } from "../../hooks/usePageMode";

import type { BaseCarImageInfo } from "../../components/car-image/baseCarImageCache";
import type { CarImageBogieInfo } from "../../components/car-image/bogieImageCache";

// Layout constants
const TABLE_TOP = 120;
const TABLE_LEFT = 8;
const LABEL_COL_WIDTH = 80;
const CAR_COL_WIDTH = 48;
const ROW_HEIGHT = FONT_SIZE_1X + 2;

// Switch types for page 1
const SWITCH_TYPES = [
	"SIV",
	"CP",
	"元溜圧力",
	"VVVFa",
	"VVVFb",
	"EB",
	"主幹",
	"逆転",
	"BC圧",
	"MR圧",
	"ATC",
	"TASC",
];

// Sample train formation (4 cars)
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

// Sample switch states for each car
type SwitchState = "ON" | "OFF" | "ERROR" | "NA";
const SAMPLE_SWITCH_STATES: Record<string, SwitchState[]> = {
	SIV: ["ON", "OFF", "ON", "OFF"],
	CP: ["ON", "ON", "ON", "ON"],
	元溜圧力: ["ON", "ON", "ON", "ON"],
	VVVFa: ["ON", "NA", "ON", "NA"],
	VVVFb: ["ON", "NA", "ON", "NA"],
	EB: ["OFF", "OFF", "OFF", "OFF"],
	主幹: ["ON", "NA", "NA", "OFF"],
	逆転: ["ON", "NA", "NA", "OFF"],
	BC圧: ["ON", "ON", "ON", "ON"],
	MR圧: ["ON", "ON", "ON", "ON"],
	ATC: ["ON", "ON", "ON", "ON"],
	TASC: ["ON", "ON", "ON", "ON"],
};

function getStateColor(state: SwitchState): string {
	switch (state) {
		case "ON":
			return COLORS.LIME;
		case "OFF":
			return COLORS.WHITE;
		case "ERROR":
			return COLORS.RED;
		case "NA":
			return COLORS.GRAY;
	}
}

function getStateTextColor(state: SwitchState): string {
	switch (state) {
		case "ON":
		case "NA":
			return COLORS.BLACK;
		case "OFF":
			return COLORS.BLACK;
		case "ERROR":
			return COLORS.WHITE;
	}
}

export default memo(function CarStateSwitches() {
	const mode = useCarStatePageMode();
	const carCount = SAMPLE_TRAIN_FORMATION.length;
	const tableWidth = LABEL_COL_WIDTH + CAR_COL_WIDTH * carCount;

	return (
		<FooterPageFrame
			mode={mode}
			footerItems={[]}>
			{/* Location Label */}
			<LocationLabel locationKm={123.4} />

			{/* Train Formation Image */}
			<TrainFormationImage infoList={SAMPLE_TRAIN_FORMATION} />

			{/* Table Header Row */}
			<CanvasObjectGroup
				relX={TABLE_LEFT}
				relY={TABLE_TOP}
				width={tableWidth}
				height={ROW_HEIGHT}>
				<CanvasRect
					relX={0}
					relY={0}
					width={LABEL_COL_WIDTH}
					height={ROW_HEIGHT}
					fillColor={COLORS.BLUE}
					strokeColor={COLORS.LIME}
					strokeWidth={1}
				/>
				<CanvasText
					relX={4}
					relY={1}
					text="項目"
					fillColor={COLORS.WHITE}
				/>
				{SAMPLE_TRAIN_FORMATION.map((_, index) => (
					<CanvasRect
						// eslint-disable-next-line react/no-array-index-key
						key={`header-${index}`}
						relX={LABEL_COL_WIDTH + CAR_COL_WIDTH * index}
						relY={0}
						width={CAR_COL_WIDTH}
						height={ROW_HEIGHT}
						fillColor={COLORS.BLUE}
						strokeColor={COLORS.LIME}
						strokeWidth={1}
					/>
				))}
				{SAMPLE_TRAIN_FORMATION.map((_, index) => (
					<CanvasText
						// eslint-disable-next-line react/no-array-index-key
						key={`header-text-${index}`}
						relX={LABEL_COL_WIDTH + CAR_COL_WIDTH * index}
						relY={1}
						maxWidthPx={CAR_COL_WIDTH}
						text={`${index + 1}号車`}
						fillColor={COLORS.WHITE}
						align="center"
					/>
				))}
			</CanvasObjectGroup>

			{/* Table Data Rows */}
			{SWITCH_TYPES.map((switchType, rowIndex) => (
				<CanvasObjectGroup
					key={switchType}
					relX={TABLE_LEFT}
					relY={TABLE_TOP + ROW_HEIGHT * (rowIndex + 1)}
					width={tableWidth}
					height={ROW_HEIGHT}>
					{/* Row label */}
					<CanvasRect
						relX={0}
						relY={0}
						width={LABEL_COL_WIDTH}
						height={ROW_HEIGHT}
						strokeColor={COLORS.LIME}
						strokeWidth={1}
					/>
					<CanvasText
						relX={4}
						relY={1}
						text={switchType}
						fillColor={COLORS.WHITE}
					/>

					{/* State cells for each car */}
					{SAMPLE_TRAIN_FORMATION.map((_, carIndex) => {
						const state = SAMPLE_SWITCH_STATES[switchType]?.[carIndex] ?? "NA";
						return (
							<CanvasRect
								// eslint-disable-next-line react/no-array-index-key
								key={`cell-${carIndex}`}
								relX={LABEL_COL_WIDTH + CAR_COL_WIDTH * carIndex}
								relY={0}
								width={CAR_COL_WIDTH}
								height={ROW_HEIGHT}
								fillColor={getStateColor(state)}
								strokeColor={COLORS.LIME}
								strokeWidth={1}
							/>
						);
					})}
					{SAMPLE_TRAIN_FORMATION.map((_, carIndex) => {
						const state = SAMPLE_SWITCH_STATES[switchType]?.[carIndex] ?? "NA";
						const displayText =
							state === "NA" ? "-" : state === "ERROR" ? "異常" : state;
						return (
							<CanvasText
								// eslint-disable-next-line react/no-array-index-key
								key={`text-${carIndex}`}
								relX={LABEL_COL_WIDTH + CAR_COL_WIDTH * carIndex}
								relY={1}
								maxWidthPx={CAR_COL_WIDTH}
								text={displayText}
								fillColor={getStateTextColor(state)}
								align="center"
							/>
						);
					})}
				</CanvasObjectGroup>
			))}
		</FooterPageFrame>
	);
});
