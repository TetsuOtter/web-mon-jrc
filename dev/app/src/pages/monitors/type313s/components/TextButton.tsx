import { memo, useMemo } from "react";

import { CanvasText } from "@web-mon-jrc/canvas-renderer";
import { hexToRgb } from "@web-mon-jrc/canvas-renderer/utils/colorUtil";

import { COLORS } from "../constants";

import Button from "./Button";

import type { ColorValue } from "../constants";
import type { ShadowWidth } from "./Button";
import type { CanvasTextProps } from "@web-mon-jrc/canvas-renderer/objects/CanvasText";

type TextButtonProps = {
	readonly relX: number;
	readonly relY: number;
	readonly width: number;
	readonly height: number;
	readonly fillColor?: ColorValue;
	readonly shadowWidth?: ShadowWidth;
	readonly isShadowColored?: boolean;
	readonly onClick?: () => void;

	readonly text: string;
	readonly textRelX?: number;
	readonly textRelY?: number;
	readonly scaleX?: number;
	readonly scaleY?: number;
	readonly textMaxWidthPx?: number;
	readonly textHorizontalAlign?: CanvasTextProps["align"];
	readonly textVerticalAlign?: CanvasTextProps["verticalAlign"];
	readonly textFillColor?: ColorValue;
};
export default memo<TextButtonProps>(function TextButton({
	relX,
	relY,
	width,
	height,
	fillColor = COLORS.BLUE,
	shadowWidth,
	isShadowColored,
	onClick,
	text,
	textRelX = 0,
	textRelY = 0,
	scaleX,
	scaleY,
	textMaxWidthPx,
	textHorizontalAlign = "center",
	textVerticalAlign = "center",
	textFillColor,
}) {
	const fillColorRgb = useMemo(() => hexToRgb(fillColor), [fillColor]);
	return (
		<Button
			relX={relX}
			relY={relY}
			width={width}
			height={height}
			fillColor={fillColorRgb}
			shadowWidth={shadowWidth}
			isShadowColored={isShadowColored}
			onClick={onClick}>
			{text && (
				<CanvasText
					text={text}
					fillColor={textFillColor ?? TEXT_COLOR_MAP[fillColor]}
					relX={textRelX}
					relY={textRelY}
					align={textHorizontalAlign}
					verticalAlign={textVerticalAlign}
					scaleX={scaleX}
					scaleY={scaleY}
					maxWidthPx={textMaxWidthPx}
				/>
			)}
		</Button>
	);
});

const TEXT_COLOR_MAP = {
	[COLORS.BLACK]: COLORS.WHITE,
	[COLORS.WHITE]: COLORS.BLACK,
	[COLORS.RED]: COLORS.WHITE,
	[COLORS.LIME]: COLORS.BLACK,
	[COLORS.BLUE]: COLORS.WHITE,
	[COLORS.YELLOW]: COLORS.BLACK,
	[COLORS.AQUA]: COLORS.BLACK,
	[COLORS.MAGENTA]: COLORS.WHITE,

	[COLORS.GRAY]: COLORS.WHITE,
	[COLORS.CYAN]: COLORS.BLACK,
} as const satisfies Record<ColorValue, ColorValue>;
