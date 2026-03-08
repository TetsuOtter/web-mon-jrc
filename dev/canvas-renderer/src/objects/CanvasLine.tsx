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
	const w = width || 1;
	const isVertical = Math.abs(relX1 - relX2) < 1e-6;
	const isHorizontal = Math.abs(relY1 - relY2) < 1e-6;
	const isAxisAlignedPixelPerfectLine =
		Number.isInteger(w) && w >= 1 && (isVertical || isHorizontal);
	const usePixelLine = Math.abs(w - 1) < 1e-6;
	const thickness = Math.max(1, Math.round(w));
	const axisHalfFloor = Math.floor(thickness / 2);
	const halfW = w / 2;
	const minX = Math.min(relX1, relX2);
	const maxX = Math.max(relX1, relX2);
	const minY = Math.min(relY1, relY2);
	const maxY = Math.max(relY1, relY2);
	const boundsX = isAxisAlignedPixelPerfectLine
		? isVertical
			? minX - axisHalfFloor
			: minX
		: minX - halfW;
	const boundsY = isAxisAlignedPixelPerfectLine
		? isHorizontal
			? minY - axisHalfFloor
			: minY
		: minY - halfW;
	const boundsWidth = isAxisAlignedPixelPerfectLine
		? isVertical
			? thickness
			: Math.max(1, maxX - minX + 1)
		: maxX - minX + w;
	const boundsHeight = isAxisAlignedPixelPerfectLine
		? isHorizontal
			? thickness
			: Math.max(1, maxY - minY + 1)
		: maxY - minY + w;

	const isClickDetector: ClickDetector = useCallback(
		(clickX: number, clickY: number) => {
			const bboxMaxX = boundsWidth;
			const bboxMaxY = boundsHeight;

			if (
				clickX < -w ||
				clickX > bboxMaxX + w ||
				clickY < -w ||
				clickY > bboxMaxY + w
			) {
				return false;
			}

			const x1 = relX1 - boundsX;
			const y1 = relY1 - boundsY;
			const x2 = relX2 - boundsX;
			const y2 = relY2 - boundsY;
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
		[
			boundsWidth,
			boundsHeight,
			w,
			relX1,
			relY1,
			relX2,
			relY2,
			boundsX,
			boundsY,
		],
	);

	const { graphicsContainer } = usePixiObject({
		relX: boundsX,
		relY: boundsY,
		width: boundsWidth,
		height: boundsHeight,
		onClick,
		isClickDetector,
	});

	useEffect(() => {
		if (graphicsContainer.destroyed) return;
		clearContainer(graphicsContainer);

		const g = new Graphics();

		const x1 = relX1 - boundsX;
		const y1 = relY1 - boundsY;
		const x2 = relX2 - boundsX;
		const y2 = relY2 - boundsY;

		if (isAxisAlignedPixelPerfectLine) {
			const rectX = isVertical
				? Math.min(x1, x2) - axisHalfFloor
				: Math.min(x1, x2);
			const rectY = isHorizontal
				? Math.min(y1, y2) - axisHalfFloor
				: Math.min(y1, y2);
			const rectW = isVertical ? thickness : Math.max(1, Math.abs(x2 - x1) + 1);
			const rectH = isHorizontal
				? thickness
				: Math.max(1, Math.abs(y2 - y1) + 1);
			g.rect(rectX, rectY, rectW, rectH);
			g.fill(color);
		} else {
			g.moveTo(x1, y1);
			g.lineTo(x2, y2);
			g.stroke({
				color,
				width: w,
				alignment: 0.5,
				pixelLine: usePixelLine,
			});
		}

		graphicsContainer.addChild(g);
	}, [
		graphicsContainer,
		color,
		w,
		thickness,
		axisHalfFloor,
		isAxisAlignedPixelPerfectLine,
		isVertical,
		isHorizontal,
		usePixelLine,
		relX1,
		relY1,
		relX2,
		relY2,
		boundsX,
		boundsY,
	]);

	return null;
});
