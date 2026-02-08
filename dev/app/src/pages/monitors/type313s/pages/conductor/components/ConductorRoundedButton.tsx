import { memo } from "react";

import { CanvasText } from "../../../../../../canvas-renderer";
import { useAppSelectorWithParams } from "../../../../../../store/hooks";
import RoundedButton from "../../../components/RoundedButton";
import { WIDTH as CAR_IMAGE_WIDTH } from "../../../components/car-image/constants";
import { QUADRANT_SIZE } from "../../../components/roundedButtonImageCache";

import type { RgbColor } from "../../../../../../canvas-renderer/utils/colorUtil";
import type { AppSelector } from "../../../../../../store/types";

export type RoundedButtonStyle = {
	text: string;
	fillColor: RgbColor;
	textColor: string;
};
export type CarStateLabelProps<T extends string | number | symbol> = {
	readonly relX: number;
	readonly relY: number;
	readonly width?: number;
	readonly carIndex: number;
	readonly styleMap: Record<T, RoundedButtonStyle>;
	readonly stateSelector: AppSelector<T, [carIndex: number]>;
};
const CarStateLabel = <T extends string | number | symbol>({
	relX,
	relY,
	carIndex,
	styleMap,
	stateSelector,
	width = QUADRANT_SIZE * 2,
}: CarStateLabelProps<T>) => {
	const state = useAppSelectorWithParams(stateSelector, carIndex);
	const labelStyle = styleMap[state];
	if (labelStyle == null) {
		return null;
	}

	const marginX = (CAR_IMAGE_WIDTH - width) / 2;
	return (
		<RoundedButton
			relX={relX + marginX}
			relY={relY}
			width={width}
			fillColor={labelStyle.fillColor}>
			<CanvasText
				relX={0}
				relY={0}
				text={labelStyle.text}
				align="center"
				verticalAlign="center"
				fillColor={labelStyle.textColor}
			/>
		</RoundedButton>
	);
};

export default memo(CarStateLabel) as typeof CarStateLabel;
