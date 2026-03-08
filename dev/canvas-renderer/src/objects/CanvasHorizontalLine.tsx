import { memo, useEffect } from "react";

import { Graphics } from "pixi.js";

import { clearContainer, usePixiObject } from "../hooks/usePixiObject";

import type { ClickEventHandler } from "../contexts/CanvasObjectContext";

export type CanvasHorizontalLineProps = {
	readonly relX1: number;
	readonly relX2: number;
	readonly relY: number;
	readonly color: string;
	readonly width?: number;
	readonly onClick?: ClickEventHandler;
};

export default memo<CanvasHorizontalLineProps>(function CanvasHorizontalLine({
	relX1,
	relX2,
	relY,
	color,
	width = 1,
	onClick,
}) {
	if (width < 1) {
		throw new Error("Width must be at least 1");
	}
	const w = Math.round(width);
	const minX = Math.min(relX1, relX2);
	const maxX = Math.max(relX1, relX2);
	const rectWidth = maxX - minX + 1;
	const rectHeight = w;

	const { graphicsContainer } = usePixiObject({
		relX: minX,
		relY: relY,
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
