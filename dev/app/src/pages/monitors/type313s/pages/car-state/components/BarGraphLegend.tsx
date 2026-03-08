import { memo, useMemo } from "react";

import {
	CanvasHorizontalLine,
	CanvasObjectGroup,
	CanvasText,
	CanvasVerticalLine,
} from "@web-mon-jrc/canvas-renderer/objects";

import { COLORS, FONT_SIZE_1X } from "../../../constants";

import type { ColorValue } from "../../../constants";

const SCALE_WIDTH = 32;
const BAR_WIDTH = 23;
const WIDTH = SCALE_WIDTH * 2 + BAR_WIDTH * 4 + 5;

const LEFT_LINE_X = SCALE_WIDTH;

const BAR_AREA_TOP = FONT_SIZE_1X * 2 + 1;

const LINE_COLOR = COLORS.WHITE;

export type ScaleProps = {
	unit: string;
	color: ColorValue;
	scaleStepList: number[];
};
export type BarLabelProps = {
	label: string;
	color: ColorValue;
};
export type BarGraphLegendProps = {
	leftSideScale: ScaleProps;
	rightSideScale?: ScaleProps;
	relX: number;
	barTop: number;
	barAreaHeight: number;
	barLabelList: BarLabelProps[];
};
export default memo<BarGraphLegendProps>(function BarGraphLegend({
	leftSideScale,
	rightSideScale,
	relX,
	barTop,
	barAreaHeight,
	barLabelList,
}) {
	const groupY = barTop - BAR_AREA_TOP;
	const groupHeight = BAR_AREA_TOP + barAreaHeight;
	return (
		<CanvasObjectGroup
			relX={relX}
			relY={groupY}
			width={WIDTH}
			height={groupHeight}
		>
			<Scale
				unit={leftSideScale.unit}
				color={leftSideScale.color}
				scaleStepList={leftSideScale.scaleStepList}
				barAreaHeight={barAreaHeight}
				relX={0}
			/>
			{rightSideScale && (
				<Scale
					unit={rightSideScale.unit}
					color={rightSideScale.color}
					scaleStepList={rightSideScale.scaleStepList}
					barAreaHeight={barAreaHeight}
					relX={SCALE_WIDTH + BAR_WIDTH * 4 + 5}
				/>
			)}

			{Array.from({ length: 5 }).map((_, index) => (
				<CanvasVerticalLine
					// eslint-disable-next-line react/no-array-index-key
					key={`bar-separator-${index}`}
					relX={LEFT_LINE_X + (BAR_WIDTH + 1) * index}
					relY1={BAR_AREA_TOP}
					relY2={groupHeight - 1}
					color={LINE_COLOR}
				/>
			))}

			{barLabelList.map((barLabel, index) => (
				<CanvasText
					// eslint-disable-next-line react/no-array-index-key
					key={`bar-label-${index}`}
					relX={LEFT_LINE_X + (BAR_WIDTH + 1) * index + 3}
					relY={BAR_AREA_TOP}
					maxWidthPx={BAR_WIDTH - 3}
					maxHeightPx={barAreaHeight}
					text={barLabel.label}
					fillColor={barLabel.color}
					align="center"
					verticalAlign="center"
				/>
			))}

			<CanvasHorizontalLine
				relX1={0}
				relX2={WIDTH - 1 - (rightSideScale == null ? SCALE_WIDTH : 0)}
				relY={groupHeight - 1}
				color={LINE_COLOR}
			/>
		</CanvasObjectGroup>
	);
});

// eslint-disable-next-line react/no-multi-comp
const Scale = memo<
	ScaleProps & {
		barAreaHeight: number;
		relX: number;
	}
>(function Scale({ unit, color, scaleStepList, barAreaHeight, relX }) {
	const scaleStepHighToLowList = useMemo(
		() => [...scaleStepList].sort().reverse(),
		[scaleStepList],
	);
	const scaleRelYList = useMemo(() => {
		const maxValue = scaleStepHighToLowList[0];
		const minValue = scaleStepHighToLowList[scaleStepHighToLowList.length - 1];

		return scaleStepHighToLowList.map((scaleStep) => {
			if (maxValue === minValue) {
				return BAR_AREA_TOP + barAreaHeight / 2;
			}
			const relativePosition = (scaleStep - minValue) / (maxValue - minValue);
			return Math.round(BAR_AREA_TOP + (1 - relativePosition) * barAreaHeight);
		});
	}, [barAreaHeight, scaleStepHighToLowList]);

	return (
		<>
			<CanvasText
				relX={relX - SCALE_WIDTH / 2}
				relY={0}
				maxWidthPx={SCALE_WIDTH * 2}
				text={`(${unit})`}
				fillColor={color}
				align="center"
			/>
			{scaleStepHighToLowList
				.map((scaleStep, index) => {
					const y = scaleRelYList[index];
					const components = [
						<CanvasText
							key={`left-scale-label-${scaleStep}`}
							relX={relX}
							relY={y - FONT_SIZE_1X - 1}
							maxWidthPx={SCALE_WIDTH}
							text={`${scaleStep}`}
							fillColor={color}
							align="center"
						/>,
					];
					if (scaleStep !== 0)
						components.push(
							<CanvasHorizontalLine
								key={`left-scale-${scaleStep}`}
								relX1={relX}
								relX2={relX + SCALE_WIDTH - 1}
								relY={y}
								color={LINE_COLOR}
							/>,
						);
					return components;
				})
				.flat()}
		</>
	);
});
