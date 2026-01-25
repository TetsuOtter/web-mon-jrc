import { memo } from "react";

import { CanvasRect, CanvasText } from "../../../../../../canvas-renderer";
import { useAppSelectorWithParams } from "../../../../../../store/hooks";
import { WIDTH as CAR_IMAGE_WIDTH } from "../../../components/car-image/constants";
import { COLORS } from "../../../constants";

import type { AppSelector } from "../../../../../../store/types";

const PADDING_X = 2;
const RECT_WIDTH = CAR_IMAGE_WIDTH - PADDING_X * 2;
const RECT_HEIGHT = 21;

export type LabelStyle = {
	text: string;
	fillColor: string;
	textColor: string;
};
export type CarStateLabelProps<T extends string | number | symbol> = {
	readonly relX: number;
	readonly relY: number;
	readonly carIndex: number;
	readonly styleMap: Record<T, LabelStyle>;
	readonly stateSelector: AppSelector<T, [carIndex: number]>;
};
const CarStateLabel = <T extends string | number | symbol>({
	relX,
	relY,
	carIndex,
	styleMap,
	stateSelector,
}: CarStateLabelProps<T>) => {
	const state = useAppSelectorWithParams(stateSelector, carIndex);
	const labelStyle = styleMap[state];
	if (labelStyle == null) {
		return null;
	}

	return (
		<CanvasRect
			relX={relX + PADDING_X}
			relY={relY}
			width={RECT_WIDTH}
			height={RECT_HEIGHT}
			strokeColor={COLORS.WHITE}
			strokeWidth={1}
			fillColor={labelStyle.fillColor}>
			<CanvasText
				relX={0}
				relY={0}
				text={labelStyle.text}
				align="center"
				verticalAlign="center"
				fillColor={labelStyle.textColor}
			/>
		</CanvasRect>
	);
};

export default memo(CarStateLabel) as typeof CarStateLabel;
