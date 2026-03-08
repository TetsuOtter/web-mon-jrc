import type { PropsWithChildren } from "react";
import { memo, useEffect } from "react";

import { Assets, Sprite } from "pixi.js";

import CanvasObjectContext, {
	type ClickEventHandler,
	useCanvasObjectContext,
} from "../contexts/CanvasObjectContext";
import { usePixiObject, clearContainer } from "../hooks/usePixiObject";

type CanvasImageProps = {
	readonly imagePath: string;
	readonly relX: number;
	readonly relY: number;
	readonly scaleX?: number;
	readonly scaleY?: number;
	readonly areaWidth?: number;
	readonly areaHeight?: number;
	readonly horizontalAlign?: "left" | "center" | "right";
	readonly verticalAlign?: "top" | "middle" | "bottom";
	readonly onClick?: ClickEventHandler;
};

export default memo<PropsWithChildren<CanvasImageProps>>(function CanvasImage({
	imagePath,
	relX,
	relY,
	scaleX = 1,
	scaleY = 1,
	areaWidth: propsAreaWidth,
	areaHeight: propsAreaHeight,
	horizontalAlign = "left",
	verticalAlign = "top",
	onClick,
	children,
}) {
	const parentObjectContext = useCanvasObjectContext();
	const areaHeight = propsAreaHeight ?? parentObjectContext.metadata.height;
	const areaWidth = propsAreaWidth ?? parentObjectContext.metadata.width;

	const { container, graphicsContainer, metadata } = usePixiObject({
		relX,
		relY,
		width: areaWidth,
		height: areaHeight,
		onClick,
	});

	useEffect(() => {
		if (graphicsContainer.destroyed) return;
		if (!imagePath) return;

		let cancelled = false;

		(async () => {
			try {
				const texture = await Assets.load(imagePath);
				if (cancelled || !texture || graphicsContainer.destroyed) return;

				clearContainer(graphicsContainer);

				const imageWidth = texture.width * scaleX;
				const imageHeight = texture.height * scaleY;

				let offsetX = 0;
				switch (horizontalAlign) {
					case "center":
						offsetX = -Math.round((imageWidth - areaWidth) / 2);
						break;
					case "right":
						offsetX = imageWidth - areaWidth;
						break;
				}

				let offsetY = 0;
				switch (verticalAlign) {
					case "middle":
						offsetY = -Math.round((imageHeight - areaHeight) / 2);
						break;
					case "bottom":
						offsetY = imageHeight - areaHeight;
						break;
				}

				const sprite = new Sprite(texture);
				sprite.x = offsetX;
				sprite.y = offsetY;
				sprite.width = imageWidth;
				sprite.height = imageHeight;

				graphicsContainer.addChild(sprite);
			} catch (error) {
				console.error(`Failed to load image: ${imagePath}`, error);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [
		graphicsContainer,
		imagePath,
		scaleX,
		scaleY,
		areaWidth,
		areaHeight,
		horizontalAlign,
		verticalAlign,
	]);

	return (
		<CanvasObjectContext
			pixiContainer={container}
			metadata={metadata}
		>
			{children}
		</CanvasObjectContext>
	);
});
