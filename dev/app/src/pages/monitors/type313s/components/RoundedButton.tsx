import type { PropsWithChildren } from "react";
import { memo, useCallback, useEffect, useMemo } from "react";

import CanvasObjectContext from "@web-mon-jrc/canvas-renderer/contexts/CanvasObjectContext";
import {
	usePixiObject,
	clearContainer,
} from "@web-mon-jrc/canvas-renderer/hooks";
import { Sprite, Texture } from "pixi.js";

import {
	getRoundedButtonImage,
	QUADRANT_SIZE,
} from "./roundedButtonImageCache";

import type { ClickEventHandler } from "@web-mon-jrc/canvas-renderer/contexts/CanvasObjectContext";
import type { RgbColor } from "@web-mon-jrc/canvas-renderer/utils/colorUtil";

type RoundedButtonProps = {
	readonly relX: number;
	readonly relY: number;
	readonly width?: number;
	readonly height?: number;
	readonly fillColor: RgbColor;
	readonly onClick?: () => void;
};

export default memo<PropsWithChildren<RoundedButtonProps>>(
	function RoundedButton({
		relX,
		relY,
		width = QUADRANT_SIZE * 2,
		height = QUADRANT_SIZE * 2,
		fillColor,
		onClick,
		children,
	}) {
		const buttonImageData = useMemo(
			() => getRoundedButtonImage(width, height, fillColor),
			[width, height, fillColor],
		);

		const handleClick: ClickEventHandler = useCallback(() => {
			onClick?.();
			return true;
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
	},
);
