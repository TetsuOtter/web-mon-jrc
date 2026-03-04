import type { PropsWithChildren } from "react";
import { memo, useCallback } from "react";

import CanvasObjectBase from "./CanvasObjectBase";

import type {
	ClickEventHandler,
	ClickDetector,
	CanvasRenderFunction,
} from "../contexts/CanvasObjectContext";

type CanvasDotPatternProps = {
	readonly image: readonly string[] | undefined;
	readonly x: number;
	readonly y: number;
	readonly scaleX?: number;
	readonly scaleY?: number;
	readonly color?: string;
	readonly onClick?: ClickEventHandler;
};

/**
 * ドットパターン描画オブジェクト
 * 文字列配列で表現されたパターン（"1"は塗る、"0"は塗らない）を描画
 * 例：
 * [
 *   "1111",
 *   "1001",
 *   "1001",
 *   "1111",
 * ]
 */
export default memo<PropsWithChildren<CanvasDotPatternProps>>(
	function CanvasDotPattern({
		image,
		x,
		y,
		scaleX = 1,
		scaleY = 1,
		color = "#000000",
		onClick,
		children,
	}) {
		// 画像サイズを計算
		const imageWidth = image != null && image.length > 0 ? image[0].length : 0;
		const imageHeight = image?.length ?? 0;
		const width = imageWidth * scaleX;
		const height = imageHeight * scaleY;

		const onRender: CanvasRenderFunction = useCallback(
			async (ctx, metadata) => {
				if (image == null) {
					return;
				}
				ctx.save();

				// 各ドット位置を計算して描画
				for (let row = 0; row < imageHeight; row++) {
					const line = image[row];
					for (let col = 0; col < line.length; col++) {
						if (line[col] === "1") {
							const dotX = Math.round(metadata.absX) + col * scaleX;
							const dotY = Math.round(metadata.absY) + row * scaleY;
							const dotW = Math.ceil(scaleX);
							const dotH = Math.ceil(scaleY);

							ctx.fillStyle = color;
							ctx.fillRect(dotX, dotY, dotW, dotH);
						}
					}
				}

				ctx.restore();
			},
			[image, scaleX, scaleY, color, imageHeight]
		);

		const isClickDetector: ClickDetector = useCallback(
			(clickX: number, clickY: number) => {
				// clickX, clickY は相対座標（このオブジェクトの左上を原点とした座標）
				return (
					clickX >= 0 && clickX <= width && clickY >= 0 && clickY <= height
				);
			},
			[width, height]
		);

		return (
			<CanvasObjectBase
				onRender={onRender}
				onClick={onClick}
				isClickDetector={isClickDetector}
				relX={x}
				relY={y}
				width={width}
				height={height}
				isFilled>
				{children}
			</CanvasObjectBase>
		);
	}
);
