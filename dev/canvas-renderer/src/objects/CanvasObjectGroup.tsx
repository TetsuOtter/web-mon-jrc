import type { PropsWithChildren } from "react";
import { memo } from "react";

import CanvasObjectContext from "../contexts/CanvasObjectContext";
import { usePixiObject } from "../hooks/usePixiObject";

import type {
	ClickEventHandler,
	ClickDetector,
} from "../contexts/CanvasObjectContext";

type CanvasObjectGroupProps = {
	onClick?: ClickEventHandler;
	isClickDetector?: ClickDetector;
	relX: number;
	relY: number;
	width: number;
	height: number;
};

/**
 * 位置・サイズ情報を持つグループコンポーネント
 * 自身は描画せず、子要素のみを表示する
 */
export default memo<PropsWithChildren<CanvasObjectGroupProps>>(
	function CanvasObjectGroup({
		onClick,
		isClickDetector,
		relX,
		relY,
		width,
		height,
		children,
	}) {
		const { container, metadata } = usePixiObject({
			relX,
			relY,
			width,
			height,
			onClick,
			isClickDetector,
		});

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
