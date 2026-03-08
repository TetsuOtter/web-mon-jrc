import { memo, useEffect } from "react";

import { Graphics } from "pixi.js";

import { clearContainer, usePixiObject } from "../hooks/usePixiObject";

import type { ClickEventHandler } from "../contexts/CanvasObjectContext";

export type CanvasVerticalLineProps = {
	readonly relX: number;
	readonly relY1: number;
	readonly relY2: number;
	readonly color: string;
	readonly width?: number;
	readonly onClick?: ClickEventHandler;
};

export default memo<CanvasVerticalLineProps>(function CanvasVerticalLine({
	relX,
	relY1,
	relY2,
	color,
	width = 1,
	onClick,
}) {
	if (width < 1) {
		throw new Error("Width must be at least 1");
	}
	const w = Math.round(width);
	const minY = Math.min(relY1, relY2);
	const maxY = Math.max(relY1, relY2);
	const rectWidth = w;
	const rectHeight = maxY - minY + 1;

	const { graphicsContainer } = usePixiObject({
		relX: relX,
		relY: minY,
		width: rectWidth,
		height: rectHeight,
		onClick,
	});

	useEffect(() => {
		if (graphicsContainer.destroyed) return;
		clearContainer(graphicsContainer);

		const g = new Graphics();
		g.rect(0, 0, rectWidth, rectHeight);
		g.fill(color);

		graphicsContainer.addChild(g);
	}, [graphicsContainer, color, rectWidth, rectHeight]);

	return null;
});
