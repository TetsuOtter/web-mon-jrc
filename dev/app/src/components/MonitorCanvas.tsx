import type { CSSProperties, PropsWithChildren } from "react";
import { memo, useMemo } from "react";

import { CanvasRenderer } from "../canvas-renderer";

type MonitorCanvasProps = {
	height: number;
	width: number;
	disableAutoScale?: boolean;
	bgimg?: string;
};
export default memo<PropsWithChildren<MonitorCanvasProps>>(
	function MonitorCanvas({ height, width, disableAutoScale, bgimg, children }) {
		const canvasStyle = useMemo((): CSSProperties => {
			const baseStyle: CSSProperties = {
				objectFit: "contain",
			};
			if (bgimg) {
				baseStyle.opacity = 0.6;
			}

			if (disableAutoScale) {
				return baseStyle;
			} else {
				return {
					...baseStyle,
					width: "100%",
					height: "100%",
				};
			}
		}, [disableAutoScale, bgimg]);

		const imgStyle = useMemo((): CSSProperties => {
			const baseImgStyle: CSSProperties = {
				position: "absolute",
				top: 0,
				left: 0,
				objectFit: "contain",
			};

			if (disableAutoScale) {
				return baseImgStyle;
			} else {
				return {
					...baseImgStyle,
					width: "100%",
					height: "100%",
				};
			}
		}, [disableAutoScale]);

		return (
			<div style={CONTAINER_STYLE}>
				{bgimg && (
					<img
						src={bgimg}
						style={imgStyle}
						alt="background"
					/>
				)}
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
	position: "relative",
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
