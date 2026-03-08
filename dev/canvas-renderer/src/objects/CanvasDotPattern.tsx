import type { PropsWithChildren } from "react";
import { memo, useCallback, useEffect } from "react";

import { Texture, Sprite } from "pixi.js";

import CanvasObjectContext from "../contexts/CanvasObjectContext";
import { usePixiObject, clearContainer } from "../hooks/usePixiObject";
import { hexToRgb, setTransparentToData } from "../utils/colorUtil";

import type {
	ClickEventHandler,
	ClickDetector,
} from "../contexts/CanvasObjectContext";

type CanvasDotPatternProps = {
	readonly image: readonly string[] | undefined;
	readonly x: number;
	readonly y: number;
	readonly scaleX?: number;
	readonly scaleY?: number;
	readonly color?: string;
	readonly onClick?: ClickEventHandler;
};

/**
 * ドットパターン描画オブジェクト
 * 文字列配列で表現されたパターン（"1"は塗る、"0"は塗らない）を描画
 */
export default memo<PropsWithChildren<CanvasDotPatternProps>>(
	function CanvasDotPattern({
		image,
		x,
		y,
		scaleX = 1,
		scaleY = 1,
		color = "#000000",
		onClick,
		children,
	}) {
		const imageWidth = image != null && image.length > 0 ? image[0].length : 0;
		const imageHeight = image?.length ?? 0;
		const width = imageWidth * scaleX;
		const height = imageHeight * scaleY;

		const isClickDetector: ClickDetector = useCallback(
			(clickX: number, clickY: number) => {
				return (
					clickX >= 0 && clickX <= width && clickY >= 0 && clickY <= height
				);
			},
			[width, height],
		);

		const { container, graphicsContainer, metadata } = usePixiObject({
			relX: x,
			relY: y,
			width,
			height,
			onClick,
			isClickDetector,
		});

		useEffect(() => {
			if (graphicsContainer.destroyed) return;
			clearContainer(graphicsContainer);

			if (!image || imageWidth === 0 || imageHeight === 0) return;

			const canvas = new OffscreenCanvas(imageWidth, imageHeight);
			const ctx = canvas.getContext("2d");
			if (!ctx) return;

			const imageData = ctx.createImageData(imageWidth, imageHeight);
			const data = imageData.data;
			const fillColorRgb = hexToRgb(color);

			for (let row = 0; row < imageHeight; row++) {
				const line = image[row];
				for (let col = 0; col < line.length; col++) {
					const pixelIndex = (row * imageWidth + col) * 4;
					if (line[col] === "1") {
						fillColorRgb.setToData(data, pixelIndex);
					} else {
						setTransparentToData(data, pixelIndex);
					}
				}
			}

			ctx.putImageData(imageData, 0, 0);

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const texture = Texture.from(canvas as any);
			const sprite = new Sprite(texture);
			sprite.width = width;
			sprite.height = height;
			graphicsContainer.addChild(sprite);
		}, [
			graphicsContainer,
			image,
			color,
			imageWidth,
			imageHeight,
			width,
			height,
		]);

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
