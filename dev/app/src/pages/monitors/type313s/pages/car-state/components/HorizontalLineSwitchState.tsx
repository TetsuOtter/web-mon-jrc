import { memo } from "react";

import {
	CanvasLine,
	CanvasObjectGroup,
	CanvasRect,
} from "@web-mon-jrc/canvas-renderer/objects";

import { COLORS } from "../../../constants";

const LINE_HEIGHT = 10;
const WIDTH = 6;

const SWITCH_STATE_WIDTH = WIDTH - 2;
const SWITCH_STATE_HEIGHT = LINE_HEIGHT - 4;
const SWITCH_STATE_Y = (LINE_HEIGHT - SWITCH_STATE_HEIGHT) / 2;

type HorizontalLineSwitchStateProps = {
	relX: number;
	lineY: number;
	isOn: boolean | null;
};
export default memo<HorizontalLineSwitchStateProps>(
	function HorizontalLineSwitchState({ isOn, relX, lineY }) {
		return (
			<CanvasObjectGroup
				relX={relX}
				relY={lineY - LINE_HEIGHT / 2}
				width={WIDTH}
				height={LINE_HEIGHT}
			>
				<CanvasLine
					relX1={0}
					relX2={0}
					relY1={0}
					relY2={LINE_HEIGHT - 1}
					color={COLORS.WHITE}
				/>
				<CanvasRect
					relX={1}
					relY={SWITCH_STATE_Y}
					width={SWITCH_STATE_WIDTH}
					height={SWITCH_STATE_HEIGHT}
					fillColor={isOn ? COLORS.LIME : COLORS.BLACK}
				/>
				<CanvasLine
					relX1={WIDTH - 1}
					relX2={WIDTH - 1}
					relY1={0}
					relY2={LINE_HEIGHT - 1}
					color={COLORS.WHITE}
				/>
			</CanvasObjectGroup>
		);
	},
);
