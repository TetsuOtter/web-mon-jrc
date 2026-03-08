import { memo } from "react";

import {
	CanvasLine,
	CanvasObjectGroup,
} from "@web-mon-jrc/canvas-renderer/objects";

import { useAppSelectorWithParams } from "../../../../../../store/hooks";
import { createCarStateByCarIndexSelector } from "../../../../../../store/monitors/type313s/type313sSelector";
import { LEFT as TRAIN_FORMATION_LEFT } from "../../../components/car-image/TrainFormationImage";
import { WIDTH as CAR_IMAGE_WIDTH } from "../../../components/car-image/constants";
import { COLORS } from "../../../constants";

import HorizontalLineSwitchState from "./HorizontalLineSwitchState";
import SIVLineState from "./SIVLineState";
import {
	LINE_WIDTH,
	BUS_LINE_Y,
	PAN_LINE_HEIGHT,
	SIV_LINE_Y,
	TLK_LINE_Y,
} from "./constants";

const GRAPH_HEIGHT = 173;

const VERTICAL_LINE_X = (CAR_IMAGE_WIDTH - LINE_WIDTH) / 2;

type ThreePhaseAcLineStateGraphColProps = {
	carIndex: number;
};
export default memo<ThreePhaseAcLineStateGraphColProps>(
	function ThreePhaseAcLineStateGraphCol({ carIndex }) {
		const hasPantograph = useAppSelectorWithParams(
			hasPantographSelector,
			carIndex,
		);
		const sivLineState = useAppSelectorWithParams(
			sivLineStateSelector,
			carIndex,
		);
		const cabSide = useAppSelectorWithParams(cabSideSelector, carIndex);
		const isTLKOn = useAppSelectorWithParams(isTLKOnStateSelector, carIndex);

		return (
			<CanvasObjectGroup
				relX={TRAIN_FORMATION_LEFT + CAR_IMAGE_WIDTH * carIndex}
				relY={0}
				width={CAR_IMAGE_WIDTH}
				height={GRAPH_HEIGHT}
			>
				{hasPantograph && (
					<CanvasLine
						relX1={VERTICAL_LINE_X}
						relX2={VERTICAL_LINE_X}
						relY1={0}
						relY2={PAN_LINE_HEIGHT - 1}
						width={LINE_WIDTH}
						color={COLORS.WHITE}
					/>
				)}

				<CanvasLine
					relX1={0}
					relX2={CAR_IMAGE_WIDTH - 1}
					relY1={BUS_LINE_Y}
					relY2={BUS_LINE_Y}
					width={LINE_WIDTH}
					color={COLORS.WHITE}
				/>

				{sivLineState != null && (
					<SIVLineState
						relY={SIV_LINE_Y}
						lineState={sivLineState}
					/>
				)}

				<CanvasLine
					relX1={0}
					relX2={CAR_IMAGE_WIDTH - 1}
					relY1={TLK_LINE_Y}
					relY2={TLK_LINE_Y}
					width={LINE_WIDTH}
					color={COLORS.WHITE}
				/>
				{cabSide != null && (
					<HorizontalLineSwitchState
						relX={cabSide === "left" ? 3 : CAR_IMAGE_WIDTH - 9}
						lineY={TLK_LINE_Y + LINE_WIDTH / 2}
						isOn={isTLKOn ?? null}
					/>
				)}
			</CanvasObjectGroup>
		);
	},
);

const hasPantographSelector = createCarStateByCarIndexSelector(
	(state) => state.hasLeftPantograph || state.hasRightPantograph,
);
const sivLineStateSelector = createCarStateByCarIndexSelector(
	(state) => state.carStates.sivLineState,
);
const isTLKOnStateSelector = createCarStateByCarIndexSelector(
	(state) => state.cabState?.isTLKOn,
);
const cabSideSelector = createCarStateByCarIndexSelector(
	(state) => state.cabState?.side,
);
