import { memo, useCallback } from "react";

import CanvasObjectBase from "./CanvasObjectBase";

import type {
	ClickEventHandler,
	ClickDetector,
	CanvasRenderFunction,
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
 * ドット描画により高解像度でも滑らかさを維持
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
	const onRender: CanvasRenderFunction = useCallback(
		async (ctx, metadata) => {
			ctx.save();

			// 整数座標に丸める
			const ix1 = Math.round(metadata.absX);
			const iy1 = Math.round(metadata.absY);
			const ix2 = Math.round(metadata.absX + metadata.width);
			const iy2 = Math.round(metadata.absY + metadata.height);
			const w = width || 1;
			const halfWidth = w / 2;

			ctx.fillStyle = color;

			// Bresenhamアルゴリズムで直線のピクセルを描画
			const dx = Math.abs(ix2 - ix1);
			const dy = Math.abs(iy2 - iy1);
			const sx = ix1 < ix2 ? 1 : -1;
			const sy = iy1 < iy2 ? 1 : -1;
			let err = dx - dy;

			let x = ix1;
			let y = iy1;

			// 線の太さを考慮してドットを描画
			const steps = Math.max(dx, dy);
			for (let i = 0; i <= steps; i++) {
				// 線の太さに応じてボックスを描画 - バウンディングボックス内に収める
				ctx.fillRect(x - halfWidth, y - halfWidth, w, w);

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

			ctx.restore();
		},
		[color, width]
	);

	const isClickDetector: ClickDetector = useCallback(
		(clickX: number, clickY: number) => {
			// clickX, clickY は相対座標（バウンディングボックスの左上を原点とした座標）
			const w = width || 1;
			const halfWidth = w / 2;
			const minX = Math.min(Math.round(relX1), Math.round(relX2));
			const maxX = Math.max(Math.round(relX1), Math.round(relX2));
			const minY = Math.min(Math.round(relY1), Math.round(relY2));
			const maxY = Math.max(Math.round(relY1), Math.round(relY2));

			// バウンディングボックスの左上を原点とした場合の線の座標
			const ix1 = Math.round(relX1) - minX;
			const iy1 = Math.round(relY1) - minY;
			const ix2 = Math.round(relX2) - minX;
			const iy2 = Math.round(relY2) - minY;

			const bboxMinX = 0;
			const bboxMaxX = maxX - minX;
			const bboxMinY = 0;
			const bboxMaxY = maxY - minY;

			if (
				clickX < bboxMinX - halfWidth ||
				clickX > bboxMaxX + halfWidth ||
				clickY < bboxMinY - halfWidth ||
				clickY > bboxMaxY + halfWidth
			) {
				return false;
			}

			// より正確な距離計算
			const dx = ix2 - ix1;
			const dy = iy2 - iy1;
			const lengthSq = dx * dx + dy * dy;

			if (lengthSq === 0) {
				// 点と点の距離
				const px = clickX - ix1;
				const py = clickY - iy1;
				return px * px + py * py <= halfWidth * halfWidth;
			}

			// 線分上の最近点までの距離
			let t = ((clickX - ix1) * dx + (clickY - iy1) * dy) / lengthSq;
			t = Math.max(0, Math.min(1, t));
			const nearestX = ix1 + t * dx;
			const nearestY = iy1 + t * dy;
			const px = clickX - nearestX;
			const py = clickY - nearestY;
			return px * px + py * py <= halfWidth * halfWidth;
		},
		[relX1, relY1, relX2, relY2, width]
	);

	const minX = Math.min(Math.round(relX1), Math.round(relX2));
	const maxX = Math.max(Math.round(relX1), Math.round(relX2));
	const minY = Math.min(Math.round(relY1), Math.round(relY2));
	const maxY = Math.max(Math.round(relY1), Math.round(relY2));

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
