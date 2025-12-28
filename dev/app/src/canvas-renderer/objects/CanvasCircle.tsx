import type { PropsWithChildren } from "react";
import { memo, useCallback } from "react";

import CanvasObjectBase from "./CanvasObjectBase";

import type {
	CanvasRenderFunction,
	ClickEventHandler,
	ClickDetector,
} from "../contexts/CanvasObjectContext";

type CanvasCircleProps = {
	readonly relX: number;
	readonly relY: number;
	readonly radius: number;
	readonly fillColor?: string;
	readonly strokeColor?: string;
	readonly strokeWidth?: number;
	readonly onClick?: ClickEventHandler;
};

/**
 * 円描画オブジェクト
 * ドット描画により高解像度でも滑らかさを維持
 * 縁取りあり・なし対応
 */
export default memo<PropsWithChildren<CanvasCircleProps>>(
	function CanvasCircle({
		relX,
		relY,
		radius,
		fillColor,
		strokeColor,
		strokeWidth,
		onClick,
		children,
	}) {
		const onRender: CanvasRenderFunction = useCallback(
			async (ctx, metadata) => {
				ctx.save();

				// 中心座標を計算（バウンディングボックス内に収めるため、0.5オフセット）
				const ix = metadata.absX + radius - 0.5;
				const iy = metadata.absY + radius - 0.5;
				const sw = strokeWidth || 0;

				// fillColorがある場合は塗りつぶし
				if (fillColor) {
					ctx.fillStyle = fillColor;
					// ストローク幅を考慮した内側の円の半径
					const fillRadius = Math.max(0, radius - sw / 2);

					// 塗りつぶし部分を描画
					for (let dy = -fillRadius + 0.5; dy < fillRadius + 0.5; dy++) {
						for (let dx = -fillRadius + 0.5; dx < fillRadius + 0.5; dx++) {
							if (dx * dx + dy * dy <= fillRadius * fillRadius) {
								ctx.fillRect(Math.floor(ix + dx), Math.floor(iy + dy), 1, 1);
							}
						}
					}
				}

				// strokeColorがある場合は縁取り - バウンディングボックス内に収める
				if (strokeColor && sw > 0) {
					ctx.fillStyle = strokeColor;
					// ストローク領域：指定の幅で円周を描画（外側半径は radius に制限）
					const outerRadius = radius;
					const innerRadiusForStroke = Math.max(0, radius - sw);

					// 円環領域にドットを描画
					for (let dy = -outerRadius + 0.5; dy < outerRadius + 0.5; dy++) {
						for (let dx = -outerRadius + 0.5; dx < outerRadius + 0.5; dx++) {
							const distSq = dx * dx + dy * dy;
							if (
								distSq <= outerRadius * outerRadius &&
								distSq >= innerRadiusForStroke * innerRadiusForStroke
							) {
								ctx.fillRect(Math.floor(ix + dx), Math.floor(iy + dy), 1, 1);
							}
						}
					}
				}

				ctx.restore();
			},
			[fillColor, strokeColor, strokeWidth, radius]
		);

		const isClickDetector: ClickDetector = useCallback(
			(clickX: number, clickY: number) => {
				// clickX, clickY は相対座標（バウンディングボックスの中心を基準とした座標）
				const ir = Math.max(0, radius);
				const dx = clickX - ir;
				const dy = clickY - ir;
				return dx * dx + dy * dy <= ir * ir;
			},
			[radius]
		);

		const ir = Math.max(0, radius);

		return (
			<CanvasObjectBase
				onRender={onRender}
				onClick={onClick}
				isClickDetector={isClickDetector}
				relX={relX - ir}
				relY={relY - ir}
				width={ir * 2}
				height={ir * 2}
				isFilled={!!fillColor}>
				{children}
			</CanvasObjectBase>
		);
	}
);
