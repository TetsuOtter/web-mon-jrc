import { memo } from "react";

import {
	CanvasHorizontalLine,
	CanvasObjectGroup,
	CanvasVerticalLine,
} from "@web-mon-jrc/canvas-renderer/objects";

import { useAppSelectorWithParams } from "../../../../../../store/hooks";
import { createCarStateByCarIndexSelector } from "../../../../../../store/monitors/type313s/type313sSelector";
import { LEFT as TRAIN_FORMATION_LEFT } from "../../../components/car-image/TrainFormationImage";
import { WIDTH as CAR_IMAGE_WIDTH } from "../../../components/car-image/constants";
import { COLORS } from "../../../constants";

import PowerLineState from "./PowerLineState";
import {
	BUS_LINE_Y,
	LINE_WIDTH,
	PAN_LINE_HEIGHT,
	POWER_LINE_Y,
	VERTICAL_LINE_X,
} from "./constants";

const GRAPH_HEIGHT = 83;

type ThreePhaseAcLineStateGraphColProps = {
	carIndex: number;
};
export default memo<ThreePhaseAcLineStateGraphColProps>(
	function ThreePhaseAcLineStateGraphCol({ carIndex }) {
		const hasPantograph = useAppSelectorWithParams(
			hasPantographSelector,
			carIndex,
		);
		const bogieCommonState = useAppSelectorWithParams(
			bogieCommonStateSelector,
			carIndex,
		);
		const leftBogieState = useAppSelectorWithParams(
			leftBogieStateSelector,
			carIndex,
		);
		const rightBogieState = useAppSelectorWithParams(
			rightBogieStateSelector,
			carIndex,
		);

		return (
			<CanvasObjectGroup
				relX={TRAIN_FORMATION_LEFT + CAR_IMAGE_WIDTH * carIndex}
				relY={0}
				width={CAR_IMAGE_WIDTH}
				height={GRAPH_HEIGHT}
			>
				{hasPantograph && (
					<CanvasVerticalLine
						relX={VERTICAL_LINE_X}
						relY1={0}
						relY2={PAN_LINE_HEIGHT - 1}
						width={LINE_WIDTH}
						color={COLORS.WHITE}
					/>
				)}

				<CanvasHorizontalLine
					relX1={0}
					relX2={CAR_IMAGE_WIDTH - 1}
					relY={BUS_LINE_Y}
					width={LINE_WIDTH}
					color={COLORS.WHITE}
				/>

				{bogieCommonState != null && (
					<PowerLineState
						relY={POWER_LINE_Y}
						bogieState={bogieCommonState}
						leftBogieState={leftBogieState}
						rightBogieState={rightBogieState}
					/>
				)}
			</CanvasObjectGroup>
		);
	},
);

const hasPantographSelector = createCarStateByCarIndexSelector(
	(state) => state.hasLeftPantograph || state.hasRightPantograph,
);
const bogieCommonStateSelector = createCarStateByCarIndexSelector(
	(state) => state.bogieState,
);
const leftBogieStateSelector = createCarStateByCarIndexSelector(
	(state) => state.bogieState?.left,
);
const rightBogieStateSelector = createCarStateByCarIndexSelector(
	(state) => state.bogieState?.right,
);
