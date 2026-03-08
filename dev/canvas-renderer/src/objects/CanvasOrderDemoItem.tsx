import type { PropsWithChildren } from "react";
import { memo, useCallback, useEffect, useState } from "react";

import { Graphics, Text } from "pixi.js";

import CanvasObjectContext from "../contexts/CanvasObjectContext";
import { usePixiObject, clearContainer } from "../hooks/usePixiObject";

import type { ClickEventHandler } from "../contexts/CanvasObjectContext";

type CanvasOrderDemoItemProps = {
	relX: number;
	relY: number;
	width: number;
	height: number;
	label: string;
	color: string;
	onClick?: ClickEventHandler;
};

/**
 * 描画順序デモ用のCanvasObject
 */
export default memo<PropsWithChildren<CanvasOrderDemoItemProps>>(
	function CanvasOrderDemoItem({
		relX,
		relY,
		width,
		height,
		label,
		color,
		onClick,
		children,
	}) {
		const [count, setCount] = useState(0);

		const handleClick: ClickEventHandler = useCallback(
			async (relX, relY) => {
				setCount((prev) => prev + 1);
				if (onClick) {
					const handled = await onClick(relX, relY);
					if (handled) return true;
				}
				return true;
			},
			[onClick],
		);

		const { container, graphicsContainer, metadata } = usePixiObject({
			relX,
			relY,
			width,
			height,
			onClick: handleClick,
		});

		useEffect(() => {
			if (graphicsContainer.destroyed) return;
			clearContainer(graphicsContainer);

			const g = new Graphics();
			g.rect(0, 0, metadata.width, metadata.height);
			g.fill(color);
			g.rect(0, 0, metadata.width, metadata.height);
			g.stroke({ color: "#000000", width: 2 });
			graphicsContainer.addChild(g);

			const labelText = new Text({
				text: `${label} (${count})`,
				style: {
					fontFamily: "Arial",
					fontSize: 14,
					fontWeight: "bold",
					fill: "#000000",
				},
			});
			labelText.x = metadata.width / 2 - labelText.width / 2;
			labelText.y = metadata.height / 2 - labelText.height / 2;
			graphicsContainer.addChild(labelText);
		}, [
			graphicsContainer,
			color,
			count,
			label,
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
	},
);
