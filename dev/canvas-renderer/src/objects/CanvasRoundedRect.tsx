import type { PropsWithChildren } from "react";
import { memo, useCallback, useEffect } from "react";

import { Graphics } from "pixi.js";

import CanvasObjectContext from "../contexts/CanvasObjectContext";
import { usePixiObject, clearContainer } from "../hooks/usePixiObject";

import type {
	ClickEventHandler,
	ClickDetector,
} from "../contexts/CanvasObjectContext";

type CanvasRoundedRectProps = {
	readonly relX: number;
	readonly relY: number;
	readonly width: number;
	readonly height: number;
	readonly radius: number;
	readonly fillColor?: string;
	readonly onClick?: ClickEventHandler;
};

/**
 * 角丸矩形描画オブジェクト
 */
export default memo<PropsWithChildren<CanvasRoundedRectProps>>(
	function CanvasRoundedRect({
		relX,
		relY,
		width,
		height,
		radius,
		fillColor,
		onClick,
		children,
	}) {
		const isClickDetector: ClickDetector = useCallback(
			(clickX: number, clickY: number) => {
				const r = Math.min(radius, width / 2, height / 2);

				if (clickX >= r && clickX < width - r) {
					return clickY >= 0 && clickY < height;
				}
				if (clickY >= r && clickY < height - r) {
					return clickX >= 0 && clickX < width;
				}

				if (clickX < r && clickY < r) {
					return isClickInRoundedCorner(clickX, clickY, r, r, r);
				}
				if (clickX >= width - r && clickY < r) {
					return isClickInRoundedCorner(clickX, clickY, width - r, r, r);
				}
				if (clickX < r && clickY >= height - r) {
					return isClickInRoundedCorner(clickX, clickY, r, height - r, r);
				}
				if (clickX >= width - r && clickY >= height - r) {
					return isClickInRoundedCorner(
						clickX,
						clickY,
						width - r,
						height - r,
						r,
					);
				}

				return false;
			},
			[width, height, radius],
		);

		const { container, graphicsContainer, metadata } = usePixiObject({
			relX,
			relY,
			width,
			height,
			onClick,
			isClickDetector,
		});

		useEffect(() => {
			if (graphicsContainer.destroyed) return;
			clearContainer(graphicsContainer);

			if (!fillColor) return;

			const g = new Graphics();
			const r = Math.min(radius, metadata.width / 2, metadata.height / 2);

			g.roundRect(0, 0, metadata.width, metadata.height, r);
			g.fill(fillColor);

			graphicsContainer.addChild(g);
		}, [graphicsContainer, fillColor, radius, metadata.width, metadata.height]);

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

function isClickInRoundedCorner(
	clickX: number,
	clickY: number,
	centerX: number,
	centerY: number,
	radius: number,
): boolean {
	const dx = clickX - centerX;
	const dy = clickY - centerY;
	return dx * dx + dy * dy <= radius * radius;
}
