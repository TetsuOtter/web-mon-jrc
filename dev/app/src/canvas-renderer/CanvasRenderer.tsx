import type { PropsWithChildren, ReactNode, RefCallback } from "react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

import CanvasObjectContext from "./contexts/CanvasObjectContext";
import { RenderRequesterContext } from "./contexts/RenderRequestContext";

import type {
	CanvasObjectMetadata,
	CanvasRenderFunctionObject,
} from "./contexts/CanvasObjectContext";
import type {
	RenderRequestContextType,
	RenderArea,
} from "./contexts/RenderRequestContext";

type CanvasRendererProps = {
	width: number;
	height: number;
	children: ReactNode;
	renderRequestCount?: number;
};
export default memo<PropsWithChildren<CanvasRendererProps>>(
	function CanvasRenderer({ width, height, children, renderRequestCount }) {
		const registeredObjectListRef = useRef<CanvasRenderFunctionObject[]>([]);

		const [renderRequestedAreaList, setRenderRequestedAreaList] = useState<
			RenderArea[]
		>([]);

		const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
		const [scale, setScale] = useState<number>(window.devicePixelRatio || 1);
		const canvasMetadata: CanvasObjectMetadata = useMemo(
			() => ({
				absX: 0,
				absY: 0,
				relX: 0,
				relY: 0,
				width,
				height,
				isFilled: true,
			}),
			[width, height]
		);

		const requestRender: RenderRequestContextType = useCallback((area) => {
			setRenderRequestedAreaList((prev) => [...prev, area]);
		}, []);
		useEffect(() => {
			setRenderRequestedAreaList([canvasMetadata]);
		}, [canvasMetadata, renderRequestCount]);

		useEffect(() => {
			if (renderRequestedAreaList.length === 0 || !ctx) {
				return;
			}
			renderRequestedAreaList.forEach((area) => {
				ctx.clearRect(area.absX, area.absY, area.width, area.height);
			});
			// リスト順に従って描画
			registeredObjectListRef.current.forEach((obj) => {
				obj.onRender(ctx, obj.metadata, renderRequestedAreaList);
			});
			setRenderRequestedAreaList([]);
		}, [ctx, renderRequestedAreaList]);

		useEffect(() => {
			const targetCtx = ctx;
			if (!targetCtx) {
				return;
			}
			const updateScale = () => {
				const dpr = window.devicePixelRatio || 1;
				targetCtx.clearRect(0, 0, width * dpr, height * dpr);
				targetCtx.scale(dpr, dpr);
				setScale(dpr);
				setRenderRequestedAreaList([canvasMetadata]);
			};

			updateScale();
			window.addEventListener("dpichange", updateScale);
			return () => {
				window.removeEventListener("dpichange", updateScale);
			};
		}, [ctx, canvasMetadata, width, height]);

		const canvasRefCallback: RefCallback<HTMLCanvasElement> = useCallback(
			(canvas) => {
				const context = canvas?.getContext("2d");
				if (context) {
					setCtx(context);
				} else {
					setCtx(null);
				}
			},
			[]
		);

		const handleCanvasClick = useCallback(
			async (event: React.MouseEvent<HTMLCanvasElement>) => {
				const canvas = event.currentTarget;
				const rect = canvas.getBoundingClientRect();
				const absX = event.clientX - rect.left;
				const absY = event.clientY - rect.top;

				// オブジェクトを Z-order（逆順）で走査して、最初にマッチしたものだけハンドルする
				const objectsArray = registeredObjectListRef.current;
				for (let i = objectsArray.length - 1; i >= 0; i--) {
					const obj = objectsArray[i];
					if (!obj.onClickHandler) {
						continue;
					}
					const m = obj.metadata;
					const relX = absX - m.absX;
					const relY = absY - m.absY;
					const isClicked =
						(await obj.isClickDetector?.(relX, relY)) ??
						(m.absX <= absX &&
							absX <= m.absX + m.width &&
							m.absY <= absY &&
							absY <= m.absY + m.height);
					if (isClicked) {
						await obj.onClickHandler(relX, relY);
						break; // 最初にマッチしたオブジェクトのハンドラーだけ呼び出して終了
					}
				}
			},
			[]
		);

		return (
			<RenderRequesterContext.Provider value={requestRender}>
				<canvas
					ref={canvasRefCallback}
					onClick={handleCanvasClick}
					height={height * scale}
					width={width * scale}
					style={{
						border: "1px solid #ccc",
						display: "block",
						width: `${width}px`,
						height: `${height}px`,
					}}
				/>
				<CanvasObjectContext
					registeredObjectListRef={registeredObjectListRef}
					metadata={canvasMetadata}>
					{children}
				</CanvasObjectContext>
			</RenderRequesterContext.Provider>
		);
	}
);
