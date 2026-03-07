import type { PropsWithChildren } from "react";
import { memo, useCallback, useMemo } from "react";

import CanvasObjectBase from "@web-mon-jrc/canvas-renderer/objects/CanvasObjectBase";

import {
	getRoundedButtonImage,
	QUADRANT_SIZE,
} from "./roundedButtonImageCache";

import type {
	CanvasRenderFunction,
	ClickEventHandler,
} from "@web-mon-jrc/canvas-renderer/contexts/CanvasObjectContext";
import type { RgbColor } from "@web-mon-jrc/canvas-renderer/utils/colorUtil";

type RoundedButtonProps = {
	readonly relX: number;
	readonly relY: number;
	readonly width?: number;
	readonly height?: number;
	readonly fillColor: RgbColor;
	readonly onClick?: () => void;
};

export default memo<PropsWithChildren<RoundedButtonProps>>(
	function RoundedButton({
		relX,
		relY,
		width = QUADRANT_SIZE * 2,
		height = QUADRANT_SIZE * 2,
		fillColor,
		onClick,
		children,
	}) {
		const buttonImageData = useMemo(
			() => getRoundedButtonImage(width, height, fillColor),
			[width, height, fillColor],
		);

		const handleClick: ClickEventHandler = useCallback(() => {
			onClick?.();
			return true;
		}, [onClick]);

		const onRender: CanvasRenderFunction = useCallback(
			async (ctx, metadata) => {
				ctx.save();

				// 整数座標に丸める
				const ix = Math.round(metadata.absX);
				const iy = Math.round(metadata.absY);
				const iw = Math.round(metadata.width);
				const ih = Math.round(metadata.height);

				// ボタン画像を描画
				ctx.imageSmoothingEnabled = false;
				ctx.drawImage(buttonImageData, ix, iy, iw, ih);

				ctx.restore();
			},
			[buttonImageData],
		);

		return (
			<CanvasObjectBase
				onRender={onRender}
				onClick={onClick ? handleClick : undefined}
				relX={relX}
				relY={relY}
				width={width}
				height={height}
				isFilled
			>
				{children}
			</CanvasObjectBase>
		);
	},
);
