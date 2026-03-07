import { memo, useMemo, useSyncExternalStore } from "react";

import {
	CanvasLine,
	CanvasRect,
	CanvasText,
} from "@web-mon-jrc/canvas-renderer";
import CanvasDotPattern from "@web-mon-jrc/canvas-renderer/objects/CanvasDotPattern";
import CanvasQuadrilateral from "@web-mon-jrc/canvas-renderer/objects/CanvasQuadrilateral";

import { useAppSelector } from "../../../../store/hooks";
import {
	trainNumberSelector,
	trainTypeSelector,
	destinationSelector,
	timeMsSelector,
} from "../../../../store/monitors/type313s/type313sSelector";
import {
	COLORS,
	DISPLAY_WIDTH,
	FONT_SIZE_2X,
	HEADER_HEIGHT,
} from "../constants";

import type { IconData } from "../icons";

type HeaderAreaProps = {
	icon: IconData;
	pageName: string;
};

const PAGE_ICON_SIZE = 40;
const PAGE_ICON_LEFT = 4;
const PAGE_ICON_TOP = 0;

const TEXT_TOP = Math.floor((HEADER_HEIGHT - FONT_SIZE_2X) / 2);

const PAGE_NAME_LEFT = PAGE_ICON_LEFT + PAGE_ICON_SIZE + 24;
const PAGE_NAME_WIDTH = 200;

const PAGE_NAME_TRAIN_NUMBER_SEPARATOR_X = 200;
const TRAIN_NUMBER_TRAIN_TYPE_SEPARATOR_X = 320;
const TRAIN_TYPE_TRAIN_DEST_SEPARATOR_XL_BOTTOM = 482;
const TRAIN_TYPE_TRAIN_DEST_SEPARATOR_XL_TOP =
	TRAIN_TYPE_TRAIN_DEST_SEPARATOR_XL_BOTTOM + 13;
const TRAIN_TYPE_TRAIN_DEST_SEPARATOR_XR_BOTTOM =
	TRAIN_TYPE_TRAIN_DEST_SEPARATOR_XL_BOTTOM + 25;
const TRAIN_TYPE_TRAIN_DEST_SEPARATOR_XR_TOP =
	TRAIN_TYPE_TRAIN_DEST_SEPARATOR_XR_BOTTOM + 13;
const TRAIN_DEST_TIME_SEPARATOR_X = 680;

const TRAIN_NUMBER_LR_PADDING = 8;
const TRAIN_TYPE_LEFT_PADDING = 16;
const TRAIN_DEST_LEFT_PADDING = 32;

const TRAIN_NUMBER_LEFT = 200 + TRAIN_NUMBER_LR_PADDING;
const TRAIN_NUMBER_WIDTH = 120 - TRAIN_NUMBER_LR_PADDING * 2;

const TRAIN_TYPE_LEFT = 320 + TRAIN_TYPE_LEFT_PADDING;

const TRAIN_DEST_LEFT = 520 + TRAIN_DEST_LEFT_PADDING;

const TIME_LABEL_LEFT = 680;
const TIME_LABEL_WIDTH = 100;

const LINE_WIDTH = 1;

export default memo<HeaderAreaProps>(function HeaderArea({ icon, pageName }) {
	const timeMinutes = useSyncExternalStore(
		subscribeRealMinutes,
		getRealMinutes,
	);
	const bidsTimeMs = useAppSelector(timeMsSelector);
	const timeLabel = useMemo(() => {
		const minutes =
			bidsTimeMs != null ? Math.floor(bidsTimeMs / 60000) : timeMinutes;
		const hh = Math.floor(minutes / 60) % 24;
		const mm = minutes % 60;
		return `${hh}:${mm.toString().padStart(2, "0")}`;
	}, [bidsTimeMs, timeMinutes]);

	const trainNumber = useAppSelector(trainNumberSelector);
	const trainType = useAppSelector(trainTypeSelector);
	const destination = useAppSelector(destinationSelector);

	return (
		<CanvasRect
			relX={0}
			relY={0}
			width={DISPLAY_WIDTH}
			height={HEADER_HEIGHT}
			strokeColor="white"
			strokeWidth={1}
			fillColor={COLORS.BLUE}
		>
			<CanvasDotPattern
				image={icon}
				x={PAGE_ICON_LEFT}
				y={PAGE_ICON_TOP}
				color={COLORS.WHITE}
			/>

			<CanvasText
				relX={PAGE_NAME_LEFT}
				relY={TEXT_TOP}
				maxWidthPx={PAGE_NAME_WIDTH - PAGE_NAME_LEFT}
				text={pageName}
				fillColor={COLORS.WHITE}
				scaleY={2}
			/>

			<CanvasText
				relX={TRAIN_NUMBER_LEFT}
				relY={TEXT_TOP}
				text={trainNumber ?? "列番未設定"}
				fillColor={COLORS.WHITE}
				align="right"
				maxWidthPx={TRAIN_NUMBER_WIDTH}
				scaleY={2}
			/>

			<CanvasText
				relX={TRAIN_TYPE_LEFT}
				relY={TEXT_TOP}
				text={trainType ?? ""}
				fillColor={COLORS.WHITE}
				scaleY={2}
			/>

			<CanvasText
				relX={TRAIN_DEST_LEFT}
				relY={TEXT_TOP}
				text={destination ?? ""}
				fillColor={COLORS.WHITE}
				scaleY={2}
			/>

			<CanvasText
				relX={TIME_LABEL_LEFT}
				relY={TEXT_TOP}
				maxHeightPx={100}
				text={timeLabel}
				fillColor={COLORS.WHITE}
				align="right"
				maxWidthPx={TIME_LABEL_WIDTH}
				scaleX={2}
				scaleY={2}
			/>

			<CanvasLine
				relX1={PAGE_NAME_TRAIN_NUMBER_SEPARATOR_X}
				relX2={PAGE_NAME_TRAIN_NUMBER_SEPARATOR_X}
				relY1={0}
				relY2={HEADER_HEIGHT - 1}
				width={LINE_WIDTH}
				color={COLORS.WHITE}
			/>
			<CanvasLine
				relX1={TRAIN_NUMBER_TRAIN_TYPE_SEPARATOR_X}
				relX2={TRAIN_NUMBER_TRAIN_TYPE_SEPARATOR_X}
				relY1={0}
				relY2={HEADER_HEIGHT - 1}
				width={LINE_WIDTH}
				color={COLORS.WHITE}
			/>
			<CanvasQuadrilateral
				xL1={TRAIN_TYPE_TRAIN_DEST_SEPARATOR_XL_TOP}
				yL1={0}
				xL2={TRAIN_TYPE_TRAIN_DEST_SEPARATOR_XL_BOTTOM}
				yL2={HEADER_HEIGHT - 1}
				xR1={TRAIN_TYPE_TRAIN_DEST_SEPARATOR_XR_TOP}
				yR1={0}
				xR2={TRAIN_TYPE_TRAIN_DEST_SEPARATOR_XR_BOTTOM}
				yR2={HEADER_HEIGHT - 1}
				lineWidth={LINE_WIDTH}
				strokeColor={COLORS.WHITE}
				fillColor={COLORS.BLACK}
			/>
			<CanvasLine
				relX1={TRAIN_DEST_TIME_SEPARATOR_X}
				relX2={TRAIN_DEST_TIME_SEPARATOR_X}
				relY1={0}
				relY2={HEADER_HEIGHT - 1}
				width={LINE_WIDTH}
				color={COLORS.WHITE}
			/>
		</CanvasRect>
	);
});

const subscribeRealMinutes = (callback: () => void) => {
	const now = new Date();
	const firstCallDelay = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
	const timeoutIdHolder = {
		current: setTimeout(() => {
			callback();
			timeoutIdHolder.current = setInterval(callback, 60 * 1000);
		}, firstCallDelay),
	};
	return () => {
		clearTimeout(timeoutIdHolder.current);
	};
};
const getRealMinutes = () => {
	const now = new Date();
	return now.getHours() * 60 + now.getMinutes();
};
