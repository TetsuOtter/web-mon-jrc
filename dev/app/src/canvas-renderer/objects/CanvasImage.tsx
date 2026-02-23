import type { PropsWithChildren } from "react";
import { memo, useCallback, useMemo } from "react";

import {
	type ClickEventHandler,
	type CanvasRenderFunction,
	useCanvasObjectContext,
} from "../contexts/CanvasObjectContext";
import { useStoredImage } from "../utils/ImageStore";

import CanvasObjectBase from "./CanvasObjectBase";

type CanvasImageProps = {
	readonly imagePath: string;
	readonly relX: number;
	readonly relY: number;
	readonly scaleX?: number;
	readonly scaleY?: number;
	readonly areaWidth?: number;
	readonly areaHeight?: number;
	readonly horizontalAlign?: "left" | "center" | "right";
	readonly verticalAlign?: "top" | "middle" | "bottom";
	readonly onClick?: ClickEventHandler;
};

export default memo<PropsWithChildren<CanvasImageProps>>(function CanvasImage({
	imagePath,
	relX: propsRelX,
	relY: propsRelY,
	scaleX = 1,
	scaleY = 1,
	areaWidth: propsAreaWidth,
	areaHeight: propsAreaHeight,
	horizontalAlign = "left",
	verticalAlign = "top",
	onClick,
	children,
}) {
	const parentObjectContext = useCanvasObjectContext();
	const imageData = useStoredImage(imagePath);
	const imageHeight = (imageData?.canvas.height ?? 0) * scaleY;
	const imageWidth = (imageData?.canvas.width ?? 0) * scaleX;
	const areaHeight = propsAreaHeight ?? parentObjectContext.metadata.height;
	const areaWidth = propsAreaWidth ?? parentObjectContext.metadata.width;

	const offsetX = useMemo((): number => {
		switch (horizontalAlign) {
			case "left":
				return 0;
			case "center":
				return -Math.round((imageWidth - areaWidth) / 2);
			case "right":
				return imageWidth - areaWidth;
		}
	}, [areaWidth, horizontalAlign, imageWidth]);

	const offsetY = useMemo((): number => {
		switch (verticalAlign) {
			case "top":
				return 0;
			case "middle":
				return -Math.round((imageHeight - areaHeight) / 2);
			case "bottom":
				return imageHeight - areaHeight;
		}
	}, [areaHeight, verticalAlign, imageHeight]);

	const relX = propsRelX + offsetX;
	const relY = propsRelY + offsetY;

	const onRender: CanvasRenderFunction = useCallback(
		(ctx, metadata) => {
			if (!imageData?.canvas) {
				return;
			}

			ctx.save();

			// 整数座標に丸める
			const ix = Math.round(metadata.absX);
			const iy = Math.round(metadata.absY);
			const iw = Math.round(metadata.width);
			const ih = Math.round(metadata.height);

			// 画像を描画
			ctx.imageSmoothingEnabled = false;
			ctx.drawImage(imageData.canvas, ix, iy, iw, ih);

			ctx.restore();
		},
		[imageData]
	);

	return (
		<CanvasObjectBase
			onRender={onRender}
			onClick={onClick}
			relX={relX}
			relY={relY}
			width={imageWidth}
			height={imageHeight}
			isFilled>
			{children}
		</CanvasObjectBase>
	);
});
