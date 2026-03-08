import { memo } from "react";

import {
	CanvasCircle,
	CanvasLine,
	CanvasObjectGroup,
	CanvasText,
} from "@web-mon-jrc/canvas-renderer/objects";

import { WIDTH as CAR_IMAGE_WIDTH } from "../../../components/car-image/constants";
import { COLORS } from "../../../constants";

import VerticalLineSwitchState from "./VerticalLineSwitchState";
import {
	LINE_WIDTH,
	SIV_LINE_STATE_HEIGHT,
	IVMS_Y,
	IVHB_Y,
	IVL_Y,
	SIV_Y,
	SIV_RADIUS,
	MK_Y,
	VERTICAL_LINE_X,
} from "./constants";

import type { Type313sSIVLineState } from "../../../../../../store/monitors/type313s/type313sTypes";

type SIVLineStateProps = {
	relY: number;
	lineState: Pick<
		Type313sSIVLineState,
		"isIvMSOn" | "isIvHBOn" | "isIvLOn" | "isSIVOn" | "is3phMKOn"
	>;
};
export default memo<SIVLineStateProps>(
	function SIVLineState({ relY, lineState }) {
		const { isIvMSOn, isIvHBOn, isIvLOn, isSIVOn, is3phMKOn } = lineState;
		return (
			<CanvasObjectGroup
				relX={0}
				relY={relY}
				width={CAR_IMAGE_WIDTH}
				height={SIV_LINE_STATE_HEIGHT}
			>
				<CanvasLine
					relX1={VERTICAL_LINE_X}
					relX2={VERTICAL_LINE_X}
					relY1={0}
					relY2={SIV_LINE_STATE_HEIGHT - 1}
					width={LINE_WIDTH}
					color={COLORS.WHITE}
				/>
				<VerticalLineSwitchState
					relY={IVMS_Y}
					isOn={isIvMSOn}
				/>
				<VerticalLineSwitchState
					relY={IVHB_Y}
					isOn={isIvHBOn}
				/>
				<VerticalLineSwitchState
					relY={IVL_Y}
					isOn={isIvLOn}
				/>
				<CanvasCircle
					centerRelX={CAR_IMAGE_WIDTH / 2}
					centerRelY={SIV_Y + SIV_RADIUS}
					radius={SIV_RADIUS}
					fillColor={isSIVOn ? COLORS.YELLOW : COLORS.BLACK}
					strokeColor={COLORS.WHITE}
					strokeWidth={1}
				>
					<CanvasText
						text="SIV"
						fillColor={isSIVOn ? COLORS.BLACK : COLORS.WHITE}
						relX={0}
						relY={0}
						align="center"
						verticalAlign="center"
					/>
				</CanvasCircle>
				<VerticalLineSwitchState
					relY={MK_Y}
					isOn={is3phMKOn}
				/>
			</CanvasObjectGroup>
		);
	},
	(prev, next) =>
		prev.relY === next.relY &&
		isSVFLineStateForComponentEquals(prev.lineState, next.lineState),
);

function isSVFLineStateForComponentEquals(
	prev: SIVLineStateProps["lineState"],
	next: SIVLineStateProps["lineState"],
) {
	return (
		prev.isIvMSOn === next.isIvMSOn &&
		prev.isIvHBOn === next.isIvHBOn &&
		prev.isIvLOn === next.isIvLOn &&
		prev.isSIVOn === next.isSIVOn &&
		prev.is3phMKOn === next.is3phMKOn
	);
}
