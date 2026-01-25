import type { PropsWithChildren } from "react";
import { memo, useCallback } from "react";

import CanvasObjectBase from "./CanvasObjectBase";

import type {
	CanvasRenderFunction,
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
 * 角丸の円部分のクリック判定
 * @param clickX クリック相対 X 座標
 * @param clickY クリック相対 Y 座標
 * @param centerX 円の中心 X 座標
 * @param centerY 円の中心 Y 座標
 * @param radius 円の半径
 * @returns クリックが円内に含まれるか
 */
function isClickInRoundedCorner(
	clickX: number,
	clickY: number,
	centerX: number,
	centerY: number,
	radius: number
): boolean {
	const dx = clickX - centerX;
	const dy = clickY - centerY;
	return dx * dx + dy * dy <= radius * radius;
}

/**
 * 角丸の円を描画
 * @param ctx Canvas 2D context
 * @param centerX 円の中心 X 座標
 * @param centerY 円の中心 Y 座標
 * @param radius 円の半径
 * @param minDx X 方向の最小値
 * @param maxDx X 方向の最大値
 * @param minDy Y 方向の最小値
 * @param maxDy Y 方向の最大値
 */
function drawRoundedCorner(
	ctx: CanvasRenderingContext2D,
	centerX: number,
	centerY: number,
	radius: number,
	minDx: number,
	maxDx: number,
	minDy: number,
	maxDy: number
): void {
	for (let dy = minDy; dy < maxDy; dy++) {
		for (let dx = minDx; dx <= maxDx; dx++) {
			if (dx * dx + dy * dy <= radius * radius) {
				ctx.fillRect(Math.floor(centerX + dx), Math.floor(centerY + dy), 1, 1);
			}
		}
	}
}

/**
 * 角丸矩形描画オブジェクト
 * ドット描画により高解像度でも滑らかさを維持
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
		const onRender: CanvasRenderFunction = useCallback(
			async (ctx, metadata) => {
				ctx.save();

				if (fillColor) {
					ctx.fillStyle = fillColor;

					const absX = metadata.absX;
					const absY = metadata.absY;
					const r = Math.min(radius, width / 2, height / 2);

					// 矩形の中心部分（上下の直線部分）
					for (let y = absY + r; y < absY + height - r; y++) {
						for (let x = absX; x < absX + width; x++) {
							ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
						}
					}

					// 左右の直線部分（上下の角丸部分を除外）
					for (let x = absX + r; x < absX + width - r; x++) {
						for (let y = absY; y < absY + height; y++) {
							ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
						}
					}

					// 四隅の角丸部分
					// 左上
					const ltCenterX = absX + r - 0.5;
					const ltCenterY = absY + r - 0.5;
					drawRoundedCorner(
						ctx,
						ltCenterX,
						ltCenterY,
						r,
						-r + 0.5,
						0.5,
						-r + 0.5,
						0.5
					);

					// 右上
					const rtCenterX = absX + width - r - 0.5;
					const rtCenterY = absY + r - 0.5;
					drawRoundedCorner(
						ctx,
						rtCenterX,
						rtCenterY,
						r,
						-0.5,
						r - 0.5,
						-r + 0.5,
						0.5
					);

					// 左下
					const lbCenterX = absX + r - 0.5;
					const lbCenterY = absY + height - r - 0.5;
					drawRoundedCorner(
						ctx,
						lbCenterX,
						lbCenterY,
						r,
						-r + 0.5,
						0.5,
						-0.5,
						r - 0.5
					);

					// 右下
					const rbCenterX = absX + width - r - 0.5;
					const rbCenterY = absY + height - r - 0.5;
					drawRoundedCorner(
						ctx,
						rbCenterX,
						rbCenterY,
						r,
						-0.5,
						r - 0.5,
						-0.5,
						r - 0.5
					);
				}

				ctx.restore();
			},
			[fillColor, width, height, radius]
		);

		const isClickDetector: ClickDetector = useCallback(
			(clickX: number, clickY: number) => {
				// clickX, clickY は相対座標（バウンディングボックスの中心を基準とした座標）
				const r = Math.min(radius, width / 2, height / 2);

				// 矩形の直線部分に含まれるか
				if (clickX >= r && clickX < width - r) {
					return clickY >= 0 && clickY < height;
				}
				if (clickY >= r && clickY < height - r) {
					return clickX >= 0 && clickX < width;
				}

				// 四隅の角丸部分に含まれるか
				// 左上
				if (clickX < r && clickY < r) {
					return isClickInRoundedCorner(clickX, clickY, r, r, r);
				}

				// 右上
				if (clickX >= width - r && clickY < r) {
					return isClickInRoundedCorner(clickX, clickY, width - r, r, r);
				}

				// 左下
				if (clickX < r && clickY >= height - r) {
					return isClickInRoundedCorner(clickX, clickY, r, height - r, r);
				}

				// 右下
				if (clickX >= width - r && clickY >= height - r) {
					return isClickInRoundedCorner(
						clickX,
						clickY,
						width - r,
						height - r,
						r
					);
				}

				return false;
			},
			[width, height, radius]
		);

		return (
			<CanvasObjectBase
				onRender={onRender}
				onClick={onClick}
				isClickDetector={isClickDetector}
				relX={relX}
				relY={relY}
				width={width}
				height={height}
				isFilled={!!fillColor}>
				{children}
			</CanvasObjectBase>
		);
	}
);
