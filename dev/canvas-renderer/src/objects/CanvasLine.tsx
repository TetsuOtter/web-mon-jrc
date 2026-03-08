import { memo, useCallback, useEffect } from "react";

import { Graphics } from "pixi.js";

import { usePixiObject, clearContainer } from "../hooks/usePixiObject";

import type {
	ClickEventHandler,
	ClickDetector,
} from "../contexts/CanvasObjectContext";

type CanvasLineProps = {
	readonly relX1: number;
	readonly relY1: number;
	readonly relX2: number;
	readonly relY2: number;
	readonly color?: string;
	readonly width?: number;
	readonly onClick?: ClickEventHandler;
};

/**
 * 直線描画オブジェクト
 */
export default memo<CanvasLineProps>(function CanvasLine({
	relX1,
	relY1,
	relX2,
	relY2,
	color = "#000000",
	width = 1,
	onClick,
}) {
	const minX = Math.min(Math.round(relX1), Math.round(relX2));
	const maxX = Math.max(Math.round(relX1), Math.round(relX2));
	const minY = Math.min(Math.round(relY1), Math.round(relY2));
	const maxY = Math.max(Math.round(relY1), Math.round(relY2));

	const isClickDetector: ClickDetector = useCallback(
		(clickX: number, clickY: number) => {
			const w = width || 1;

			const bboxMaxX = maxX - minX;
			const bboxMaxY = maxY - minY;

			if (
				clickX < -w ||
				clickX > bboxMaxX + w ||
				clickY < -w ||
				clickY > bboxMaxY + w
			) {
				return false;
			}

			const x1 = Math.round(relX1) - minX;
			const y1 = Math.round(relY1) - minY;
			const x2 = Math.round(relX2) - minX;
			const y2 = Math.round(relY2) - minY;
			const dx = x2 - x1;
			const dy = y2 - y1;
			const lengthSq = dx * dx + dy * dy;

			if (lengthSq === 0) {
				const px = clickX - x1;
				const py = clickY - y1;
				return px * px + py * py <= w * w;
			}

			let t = ((clickX - x1) * dx + (clickY - y1) * dy) / lengthSq;
			t = Math.max(0, Math.min(1, t));
			const nearestX = x1 + t * dx;
			const nearestY = y1 + t * dy;
			const px = clickX - nearestX;
			const py = clickY - nearestY;
			return px * px + py * py <= w * w;
		},
		[width, maxX, minX, maxY, minY, relX1, relY1, relX2, relY2],
	);

	const { graphicsContainer } = usePixiObject({
		relX: minX,
		relY: minY,
		width: maxX - minX,
		height: maxY - minY,
		onClick,
		isClickDetector,
	});

	useEffect(() => {
		if (graphicsContainer.destroyed) return;
		clearContainer(graphicsContainer);

		const g = new Graphics();
		const w = width || 1;

		const x1 = Math.round(relX1) - minX;
		const y1 = Math.round(relY1) - minY;
		const x2 = Math.round(relX2) - minX;
		const y2 = Math.round(relY2) - minY;

		g.moveTo(x1, y1);
		g.lineTo(x2, y2);
		g.stroke({ color, width: w });

		graphicsContainer.addChild(g);
	}, [graphicsContainer, color, width, relX1, relY1, relX2, relY2, minX, minY]);

	return null;
});
