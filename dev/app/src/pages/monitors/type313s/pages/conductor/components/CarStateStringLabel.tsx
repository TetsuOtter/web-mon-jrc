import { memo } from "react";

import { CanvasRect, CanvasText } from "@web-mon-jrc/canvas-renderer";

import { useAppSelectorWithParams } from "../../../../../../store/hooks";
import { FONT_SIZE_1X } from "../../../constants";

import type { CarStateByCarIndexSelector } from "../../../../../../store/monitors/type313s/type313sSelector";
import type { CanvasTextProps } from "@web-mon-jrc/canvas-renderer/objects/CanvasText";

export type CarStateStringLabelProps = {
	readonly relX: number;
	readonly relY: number;
	readonly carIndex: number;
	readonly fillColor?: string;
	readonly fillWidth?: number;
	readonly align?: CanvasTextProps["align"];
	readonly verticalAlign?: CanvasTextProps["verticalAlign"];
	readonly textColor: string;
	readonly textSelector: CarStateByCarIndexSelector<string | undefined, []>;
	readonly scaleX?: number;
	readonly scaleY?: number;
};
export default memo<CarStateStringLabelProps>(function CarStateStringLabel({
	relX,
	relY,
	carIndex,
	fillColor,
	fillWidth,
	align,
	verticalAlign,
	textColor,
	textSelector,
	scaleX,
	scaleY,
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
				align={align}
				maxWidthPx={fillWidth}
				verticalAlign={verticalAlign}
				fillColor={textColor}
				scaleX={scaleX}
				scaleY={scaleY}
			/>
		);
	}

	return (
		<CanvasRect
			relX={relX}
			relY={relY}
			width={fillWidth ?? FONT_SIZE_1X * text.length}
			height={FONT_SIZE_1X}
			fillColor={fillColor}
		>
			<CanvasText
				relX={0}
				relY={0}
				text={text}
				align={align ?? "center"}
				verticalAlign={verticalAlign ?? "center"}
				fillColor={textColor}
				scaleX={scaleX}
				scaleY={scaleY}
			/>
		</CanvasRect>
	);
});
