import type { PropsWithChildren } from "react";
import { memo, useEffect } from "react";

import { Graphics } from "pixi.js";

import CanvasObjectContext from "../contexts/CanvasObjectContext";
import { usePixiObject, clearContainer } from "../hooks/usePixiObject";

import type { ClickEventHandler } from "../contexts/CanvasObjectContext";

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
	const { container, graphicsContainer, metadata } = usePixiObject({
		relX,
		relY,
		width,
		height,
		onClick,
	});

	useEffect(() => {
		if (graphicsContainer.destroyed) return;
		clearContainer(graphicsContainer);

		if (!fillColor && (!strokeColor || !strokeWidth)) return;

		const g = new Graphics();
		const sw = strokeWidth ?? 0;
		const iw = Math.round(metadata.width);
		const ih = Math.round(metadata.height);

		if (fillColor && fillColor !== "transparent") {
			g.rect(sw, sw, iw - sw * 2, ih - sw * 2);
			g.fill(fillColor);
		}

		if (strokeColor && sw > 0) {
			g.rect(sw / 2, sw / 2, iw - sw, ih - sw);
			g.stroke({ color: strokeColor, width: sw });
		}

		graphicsContainer.addChild(g);
	}, [
		graphicsContainer,
		fillColor,
		strokeColor,
		strokeWidth,
		metadata.width,
		metadata.height,
	]);

	return (
		<CanvasObjectContext
			pixiContainer={container}
			metadata={metadata}
		>
			{children}
		</CanvasObjectContext>
	);
});
