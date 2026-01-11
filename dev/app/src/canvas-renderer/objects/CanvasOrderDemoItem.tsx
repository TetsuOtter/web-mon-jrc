import type { PropsWithChildren } from "react";
import { memo, useCallback, useState } from "react";

import CanvasObjectBase from "./CanvasObjectBase";

import type {
	CanvasRenderFunction,
	ClickEventHandler,
} from "../contexts/CanvasObjectContext";

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
 * 図形と共にラベルを描画し、描画順序の変化を視覚的に確認できる
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

		const onRender: CanvasRenderFunction = useCallback(
			(ctx, metadata) => {
				// 図形を描画
				ctx.fillStyle = color;
				ctx.fillRect(
					metadata.relX,
					metadata.relY,
					metadata.width,
					metadata.height
				);

				// 枠線を描画
				ctx.strokeStyle = "#000000";
				ctx.lineWidth = 2;
				ctx.strokeRect(
					metadata.relX,
					metadata.relY,
					metadata.width,
					metadata.height
				);

				// ラベルを描画
				ctx.fillStyle = "#000000";
				ctx.font = "bold 14px Arial";
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.fillText(
					label + " (" + count + ")",
					metadata.relX + metadata.width / 2,
					metadata.relY + metadata.height / 2
				);
			},
			[color, count, label]
		);

		const handleClick: ClickEventHandler = useCallback(
			async (relX, relY) => {
				setCount((prev) => prev + 1);
				if (onClick) {
					const handled = await onClick(relX, relY);
					if (handled) {
						return true;
					}
				}
				return true;
			},
			[onClick]
		);

		return (
			<CanvasObjectBase
				onRender={onRender}
				onClick={handleClick}
				relX={relX}
				relY={relY}
				width={width}
				height={height}
				isFilled>
				{children}
			</CanvasObjectBase>
		);
	}
);
