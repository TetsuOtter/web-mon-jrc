import type { PropsWithChildren } from "react";
import { memo, useCallback, useEffect } from "react";

import { Graphics } from "pixi.js";

import CanvasObjectContext from "../contexts/CanvasObjectContext";
import { usePixiObject, clearContainer } from "../hooks/usePixiObject";

import type {
	ClickEventHandler,
	ClickDetector,
} from "../contexts/CanvasObjectContext";

type CanvasQuadrilateralProps = {
	readonly xL1: number;
	readonly yL1: number;
	readonly xL2: number;
	readonly yL2: number;
	readonly xR1: number;
	readonly yR1: number;
	readonly xR2: number;
	readonly yR2: number;
	readonly color?: string;
	readonly fillColor?: string;
	readonly strokeColor?: string;
	readonly lineWidth?: number;
	readonly onClick?: ClickEventHandler;
};

/**
 * 任意の四角形描画オブジェクト
 * 左辺と右辺の上下の4点で定義される四角形を描画
 */
export default memo<PropsWithChildren<CanvasQuadrilateralProps>>(
	function CanvasQuadrilateral({
		xL1,
		yL1,
		xL2,
		yL2,
		xR1,
		yR1,
		xR2,
		yR2,
		fillColor,
		strokeColor,
		lineWidth = 1,
		onClick,
		children,
	}) {
		const actualStrokeColor = strokeColor ?? fillColor;
		if (actualStrokeColor == null) {
			throw new Error("Either fillColor or strokeColor must be specified.");
		}
		if (xR1 <= xL1 || xR2 <= xL2) {
			throw new Error("xL must be less than xR.");
		}
		if (yL2 <= yL1 || yR2 <= yR1) {
			throw new Error("y1 must be less than y2.");
		}

		const minX = Math.min(
			Math.round(xL1),
			Math.round(xL2),
			Math.round(xR1),
			Math.round(xR2),
		);
		const maxX = Math.max(
			Math.round(xL1),
			Math.round(xL2),
			Math.round(xR1),
			Math.round(xR2),
		);
		const minY = Math.min(
			Math.round(yL1),
			Math.round(yL2),
			Math.round(yR1),
			Math.round(yR2),
		);
		const maxY = Math.max(
			Math.round(yL1),
			Math.round(yL2),
			Math.round(yR1),
			Math.round(yR2),
		);

		const isClickDetector: ClickDetector = useCallback(
			(clickX: number, clickY: number) => {
				const w = lineWidth || 1;

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

				const x1 = Math.round(xL1) - minX;
				const y1 = Math.round(yL1) - minY;
				const x2 = Math.round(xL2) - minX;
				const y2 = Math.round(yL2) - minY;
				const x3 = Math.round(xR1) - minX;
				const y3 = Math.round(yR1) - minY;
				const x4 = Math.round(xR2) - minX;
				const y4 = Math.round(yR2) - minY;

				let result = false;

				if (fillColor) {
					result = isPointInQuadrilateral(
						clickX,
						clickY,
						x1,
						y1,
						x3,
						y3,
						x4,
						y4,
						x2,
						y2,
					);
				}

				result ||=
					isPointNearLine(clickX, clickY, x1, y1, x2, y2, w) ||
					isPointNearLine(clickX, clickY, x1, y1, x3, y3, w) ||
					isPointNearLine(clickX, clickY, x3, y3, x4, y4, w) ||
					isPointNearLine(clickX, clickY, x2, y2, x4, y4, w);

				return result;
			},
			[
				lineWidth,
				maxX,
				minX,
				maxY,
				minY,
				xL1,
				yL1,
				xL2,
				yL2,
				xR1,
				yR1,
				xR2,
				yR2,
				fillColor,
			],
		);

		const { container, graphicsContainer, metadata } = usePixiObject({
			relX: minX,
			relY: minY,
			width: maxX - minX,
			height: maxY - minY,
			onClick,
			isClickDetector,
		});

		useEffect(() => {
			if (graphicsContainer.destroyed) {
				return;
			}
			clearContainer(graphicsContainer);

			const g = new Graphics();
			const w = lineWidth || 1;

			const x1 = Math.round(xL1) - minX;
			const y1 = Math.round(yL1) - minY;
			const x2 = Math.round(xL2) - minX;
			const y2 = Math.round(yL2) - minY;
			const x3 = Math.round(xR1) - minX;
			const y3 = Math.round(yR1) - minY;
			const x4 = Math.round(xR2) - minX;
			const y4 = Math.round(yR2) - minY;

			const polyPts: [number, number][] = [
				[x1, y1],
				[x3, y3],
				[x4, y4],
				[x2, y2],
			];

			// ポリゴン全体をストローク色で塗りつぶし
			g.poly(polyPts.flat());
			g.fill(actualStrokeColor);

			// ポリゴン辺に沿った1pxストロークで境界ピクセルを補完
			// （GPU のポリゴンラスタライズは右辺・下辺の境界ピクセルを除外するため）
			g.moveTo(x1 + 0.5, y1 + 0.5);
			g.lineTo(x3 + 0.5, y3 + 0.5);
			g.lineTo(x4 + 0.5, y4 + 0.5);
			g.lineTo(x2 + 0.5, y2 + 0.5);
			g.closePath();
			g.stroke({ color: actualStrokeColor, width: 1 });

			// 内側ポリゴン（ストローク幅分インセット）をフィル色で上書き
			if (fillColor) {
				const insetPts = computeInsetPolygon(polyPts, w);
				if (insetPts) {
					g.poly(insetPts.flat());
					g.fill(fillColor);
				}
			}

			graphicsContainer.addChild(g);
		}, [
			graphicsContainer,
			xL1,
			yL1,
			xL2,
			yL2,
			xR1,
			yR1,
			xR2,
			yR2,
			lineWidth,
			fillColor,
			actualStrokeColor,
			minX,
			minY,
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

function isPointNearLine(
	clickX: number,
	clickY: number,
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	w: number,
): boolean {
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
}

function isPointInQuadrilateral(
	px: number,
	py: number,
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	x3: number,
	y3: number,
	x4: number,
	y4: number,
): boolean {
	const vertices: [number, number][] = [
		[x1, y1],
		[x2, y2],
		[x3, y3],
		[x4, y4],
	];

	let inside = false;
	for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
		const [xi, yi] = vertices[i];
		const [xj, yj] = vertices[j];
		const intersect =
			yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi;
		if (intersect) inside = !inside;
	}

	return inside;
}

function computeInsetPolygon(
	pts: [number, number][],
	d: number,
): [number, number][] | null {
	const n = pts.length;
	const normals: [number, number][] = [];
	const consts: number[] = [];

	for (let i = 0; i < n; i++) {
		const [px0, py0] = pts[i];
		const [px1, py1] = pts[(i + 1) % n];
		const dx = px1 - px0;
		const dy = py1 - py0;
		const len = Math.hypot(dx, dy);
		if (len < 1e-10) return null;
		const nx = dy / len;
		const ny = -dx / len;
		normals.push([nx, ny]);
		consts.push(nx * px0 + ny * py0);
	}

	const result: [number, number][] = [];
	for (let i = 0; i < n; i++) {
		const prev = (i + n - 1) % n;
		const ni = normals[prev];
		const ci = consts[prev] - d;
		const nj = normals[i];
		const cj = consts[i] - d;
		const det = ni[0] * nj[1] - nj[0] * ni[1];
		if (Math.abs(det) < 1e-10) return null;
		const x = (ci * nj[1] - cj * ni[1]) / det;
		const y = (ni[0] * cj - nj[0] * ci) / det;
		result.push([x, y]);
	}

	return result;
}
