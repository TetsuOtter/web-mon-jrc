import { memo } from "react";

import { CanvasText } from "../../../../../canvas-renderer";
import CanvasRoundedRect from "../../../../../canvas-renderer/objects/CanvasRoundedRect";
import FooterPageFrame from "../../components/FooterPageFrame";
import {
	COLORS,
	DISPLAY_WIDTH,
	FONT_SIZE_1X,
	WITH_FOOTER_CONTENT_HEIGHT,
} from "../../constants";
import { useDriverPageMode } from "../../hooks/usePageMode";

import ReduceSpeedRow, {
	KM_COL_WIDTH,
	KM_COL_X,
	SPEED_COL_WIDTH,
	SPEED_COL_X,
	STA_NAME_COL_WIDTH,
	STA_NAME_COL_X,
} from "./components/ReduceSpeedRow";
import { REDUCE_SPEED_FOOTER_MENU } from "./constants";

import type { ReduceSpeedInfo } from "./components/ReduceSpeedRow";

// Table layout constants
const TABLE_TOP = 16;
const TABLE_LEFT = 16;
const TABLE_WIDTH = DISPLAY_WIDTH - TABLE_LEFT * 2;
const TABLE_HEIGHT = WITH_FOOTER_CONTENT_HEIGHT - TABLE_TOP - FONT_SIZE_1X * 2;
const TABLE_RADIUS = 10;

const HEADER_Y = 4;

const INSTRUCTION_X = 10;
const INSTRUCTION_Y = WITH_FOOTER_CONTENT_HEIGHT - FONT_SIZE_1X * 1.5;

const LIMIT_ROW_COUNT = 22;

const TABLE_BG_COLOR = COLORS.BLUE;

export default memo(function DriverReduceSpeed() {
	const mode = useDriverPageMode();
	return (
		<FooterPageFrame
			mode={mode}
			footerItems={REDUCE_SPEED_FOOTER_MENU}>
			<CanvasRoundedRect
				relX={TABLE_LEFT}
				relY={TABLE_TOP}
				width={TABLE_WIDTH}
				height={TABLE_HEIGHT}
				radius={TABLE_RADIUS}
				fillColor={TABLE_BG_COLOR}>
				<CanvasText
					key="header-sta"
					relX={STA_NAME_COL_X}
					relY={HEADER_Y}
					maxWidthPx={STA_NAME_COL_WIDTH}
					text="区間"
					align="center"
					fillColor={COLORS.WHITE}
				/>
				<CanvasText
					key="header-km"
					relX={KM_COL_X}
					relY={HEADER_Y}
					maxWidthPx={KM_COL_WIDTH}
					text="キロ程"
					align="center"
					fillColor={COLORS.WHITE}
				/>
				<CanvasText
					key="header-speed"
					relX={SPEED_COL_X}
					relY={HEADER_Y}
					maxWidthPx={SPEED_COL_WIDTH}
					text="徐行速度"
					align="center"
					fillColor={COLORS.WHITE}
				/>
				{Array.from({ length: LIMIT_ROW_COUNT }).map((_, i) => (
					<ReduceSpeedRow
						// eslint-disable-next-line react/no-array-index-key
						key={i}
						rowIndex={i}
						fromSta={REDUCE_SPEED_DEMO_DATA[i]?.fromSta}
						toSta={REDUCE_SPEED_DEMO_DATA[i]?.toSta}
						fromKm={REDUCE_SPEED_DEMO_DATA[i]?.fromKm}
						toKm={REDUCE_SPEED_DEMO_DATA[i]?.toKm}
						speedLimit={REDUCE_SPEED_DEMO_DATA[i]?.speedLimit}
					/>
				))}
			</CanvasRoundedRect>
			<CanvasText
				relX={INSTRUCTION_X}
				relY={INSTRUCTION_Y}
				text="ＩＣカード内の徐行情報を表示します。"
				fillColor={COLORS.WHITE}
			/>
		</FooterPageFrame>
	);
});

const REDUCE_SPEED_DEMO_DATA = [
	{
		fromSta: "大垣",
		toSta: "米原",
		fromKm: 1234.567,
		toKm: 10,
		speedLimit: 40,
	},
] as const satisfies ReduceSpeedInfo[];
