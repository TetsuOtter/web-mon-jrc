import type { PropsWithChildren } from "react";
import { memo, useCallback, useEffect } from "react";

import { Graphics } from "pixi.js";

import CanvasObjectContext from "../contexts/CanvasObjectContext";
import { usePixiObject, clearContainer } from "../hooks/usePixiObject";

import type {
	ClickEventHandler,
	ClickDetector,
} from "../contexts/CanvasObjectContext";

type CanvasCircleProps = {
	readonly centerRelX: number;
	readonly centerRelY: number;
	readonly radius: number;
	readonly fillColor?: string;
	readonly strokeColor?: string;
	readonly strokeWidth?: number;
	readonly onClick?: ClickEventHandler;
};

/**
 * 円描画オブジェクト
 */
export default memo<PropsWithChildren<CanvasCircleProps>>(
	function CanvasCircle({
		centerRelX,
		centerRelY,
		radius,
		fillColor,
		strokeColor,
		strokeWidth,
		onClick,
		children,
	}) {
		const ir = Math.max(0, radius);

		const isClickDetector: ClickDetector = useCallback(
			(clickX: number, clickY: number) => {
				const dx = clickX - ir;
				const dy = clickY - ir;
				return dx * dx + dy * dy <= ir * ir;
			},
			[ir],
		);

		const { container, graphicsContainer, metadata } = usePixiObject({
			relX: centerRelX - ir,
			relY: centerRelY - ir,
			width: ir * 2,
			height: ir * 2,
			onClick,
			isClickDetector,
		});

		useEffect(() => {
			if (graphicsContainer.destroyed) return;
			clearContainer(graphicsContainer);

			const g = new Graphics();
			const sw = strokeWidth ?? 0;
			const cx = ir;
			const cy = ir;

			if (fillColor) {
				const fillRadius = Math.max(0, ir - sw / 2);
				g.circle(cx, cy, fillRadius);
				g.fill(fillColor);
			}

			if (strokeColor && sw > 0) {
				g.circle(cx, cy, ir - sw / 2);
				g.stroke({ color: strokeColor, width: sw });
			}

			graphicsContainer.addChild(g);
		}, [graphicsContainer, fillColor, strokeColor, strokeWidth, ir]);

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
