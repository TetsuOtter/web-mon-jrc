import { memo, useMemo } from "react";

import {
	CanvasObjectGroup,
	CanvasRect,
	CanvasVerticalLine,
} from "@web-mon-jrc/canvas-renderer/objects";

import { useAppSelectorWithParamsAndEqualityFn } from "../../../../../../store/hooks";
import { LEFT as TRAIN_FORMATION_LEFT } from "../../../components/car-image/TrainFormationImage";
import { WIDTH as CAR_IMAGE_WIDTH } from "../../../components/car-image/constants";
import { COLORS, type ColorValue } from "../../../constants";

import type { CarStateByCarIndexSelector } from "../../../../../../store/monitors/type313s/type313sSelector";

const BAR_WIDTH = 9;
const GROUP_WIDTH = BAR_WIDTH * 4 + 1;

const LEFT_FROM_TRAIN_FORMATION = 4;

const LINE_COLOR = COLORS.WHITE;

export type ValueDef = {
	valueSelector: CarStateByCarIndexSelector<number | null | undefined, []>;
	color: ColorValue;
	maxValue: number;
};
type BarGraphProps = {
	barTop: number;
	barAreaHeight: number;
	carIndex: number;
	valueDefList: (ValueDef | undefined)[];
};
export default memo<BarGraphProps>(function BarGraph({
	barTop,
	barAreaHeight,
	carIndex,
	valueDefList,
}) {
	const valueListSelector = useMemo(
		() => valueListSelectorCreator(valueDefList),
		[valueDefList],
	);
	const valueList = useAppSelectorWithParamsAndEqualityFn(
		valueListSelector,
		isArrayEqual,
		carIndex,
	);
	return (
		<CanvasObjectGroup
			relX={
				TRAIN_FORMATION_LEFT +
				CAR_IMAGE_WIDTH * carIndex +
				LEFT_FROM_TRAIN_FORMATION
			}
			relY={barTop}
			width={GROUP_WIDTH}
			height={barAreaHeight}
		>
			{Array.from({ length: 5 }).map((_, index) => {
				const leftValue = index === 0 ? undefined : valueList[index - 1];
				const rightValue = index === 4 ? undefined : valueList[index];
				if (leftValue === undefined && rightValue === undefined) {
					return;
				}
				return (
					<CanvasVerticalLine
						// eslint-disable-next-line react/no-array-index-key
						key={`line-${index}`}
						relX={index * (BAR_WIDTH + 1)}
						relY1={0}
						relY2={barAreaHeight - 1}
						color={LINE_COLOR}
					/>
				);
			})}
			{valueDefList.map((valueDef, index) => {
				if (!valueDef || valueList[index] === undefined) {
					return null;
				}
				const value = Math.max(
					0,
					Math.min(valueList[index] ?? 0, valueDef.maxValue),
				);
				const barHeight = Math.max(
					1,
					Math.floor(barAreaHeight * (value / valueDef.maxValue)),
				);
				return (
					<CanvasRect
						// eslint-disable-next-line react/no-array-index-key
						key={`bar-${index}`}
						relX={1 + index * (BAR_WIDTH + 1)}
						relY={barAreaHeight - barHeight}
						width={BAR_WIDTH}
						height={barHeight}
						fillColor={valueDef.color}
					/>
				);
			})}
		</CanvasObjectGroup>
	);
});

const valueListSelectorCreator =
	(
		defList: BarGraphProps["valueDefList"],
	): CarStateByCarIndexSelector<(number | null | undefined)[], []> =>
	(state, carIndex) => {
		return defList.map((def) =>
			def ? def.valueSelector(state, carIndex) : null,
		);
	};
const isArrayEqual = <T,>(arr1: T[], arr2: T[]) =>
	arr1.length === arr2.length &&
	arr1.every((value, index) => value === arr2[index]);
