import { memo, useCallback } from "react";

import CanvasObjectBase from "./CanvasObjectBase";

import type {
	ClickEventHandler,
	ClickDetector,
	CanvasRenderFunction,
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
 * X座標: xL < xR, Y座標: y1 < y2 に限定
 */
export default memo<CanvasQuadrilateralProps>(function CanvasQuadrilateral({
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
		Math.round(xR2)
	);
	const maxX = Math.max(
		Math.round(xL1),
		Math.round(xL2),
		Math.round(xR1),
		Math.round(xR2)
	);
	const minY = Math.min(
		Math.round(yL1),
		Math.round(yL2),
		Math.round(yR1),
		Math.round(yR2)
	);
	const maxY = Math.max(
		Math.round(yL1),
		Math.round(yL2),
		Math.round(yR1),
		Math.round(yR2)
	);
	const onRender: CanvasRenderFunction = useCallback(
		async (ctx, metadata) => {
			ctx.save();

			// キャンバス上の絶対座標に変換
			const ix1 = Math.round(metadata.absX + xL1 - minX);
			const iy1 = Math.round(metadata.absY + yL1 - minY);
			const ix2 = Math.round(metadata.absX + xL2 - minX);
			const iy2 = Math.round(metadata.absY + yL2 - minY);
			const ix3 = Math.round(metadata.absX + xR1 - minX);
			const iy3 = Math.round(metadata.absY + yR1 - minY);
			const ix4 = Math.round(metadata.absX + xR2 - minX);
			const iy4 = Math.round(metadata.absY + yR2 - minY);
			const w = lineWidth || 1;

			if (fillColor) {
				// 四角形を塗りつぶし（線幅分内側に描画してはみ出しを防止）
				ctx.fillStyle = fillColor;

				const offset = w / 2;

				// xL < xR, y1 < y2の制約を使用して各頂点をoffset分だけ内側に移動
				const fx1 = ix1 + offset; // 左上: 右に移動
				const fy1 = iy1 + offset; // 左上: 下に移動
				const fx2 = ix2 + offset; // 左下: 右に移動
				const fy2 = iy2 + offset; // 左下: 上に移動
				const fx3 = ix3 + offset; // 右上: 左に移動
				const fy3 = iy3 + offset; // 右上: 下に移動
				const fx4 = ix4 + offset; // 右下: 左に移動
				const fy4 = iy4 + offset; // 右下: 上に移動

				ctx.beginPath();
				ctx.moveTo(fx1, fy1);
				ctx.lineTo(fx3, fy3);
				ctx.lineTo(fx4, fy4);
				ctx.lineTo(fx2, fy2);
				ctx.closePath();
				ctx.fill();
			}

			// 4本の線を描画: 左辺、上辺、右辺、下辺
			drawLine(ctx, ix1, iy1, ix2, iy2, actualStrokeColor, w); // 左辺
			drawLine(ctx, ix1, iy1, ix3, iy3, actualStrokeColor, w); // 上辺
			drawLine(ctx, ix3, iy3, ix4, iy4, actualStrokeColor, w); // 右辺
			drawLine(ctx, ix2, iy2, ix4, iy4, actualStrokeColor, w); // 下辺

			ctx.restore();
		},
		[
			xL1,
			minX,
			yL1,
			minY,
			xL2,
			yL2,
			xR1,
			yR1,
			xR2,
			yR2,
			lineWidth,
			fillColor,
			actualStrokeColor,
		]
	);

	const isClickDetector: ClickDetector = useCallback(
		(clickX: number, clickY: number) => {
			const w = lineWidth || 1;

			// バウンディングボックスのチェック
			const bboxMinX = 0;
			const bboxMaxX = maxX - minX;
			const bboxMinY = 0;
			const bboxMaxY = maxY - minY;

			if (
				clickX < bboxMinX - w ||
				clickX > bboxMaxX + w ||
				clickY < bboxMinY - w ||
				clickY > bboxMaxY + w
			) {
				return false;
			}

			// 相対座標への変換
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
				// 塗りつぶしの場合は多角形内判定
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
					y2
				);
			}

			result ||=
				isPointNearLine(clickX, clickY, x1, y1, x2, y2, w) || // 左辺
				isPointNearLine(clickX, clickY, x1, y1, x3, y3, w) || // 上辺
				isPointNearLine(clickX, clickY, x3, y3, x4, y4, w) || // 右辺
				isPointNearLine(clickX, clickY, x2, y2, x4, y4, w); // 下辺

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
		]
	);

	return (
		<CanvasObjectBase
			onRender={onRender}
			onClick={onClick}
			isClickDetector={isClickDetector}
			relX={minX}
			relY={minY}
			width={maxX - minX}
			height={maxY - minY}
			isFilled={false}
		/>
	);
});

/**
 * Bresenhamアルゴリズムで直線を描画
 */
function drawLine(
	ctx: CanvasRenderingContext2D,
	ix1: number,
	iy1: number,
	ix2: number,
	iy2: number,
	color: string,
	w: number
) {
	ctx.fillStyle = color;

	const dx = Math.abs(ix2 - ix1);
	const dy = Math.abs(iy2 - iy1);
	const sx = ix1 < ix2 ? 1 : -1;
	const sy = iy1 < iy2 ? 1 : -1;
	let err = dx - dy;

	let x = ix1;
	let y = iy1;

	const steps = Math.max(dx, dy);
	for (let i = 0; i <= steps; i++) {
		ctx.fillRect(x, y, w, w);

		if (x === ix2 && y === iy2) break;

		const e2 = 2 * err;
		if (e2 > -dy) {
			err -= dy;
			x += sx;
		}
		if (e2 < dx) {
			err += dx;
			y += sy;
		}
	}
}

/**
 * 点が線分の近くにあるかチェック
 */
function isPointNearLine(
	clickX: number,
	clickY: number,
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	w: number
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

/**
 * 点が四角形内にあるかチェック（Ray casting algorithm）
 */
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
	y4: number
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
