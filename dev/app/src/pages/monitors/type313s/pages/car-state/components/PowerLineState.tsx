import { memo } from "react";

import {
	CanvasHorizontalLine,
	CanvasObjectGroup,
	CanvasVerticalLine,
} from "@web-mon-jrc/canvas-renderer/objects";

import { WIDTH as CAR_IMAGE_WIDTH } from "../../../components/car-image/constants";
import { COLORS } from "../../../constants";

import VerticalLineSwitchState, {
	LINE_X as SW_DEFAULT_X,
} from "./VerticalLineSwitchState";
import {
	HB_Y,
	LB1_Y,
	LB23_Y,
	LINE_WIDTH,
	POWER_LINE_STATE_HEIGHT,
	VERTICAL_LINE_X,
} from "./constants";

import type {
	Type313sBogieCommonState,
	Type313sBogieState,
} from "../../../../../../store/monitors/type313s/type313sTypes";

const BRANCH_WIDTH = 10;
const BRANCH_Y = 46;

const LB2_BRANCH_SWITCH_X = SW_DEFAULT_X - BRANCH_WIDTH;
const LB3_BRANCH_SWITCH_X = SW_DEFAULT_X + BRANCH_WIDTH;
const LB2_BRANCH_LINE_X = VERTICAL_LINE_X - BRANCH_WIDTH;
const LB3_BRANCH_LINE_X = VERTICAL_LINE_X + BRANCH_WIDTH;

type PowerLineStateProps = {
	relY: number;
	bogieState: Pick<Type313sBogieCommonState, "isHBOn" | "isLB1On">;
	leftBogieState: Pick<Type313sBogieState, "isLbOn"> | undefined;
	rightBogieState: Pick<Type313sBogieState, "isLbOn"> | undefined;
};
export default memo<PowerLineStateProps>(
	function PowerLineState({
		relY,
		bogieState,
		leftBogieState,
		rightBogieState,
	}) {
		const { isHBOn, isLB1On } = bogieState;
		const isBothBogieMotored =
			leftBogieState != null && rightBogieState != null;
		const isLb2On = (leftBogieState ?? rightBogieState)?.isLbOn;
		const isLb3On = rightBogieState?.isLbOn;

		return (
			<CanvasObjectGroup
				relX={0}
				relY={relY}
				width={CAR_IMAGE_WIDTH}
				height={POWER_LINE_STATE_HEIGHT}
			>
				<CanvasVerticalLine
					relX={VERTICAL_LINE_X}
					relY1={0}
					relY2={BRANCH_Y - 1}
					width={LINE_WIDTH}
					color={COLORS.WHITE}
				/>
				<VerticalLineSwitchState
					relY={HB_Y}
					isOn={isHBOn}
				/>
				<VerticalLineSwitchState
					relY={LB1_Y}
					isOn={isLB1On}
				/>
				{isBothBogieMotored && (
					<CanvasHorizontalLine
						relX1={VERTICAL_LINE_X - BRANCH_WIDTH}
						relX2={VERTICAL_LINE_X + BRANCH_WIDTH + LINE_WIDTH}
						relY={BRANCH_Y}
						width={LINE_WIDTH}
						color={COLORS.WHITE}
					/>
				)}
				<CanvasVerticalLine
					relX={isBothBogieMotored ? LB2_BRANCH_LINE_X : VERTICAL_LINE_X}
					relY1={BRANCH_Y}
					relY2={POWER_LINE_STATE_HEIGHT - 1}
					width={LINE_WIDTH}
					color={COLORS.WHITE}
				/>
				{isBothBogieMotored && (
					<CanvasVerticalLine
						relX={LB3_BRANCH_LINE_X}
						relY1={BRANCH_Y}
						relY2={POWER_LINE_STATE_HEIGHT - 1}
						width={LINE_WIDTH}
						color={COLORS.WHITE}
					/>
				)}
				<VerticalLineSwitchState
					relX={isBothBogieMotored ? LB2_BRANCH_SWITCH_X : undefined}
					relY={LB23_Y}
					isOn={isLb2On ?? null}
				/>
				{isBothBogieMotored && (
					<VerticalLineSwitchState
						relX={LB3_BRANCH_SWITCH_X}
						relY={LB23_Y}
						isOn={isLb3On ?? null}
					/>
				)}
			</CanvasObjectGroup>
		);
	},
	(prev, next) =>
		prev.relY === next.relY &&
		isBogieCommonStateForComponentEquals(prev.bogieState, next.bogieState) &&
		isBogieStateForComponentEquals(prev.leftBogieState, next.leftBogieState) &&
		isBogieStateForComponentEquals(prev.rightBogieState, next.rightBogieState),
);

function isBogieCommonStateForComponentEquals(
	prev: PowerLineStateProps["bogieState"],
	next: PowerLineStateProps["bogieState"],
) {
	return prev.isHBOn === next.isHBOn && prev.isLB1On === next.isLB1On;
}
function isBogieStateForComponentEquals(
	prev:
		| PowerLineStateProps["leftBogieState"]
		| PowerLineStateProps["rightBogieState"],
	next:
		| PowerLineStateProps["leftBogieState"]
		| PowerLineStateProps["rightBogieState"],
) {
	if (prev === undefined || next === undefined) {
		return prev === next;
	}
	return prev.isLbOn === next.isLbOn;
}
