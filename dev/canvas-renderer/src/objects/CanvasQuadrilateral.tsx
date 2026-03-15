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
			console.log("CanvasQuadrilateral: useEffect triggered", {
				destroyed: graphicsContainer?.destroyed,
				childrenBefore: graphicsContainer?.children?.length,
			});

			if (graphicsContainer.destroyed) {
				console.log(
					"CanvasQuadrilateral: graphicsContainer destroyed, returning",
				);
				return;
			}
			clearContainer(graphicsContainer);
			console.log("CanvasQuadrilateral: cleared container", {
				childrenAfter: graphicsContainer.children.length,
			});

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

			console.log("CanvasQuadrilateral: local coordinates", {
				x1,
				y1,
				x2,
				y2,
				x3,
				y3,
				x4,
				y4,
			});

			// 外側ポリゴンをストローク色で塗りつぶし
			console.log("CanvasQuadrilateral: drawing outer polygon", {
				coords: [x1, y1, x3, y3, x4, y4, x2, y2],
				color: actualStrokeColor,
			});
			g.poly([x1, y1, x3, y3, x4, y4, x2, y2]);
			g.fill(actualStrokeColor);

			// 内側ポリゴンをフィル色で塗りつぶし（フィル色が指定されている場合）
			if (fillColor) {
				const offset = w / 2;
				const offsetPoints = offsetQuadrilateral(
					x1,
					y1,
					x3,
					y3,
					x4,
					y4,
					x2,
					y2,
					offset,
				);
				console.log("CanvasQuadrilateral: drawing inner polygon", {
					offset,
					offsetPoints,
					color: fillColor,
				});
				g.poly(offsetPoints);
				g.fill(fillColor);
				console.log("CanvasQuadrilateral: inner polygon created", {
					offsetPoints,
				});
			}

			graphicsContainer.addChild(g);
			console.log("CanvasQuadrilateral: graphics added to container", {
				containerChildren: graphicsContainer.children.length,
			});

			// デバッグ用：各頂点位置を小さいドットでマーク
			const debugG = new Graphics();
			debugG.circle(x1, y1, 1);
			debugG.fill("yellow");
			debugG.circle(x3, y3, 1);
			debugG.fill("yellow");
			debugG.circle(x4, y4, 1);
			debugG.fill("yellow");
			debugG.circle(x2, y2, 1);
			debugG.fill("yellow");
			graphicsContainer.addChild(debugG);
			console.log("CanvasQuadrilateral: debug vertices marked");
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

/**
 * 四角形の各頂点を内側にオフセットさせる
 * @param x1 左上X
 * @param y1 左上Y
 * @param x3 右上X
 * @param y3 右上Y
 * @param x4 右下X
 * @param y4 右下Y
 * @param x2 左下X
 * @param y2 左下Y
 * @param offset オフセット距離
 * @returns オフセット後の座標配列 [x1, y1, x3, y3, x4, y4, x2, y2]
 */
function offsetQuadrilateral(
	x1: number,
	y1: number,
	x3: number,
	y3: number,
	x4: number,
	y4: number,
	x2: number,
	y2: number,
	offset: number,
): number[] {
	// ポリゴン順序は時計回り: (x1,y1) → (x3,y3) → (x4,y4) → (x2,y2)
	// 時計回りポリゴンの内側向き法線を計算
	// 方向ベクトル(dx, dy)を90度時計回りに回転: (dy, -dx)
	const getNormal = (
		fromX: number,
		fromY: number,
		toX: number,
		toY: number,
	): [number, number] => {
		const dx = toX - fromX;
		const dy = toY - fromY;
		const len = Math.hypot(dx, dy);
		if (len === 0) return [0, 0];
		return [dy / len, -dx / len];
	};

	// 各辺に対する内側向き法線
	const nTop = getNormal(x1, y1, x3, y3); // 上辺: 左上 → 右上
	const nRight = getNormal(x3, y3, x4, y4); // 右辺: 右上 → 右下
	const nBottom = getNormal(x4, y4, x2, y2); // 下辺: 右下 → 左下
	const nLeft = getNormal(x2, y2, x1, y1); // 左辺: 左下 → 左上

	// 各頂点は2つの辺の交点。その2つの法線の平均方向にオフセット
	const offsetVertex = (
		px: number,
		py: number,
		n1: [number, number],
		n2: [number, number],
	): [number, number] => {
		const avgX = (n1[0] + n2[0]) / 2;
		const avgY = (n1[1] + n2[1]) / 2;
		const len = Math.hypot(avgX, avgY);
		if (len === 0) return [px, py];
		const factor = offset / len;
		return [px + avgX * factor, py + avgY * factor];
	};

	const [ofs1X, ofs1Y] = offsetVertex(x1, y1, nLeft, nTop); // 左上：左辺と上辺の交点
	const [ofs3X, ofs3Y] = offsetVertex(x3, y3, nTop, nRight); // 右上：上辺と右辺の交点
	const [ofs4X, ofs4Y] = offsetVertex(x4, y4, nRight, nBottom); // 右下：右辺と下辺の交点
	const [ofs2X, ofs2Y] = offsetVertex(x2, y2, nBottom, nLeft); // 左下：下辺と左辺の交点

	return [ofs1X, ofs1Y, ofs3X, ofs3Y, ofs4X, ofs4Y, ofs2X, ofs2Y];
}

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
