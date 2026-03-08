import { memo, useMemo } from "react";

import { CanvasHorizontalLine, CanvasText } from "@web-mon-jrc/canvas-renderer";
import CanvasObjectGroup from "@web-mon-jrc/canvas-renderer/objects/CanvasObjectGroup";

import { useAppSelector } from "../../../../store/hooks";
import { currentLocationSelector } from "../../../../store/monitors/type313s/type313sSelector";
import { COLORS, FONT_SIZE_1X, FONT_SIZE_2X } from "../constants";

const WIDTH = 210;
const HEIGHT = 40;
const X = 4;
const Y = 4;

const LINE_X = FONT_SIZE_1X * 3 + 1;
const LINE_THICKNESS = 1;
const LINE_WIDTH = WIDTH - LINE_X;
const LINE_Y = HEIGHT - 1;
const NUMBER_BOTTOM = 4;
const UNIT_RIGHT = 6;

export default memo(function LocationLabel() {
	const locationKm = useAppSelector(currentLocationSelector);
	const displayText = useMemo(() => {
		const integerValue = Math.floor(locationKm);
		const decimalValue = Math.abs(Math.round((locationKm - integerValue) * 10));
		let integerStr = integerValue.toString();
		let decimalStr = decimalValue.toString();

		if (locationKm <= -1000 || 10000 <= locationKm) {
			integerStr = "****";
			decimalStr = "*";
		}

		return `${integerStr}.${decimalStr}`;
	}, [locationKm]);

	return (
		<CanvasObjectGroup
			relX={X}
			relY={Y}
			width={WIDTH}
			height={HEIGHT}
		>
			<CanvasText
				relX={0}
				relY={0}
				text="キロ程"
				fillColor={COLORS.WHITE}
			/>

			<CanvasHorizontalLine
				relX1={LINE_X}
				relX2={LINE_X + LINE_WIDTH}
				relY={LINE_Y}
				color={COLORS.WHITE}
				width={LINE_THICKNESS}
			/>

			<CanvasText
				relX={LINE_X}
				relY={HEIGHT - NUMBER_BOTTOM - FONT_SIZE_2X}
				maxWidthPx={WIDTH - LINE_X - UNIT_RIGHT - FONT_SIZE_2X}
				text={displayText}
				fillColor={COLORS.WHITE}
				align="right"
				scaleX={2}
				scaleY={2}
			/>

			<CanvasText
				relX={WIDTH - UNIT_RIGHT - FONT_SIZE_2X}
				relY={HEIGHT - NUMBER_BOTTOM - FONT_SIZE_2X}
				text="km"
				fillColor={COLORS.WHITE}
				scaleX={2}
				scaleY={2}
			/>
		</CanvasObjectGroup>
	);
});
