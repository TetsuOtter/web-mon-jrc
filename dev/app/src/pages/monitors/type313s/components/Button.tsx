import type { PropsWithChildren } from "react";
import { memo, useCallback, useEffect, useMemo } from "react";

import CanvasObjectContext from "@web-mon-jrc/canvas-renderer/contexts/CanvasObjectContext";
import {
	usePixiObject,
	clearContainer,
} from "@web-mon-jrc/canvas-renderer/hooks/usePixiObject";
import { Sprite, Texture } from "pixi.js";

import { RGB_COLORS } from "../constants";

import { getButtonImage } from "./buttonImageCache";

import type { ClickEventHandler } from "@web-mon-jrc/canvas-renderer/contexts/CanvasObjectContext";
import type { RgbColor } from "@web-mon-jrc/canvas-renderer/utils/colorUtil";

export const SHADOW_WIDTH = {
	EXTRA_SMALL: 1,
	SMALL: 2,
	DEFAULT: 3,
} as const satisfies Record<string, number>;
export type ShadowWidth = (typeof SHADOW_WIDTH)[keyof typeof SHADOW_WIDTH];

export type ButtonProps = {
	readonly relX: number;
	readonly relY: number;
	readonly width: number;
	readonly height: number;
	readonly fillColor?: RgbColor;
	readonly shadowWidth?: ShadowWidth;
	readonly isShadowColored?: boolean;
	readonly onClick?: () => void;
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
		[width, height, shadowWidth, fillColor, isShadowColored],
	);

	const handleClick: ClickEventHandler = useCallback(() => {
		if (onClick) {
			onClick();
			return true;
		} else {
			return false;
		}
	}, [onClick]);

	const { container, graphicsContainer, metadata } = usePixiObject({
		relX,
		relY,
		width,
		height,
		onClick: onClick ? handleClick : undefined,
	});

	useEffect(() => {
		if (graphicsContainer.destroyed) return;
		clearContainer(graphicsContainer);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const texture = Texture.from(buttonImageData as any);
		const sprite = new Sprite(texture);
		graphicsContainer.addChild(sprite);
	}, [graphicsContainer, buttonImageData]);

	return (
		<CanvasObjectContext
			pixiContainer={container}
			metadata={metadata}
		>
			{children}
		</CanvasObjectContext>
	);
});
