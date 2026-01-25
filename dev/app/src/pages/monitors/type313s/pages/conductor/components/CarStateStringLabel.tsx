import { memo } from "react";

import { CanvasRect, CanvasText } from "../../../../../../canvas-renderer";
import { useAppSelectorWithParams } from "../../../../../../store/hooks";
import { FONT_SIZE_1X } from "../../../constants";

import type { AppSelector } from "../../../../../../store/types";

export type CarStateStringLabelProps = {
	readonly relX: number;
	readonly relY: number;
	readonly carIndex: number;
	readonly fillColor?: string;
	readonly fillWidth?: number;
	readonly textColor: string;
	readonly textSelector: AppSelector<string | undefined, [carIndex: number]>;
};
export default memo<CarStateStringLabelProps>(function CarStateStringLabel({
	relX,
	relY,
	carIndex,
	fillColor,
	fillWidth,
	textColor,
	textSelector,
}) {
	const text = useAppSelectorWithParams(textSelector, carIndex);
	if (text == null) {
		return null;
	}

	if (fillColor == null) {
		return (
			<CanvasText
				relX={relX}
				relY={relY}
				text={text}
				fillColor={textColor}
			/>
		);
	}

	return (
		<CanvasRect
			relX={relX}
			relY={relY}
			width={fillWidth ?? FONT_SIZE_1X * text.length}
			height={FONT_SIZE_1X}
			fillColor={fillColor}>
			<CanvasText
				relX={0}
				relY={0}
				text={text}
				align="center"
				verticalAlign="center"
				fillColor={textColor}
			/>
		</CanvasRect>
	);
});
