import type { PropsWithChildren } from "react";
import { memo, useCallback } from "react";

import CanvasObjectBase from "./CanvasObjectBase";

import type {
	ClickEventHandler,
	CanvasRenderFunction,
} from "../contexts/CanvasObjectContext";

type CanvasRectProps = {
	readonly relX: number;
	readonly relY: number;
	readonly width: number;
	readonly height: number;
	readonly fillColor?: string;
	readonly strokeColor?: string;
	readonly strokeWidth?: number;
	readonly onClick?: ClickEventHandler;
};

/**
 * 四角形描画オブジェクト
 * 縁取りあり・なし対応
 * アンチエイリアスなしで鮮明に描画
 */
export default memo<PropsWithChildren<CanvasRectProps>>(function CanvasRect({
	relX,
	relY,
	width,
	height,
	fillColor,
	strokeColor,
	strokeWidth,
	onClick,
	children,
}) {
	const onRender: CanvasRenderFunction = useCallback(
		async (ctx, metadata) => {
			ctx.save();

			// 整数座標に丸める
			const ix = Math.round(metadata.absX);
			const iy = Math.round(metadata.absY);
			const iw = Math.round(metadata.width);
			const ih = Math.round(metadata.height);
			const sw = strokeWidth || 0;

			// 塗りつぶし描画 - ストロークを含めて指定サイズ内に収める
			if (fillColor) {
				ctx.fillStyle = fillColor;
				ctx.fillRect(ix + sw, iy + sw, iw - sw * 2, ih - sw * 2);
			}

			// 縁取り描画 - バウンディングボックスに沿って描画
			if (strokeColor && 0 < sw) {
				ctx.strokeStyle = strokeColor;
				ctx.lineWidth = sw;
				ctx.strokeRect(ix + sw / 2, iy + sw / 2, iw - sw, ih - sw);
			}

			ctx.restore();
		},
		[fillColor, strokeColor, strokeWidth]
	);

	return (
		<CanvasObjectBase
			onRender={onRender}
			onClick={onClick}
			relX={relX}
			relY={relY}
			width={width}
			height={height}
			isFilled={!!fillColor}>
			{children}
		</CanvasObjectBase>
	);
});
