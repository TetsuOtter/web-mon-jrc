import { memo, useMemo } from "react";

import {
	CanvasLine,
	CanvasRect,
	CanvasText,
} from "../../../../../../canvas-renderer";
import CanvasObjectGroup from "../../../../../../canvas-renderer/objects/CanvasObjectGroup";
import { toWide } from "../../../../../../utils/toWide";
import { COLORS, FONT_SIZE_1X } from "../../../constants";

export const PADDING_X = 8;
const SPACING_X = 4;

export const STA_NAME_COL_WIDTH = 268;
export const KM_COL_WIDTH = 352;
export const SPEED_COL_WIDTH = 124;

const FIRST_ROW_Y = 24;
const SPACING_Y = 4;
const ROW_HEIGHT = FONT_SIZE_1X;
const ROW_WIDTH =
	STA_NAME_COL_WIDTH +
	KM_COL_WIDTH +
	SPEED_COL_WIDTH +
	SPACING_X * 2 +
	PADDING_X * 2;

export const STA_NAME_COL_X = PADDING_X;
export const KM_COL_X = STA_NAME_COL_X + STA_NAME_COL_WIDTH + SPACING_X;
export const SPEED_COL_X = KM_COL_X + KM_COL_WIDTH + SPACING_X;

const STA_FROM_COL_X = STA_NAME_COL_X;
const STA_FROM_COL_WIDTH = 120;
const STA_LINE_X = STA_FROM_COL_X + STA_FROM_COL_WIDTH + 8;
const STA_LINE_Y = ROW_HEIGHT / 2 - 1;
const STA_LINE_WIDTH = 15;
const STA_TO_COL_X = STA_NAME_COL_X + 140;
const STA_TO_COL_WIDTH = STA_FROM_COL_WIDTH;

const KM_FROM_COL_X = KM_COL_X + 8;
const KM_FROM_COL_WIDTH = 160;
const KM_LINE_X = KM_FROM_COL_X + KM_FROM_COL_WIDTH;
const KM_LINE_Y = ROW_HEIGHT / 2 - 1;
const KM_LINE_WIDTH = 15;
const KM_TO_COL_X = KM_LINE_X + FONT_SIZE_1X;
const KM_TO_COL_WIDTH = KM_FROM_COL_WIDTH;

const CELL_BG_COLOR = COLORS.AQUA;

export type ReduceSpeedInfo = {
	fromSta: string | undefined;
	toSta: string | undefined;
	fromKm: number | undefined;
	toKm: number | undefined;
	speedLimit: number | undefined;
};
export const getReduceSpeedInfoKey = (info: ReduceSpeedInfo): string => {
	return `${info.fromSta}|${info.toSta}|${info.fromKm}|${info.toKm}|${
		info.speedLimit
	}`;
};

export type ReduceSpeedRowProps = {
	rowIndex: number;
} & ReduceSpeedInfo;
export default memo<ReduceSpeedRowProps>(function ReduceSpeedRow({
	rowIndex,
	fromSta,
	toSta,
	fromKm,
	toKm,
	speedLimit,
}) {
	const fromDigits = useKmDigits(fromKm);
	const toDigits = useKmDigits(toKm);
	const speedDigits = useSpeedDigits(speedLimit);
	return (
		<CanvasObjectGroup
			relX={0}
			relY={FIRST_ROW_Y + rowIndex * (ROW_HEIGHT + SPACING_Y)}
			height={ROW_HEIGHT}
			width={ROW_WIDTH}>
			<CanvasRect
				relX={STA_NAME_COL_X}
				relY={0}
				width={STA_NAME_COL_WIDTH}
				height={ROW_HEIGHT}
				fillColor={CELL_BG_COLOR}
			/>
			<CanvasRect
				relX={KM_COL_X}
				relY={0}
				width={KM_COL_WIDTH}
				height={ROW_HEIGHT}
				fillColor={CELL_BG_COLOR}
			/>
			<CanvasRect
				relX={SPEED_COL_X}
				relY={0}
				width={SPEED_COL_WIDTH}
				height={ROW_HEIGHT}
				fillColor={CELL_BG_COLOR}
			/>
			{fromSta != null && (
				<CanvasText
					relX={STA_FROM_COL_X}
					relY={0}
					maxWidthPx={STA_FROM_COL_WIDTH}
					text={fromSta}
					align="right"
					fillColor={COLORS.BLACK}
				/>
			)}
			<CanvasLine
				relX1={STA_LINE_X}
				relY1={STA_LINE_Y}
				relX2={STA_LINE_X + STA_LINE_WIDTH}
				relY2={STA_LINE_Y}
				color={COLORS.BLACK}
			/>
			{toSta != null && (
				<CanvasText
					relX={STA_TO_COL_X}
					relY={0}
					maxWidthPx={STA_TO_COL_WIDTH}
					text={toSta}
					align="right"
					fillColor={COLORS.BLACK}
				/>
			)}
			<CanvasText
				relX={KM_FROM_COL_X}
				relY={0}
				maxWidthPx={KM_FROM_COL_WIDTH}
				text={fromDigits}
				align="right"
				fillColor={COLORS.BLACK}
			/>
			<CanvasLine
				relX1={KM_LINE_X}
				relY1={KM_LINE_Y}
				relX2={KM_LINE_X + KM_LINE_WIDTH}
				relY2={KM_LINE_Y}
				color={COLORS.BLACK}
			/>
			<CanvasText
				relX={KM_TO_COL_X}
				relY={0}
				maxWidthPx={KM_TO_COL_WIDTH}
				text={toDigits}
				align="right"
				fillColor={COLORS.BLACK}
			/>
			<CanvasText
				relX={SPEED_COL_X}
				relY={0}
				maxWidthPx={SPEED_COL_WIDTH}
				text={speedDigits}
				align="right"
				fillColor={COLORS.BLACK}
			/>
		</CanvasObjectGroup>
	);
});

function useKmDigits(km: number | undefined) {
	return useMemo(() => {
		if (km == null) {
			return toWide("K   m");
		}
		const absKm = Math.abs(km);
		if (absKm >= 10000) {
			return toWide("****K***m");
		}
		const isMinus = km < 0;
		const integerPart = Math.floor(absKm) * (isMinus ? -1 : 1);
		const decimalPart = Math.floor((absKm - integerPart) * 1000);
		return toWide(`${integerPart}K${decimalPart.toString().padStart(3, "0")}m`);
	}, [km]);
}

function useSpeedDigits(speed: number | undefined) {
	return useMemo(() => {
		if (speed == null) {
			return toWide("km/h");
		}
		if (Math.abs(speed) >= 1000) {
			return toWide("***km/h");
		}
		return toWide(`${speed}km/h`);
	}, [speed]);
}
