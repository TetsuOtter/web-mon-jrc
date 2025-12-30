import type { CSSProperties, PropsWithChildren } from "react";
import { memo, useMemo } from "react";

import { CanvasRenderer } from "../canvas-renderer";

type MonitorCanvasProps = {
	height: number;
	width: number;
	disableAutoScale?: boolean;
};
export default memo<PropsWithChildren<MonitorCanvasProps>>(
	function MonitorCanvas({ height, width, disableAutoScale, children }) {
		const canvasStyle = useMemo((): CSSProperties => {
			if (disableAutoScale) {
				return {
					objectFit: "contain",
				};
			} else {
				return {
					width: "100%",
					height: "100%",
					objectFit: "contain",
				};
			}
		}, [disableAutoScale]);
		return (
			<div style={CONTAINER_STYLE}>
				<CanvasRenderer
					width={width}
					height={height}
					style={canvasStyle}
					fill="black">
					{children}
				</CanvasRenderer>
			</div>
		);
	}
);

const CONTAINER_STYLE = {
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	width: "100vw",
	height: "100vh",
	backgroundColor: "#111",
	margin: 0,
	padding: 0,
	overflow: "hidden",
	minWidth: "100vw",
	minHeight: "100vh",
} as const satisfies CSSProperties;
