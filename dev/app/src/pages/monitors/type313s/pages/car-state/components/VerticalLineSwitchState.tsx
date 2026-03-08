import { memo } from "react";

import {
	CanvasHorizontalLine,
	CanvasObjectGroup,
	CanvasRect,
} from "@web-mon-jrc/canvas-renderer/objects";

import { WIDTH as CAR_IMAGE_WIDTH } from "../../../components/car-image/constants";
import { COLORS } from "../../../constants";

const LINE_WIDTH = 10;
export const HEIGHT = 6;

const SWITCH_STATE_HEIGHT = HEIGHT - 2;
const SWITCH_STATE_WIDTH = LINE_WIDTH - 4;
const SWITCH_STATE_X = (LINE_WIDTH - SWITCH_STATE_WIDTH) / 2;

export const LINE_X = (CAR_IMAGE_WIDTH - LINE_WIDTH) / 2;

type VerticalLineSwitchStateProps = {
	relX?: number;
	relY: number;
	isOn: boolean | null;
};
export default memo<VerticalLineSwitchStateProps>(
	function VerticalLineSwitchState({ isOn, relX = LINE_X, relY }) {
		return (
			<CanvasObjectGroup
				relX={relX}
				relY={relY}
				width={LINE_WIDTH}
				height={HEIGHT}
			>
				<CanvasHorizontalLine
					relX1={0}
					relX2={LINE_WIDTH - 1}
					relY={0}
					color={COLORS.WHITE}
				/>
				<CanvasRect
					relX={SWITCH_STATE_X}
					relY={1}
					width={SWITCH_STATE_WIDTH}
					height={SWITCH_STATE_HEIGHT}
					fillColor={isOn ? COLORS.LIME : COLORS.BLACK}
				/>
				<CanvasHorizontalLine
					relX1={0}
					relX2={LINE_WIDTH - 1}
					relY={HEIGHT - 1}
					color={COLORS.WHITE}
				/>
			</CanvasObjectGroup>
		);
	},
);
