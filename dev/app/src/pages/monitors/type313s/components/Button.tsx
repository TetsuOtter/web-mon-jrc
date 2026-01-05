import type { PropsWithChildren } from "react";
import { memo, useCallback, useMemo } from "react";

import CanvasObjectBase from "../../../../canvas-renderer/objects/CanvasObjectBase";
import { RGB_COLORS } from "../constants";

import { getButtonImage } from "./buttonImageCache";

import type {
	CanvasRenderFunction,
	ClickEventHandler,
} from "../../../../canvas-renderer/contexts/CanvasObjectContext";
import type { RgbColor } from "../../../../canvas-renderer/utils/colorUtil";

export const SHADOW_WIDTH = {
	EXTRA_SMALL: 1,
	SMALL: 2,
	DEFAULT: 3,
} as const satisfies Record<string, number>;
type ShadowWidth = (typeof SHADOW_WIDTH)[keyof typeof SHADOW_WIDTH];

type ButtonProps = {
	readonly relX: number;
	readonly relY: number;
	readonly width: number;
	readonly height: number;
	readonly fillColor?: RgbColor;
	readonly shadowWidth?: ShadowWidth;
	readonly isShadowColored?: boolean;
	readonly onClick?: ClickEventHandler;
};

export default memo<PropsWithChildren<ButtonProps>>(function Button({
	relX,
	relY,
	width,
	height,
	fillColor = RGB_COLORS.BLUE,
	shadowWidth = SHADOW_WIDTH.DEFAULT,
	isShadowColored = false,
	onClick,
	children,
}) {
	const buttonImageData = useMemo(
		() =>
			getButtonImage(width, height, shadowWidth, fillColor, isShadowColored),
		[width, height, shadowWidth, fillColor, isShadowColored]
	);

	const onRender: CanvasRenderFunction = useCallback(
		async (ctx, metadata) => {
			ctx.save();

			// 整数座標に丸める
			const ix = Math.round(metadata.absX);
			const iy = Math.round(metadata.absY);
			const iw = Math.round(metadata.width);
			const ih = Math.round(metadata.height);

			// ボタン画像を描画
			ctx.imageSmoothingEnabled = false;
			ctx.drawImage(buttonImageData, ix, iy, iw, ih);

			ctx.restore();
		},
		[buttonImageData]
	);

	return (
		<CanvasObjectBase
			onRender={onRender}
			onClick={onClick}
			relX={relX}
			relY={relY}
			width={width}
			height={height}
			isFilled>
			{children}
		</CanvasObjectBase>
	);
});
