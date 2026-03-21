import { memo, useEffect } from "react";

import { CanvasRenderer, CanvasRect } from "@web-mon-jrc/canvas-renderer";
import CanvasQuadrilateral from "@web-mon-jrc/canvas-renderer/objects/CanvasQuadrilateral";

export type Step = 0 | 1 | 2 | 3;

type CanvasRendererTestProps = {
	readonly step: Step;
	readonly addLog: (msg: string) => void;
};

/** CanvasRenderer を含む部分を別コンポーネントに分離して、マウント/アンマウントを制御 */
export default memo(function CanvasRendererTest({
	step,
	addLog,
}: CanvasRendererTestProps) {
	useEffect(() => {
		addLog("CanvasRendererTest mounted");
		return () => addLog("CanvasRendererTest cleanup");
	}, [addLog]);

	return (
		<CanvasRenderer
			width={200}
			height={200}
			fill="white"
			style={{
				border: "2px solid black",
				width: "200px",
				height: "200px",
				display: "inline-flex",
			}}
		>
			{step >= 2 && (
				<CanvasRect
					relX={10}
					relY={10}
					width={80}
					height={80}
					fillColor="blue"
				/>
			)}
			{step >= 3 && (
				<CanvasQuadrilateral
					xL1={20}
					yL1={10}
					xL2={10}
					yL2={40}
					xR1={40}
					yR1={10}
					xR2={30}
					yR2={40}
					strokeColor="red"
					fillColor="black"
					lineWidth={4}
				/>
			)}
		</CanvasRenderer>
	);
});
