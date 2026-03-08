import { memo, useState, useEffect } from "react";

import { CanvasRect, CanvasText } from "@web-mon-jrc/canvas-renderer";

type BlinkingItemProps = {
	readonly relX: number;
	readonly relY: number;
	readonly width: number;
	readonly height: number;
	readonly intervalMs: number;
	readonly fillColor: string;
	readonly strokeColor: string;
	readonly label: string;
};

/** CanvasRenderer の子として使う点滅コンポーネント。
 *  visible が false のとき null を返してキャンバスオブジェクトを解除し、
 *  requestRender でその領域だけ再描画をトリガーする。 */
export default memo(function BlinkingItem({
	relX,
	relY,
	width,
	height,
	intervalMs,
	fillColor,
	strokeColor,
	label,
}: BlinkingItemProps) {
	const [visible, setVisible] = useState(true);

	useEffect(() => {
		const id = setInterval(() => {
			setVisible((v) => !v);
		}, intervalMs);
		return () => clearInterval(id);
	}, [relX, relY, width, height, intervalMs]);

	if (!visible) return null;

	return (
		<>
			<CanvasRect
				relX={relX}
				relY={relY}
				width={width}
				height={height}
				fillColor={fillColor}
				strokeColor={strokeColor}
				strokeWidth={2}
			/>
			<CanvasText
				relX={relX}
				relY={relY}
				maxWidthPx={width}
				maxHeightPx={height}
				text={label}
				fillColor="#333333"
				align="center"
				verticalAlign="center"
				lineHeight={1.4}
			/>
		</>
	);
});
