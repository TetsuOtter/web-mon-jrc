import type {
	CSSProperties,
	PropsWithChildren,
	ReactNode,
	RefCallback,
} from "react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

import CanvasObjectContext from "./contexts/CanvasObjectContext";
import { RenderRequesterContext } from "./contexts/RenderRequestContext";
import { intersectsRects, mergeRenderAreas } from "./utils/renderGeometry";

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
	fill?: CanvasFillStrokeStyles["fillStyle"];
	style?: CSSProperties;
	children: ReactNode;
	renderRequestCount?: number;
};
export default memo<PropsWithChildren<CanvasRendererProps>>(
	function CanvasRenderer({
		width,
		height,
		fill,
		style: styleProps,
		children,
		renderRequestCount,
	}) {
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

			// ダーティ領域をマージして最小セットに
			const mergedAreas = mergeRenderAreas(renderRequestedAreaList);

			// 1. ダーティ領域のみクリア（背景色があれば塗りつぶし）
			mergedAreas.forEach((area) => {
				if (fill) {
					ctx.fillStyle = fill;
					ctx.fillRect(area.absX, area.absY, area.width, area.height);
				} else {
					ctx.clearRect(area.absX, area.absY, area.width, area.height);
				}
			});

			// 2. ダーティ領域のみを描画するようクリップを設定
			ctx.save();
			ctx.beginPath();
			mergedAreas.forEach((area) => {
				ctx.rect(area.absX, area.absY, area.width, area.height);
			});
			ctx.clip();

			// 3. ダーティ領域と交差するオブジェクトのみ描画（Z-order 保持）
			const renderPromises: Promise<void>[] = [];
			for (const obj of registeredObjectListRef.current) {
				if (mergedAreas.some((area) => intersectsRects(obj.metadata, area))) {
					const result = obj.onRender(ctx, obj.metadata, mergedAreas);
					if (result instanceof Promise) {
						renderPromises.push(result);
					}
				}
			}

			// 非同期描画が完了したらクリップを解除
			if (renderPromises.length > 0) {
				Promise.all(renderPromises)
					.then(() => {
						ctx.restore();
					})
					.catch((error) => {
						console.error("Error during canvas render:", error);
						ctx.restore();
					});
			} else {
				ctx.restore();
			}

			setRenderRequestedAreaList([]);
		}, [ctx, height, renderRequestedAreaList, width, fill]);

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

				// objectFit: "contain"が適用されている場合、実際に表示されている領域を計算
				const displayAspectRatio = rect.width / rect.height;
				const canvasAspectRatio = canvas.width / canvas.height;

				let displayWidth: number;
				let displayHeight: number;
				let offsetX: number;
				let offsetY: number;

				if (displayAspectRatio > canvasAspectRatio) {
					// 高さで制限される（幅に空白がある）
					displayHeight = rect.height;
					displayWidth = displayHeight * canvasAspectRatio;
					offsetX = (rect.width - displayWidth) / 2;
					offsetY = 0;
				} else {
					// 幅で制限される（高さに空白がある）
					displayWidth = rect.width;
					displayHeight = displayWidth / canvasAspectRatio;
					offsetX = 0;
					offsetY = (rect.height - displayHeight) / 2;
				}

				// マウス座標が表示領域内かチェック
				const mouseX = event.clientX - rect.left;
				const mouseY = event.clientY - rect.top;

				if (
					mouseX < offsetX ||
					mouseX > offsetX + displayWidth ||
					mouseY < offsetY ||
					mouseY > offsetY + displayHeight
				) {
					return;
				}

				// Canvas論理座標に変換
				const relativeX = (mouseX - offsetX) / displayWidth;
				const relativeY = (mouseY - offsetY) / displayHeight;
				const absX = relativeX * width;
				const absY = relativeY * height;

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
						(0 <= relX && relX <= m.width && 0 <= relY && relY <= m.height);
					if (isClicked) {
						const handled = await obj.onClickHandler(relX, relY);
						if (handled || handled == null) {
							break; // イベントが処理されたら終了
						}
					}
				}
			},
			[height, width]
		);

		const style = useMemo(
			() => ({
				width: `${width * scale}px`,
				height: `${height * scale}px`,
				...styleProps,
			}),
			[styleProps, width, height, scale]
		);

		return (
			<RenderRequesterContext.Provider value={requestRender}>
				<canvas
					ref={canvasRefCallback}
					onClick={handleCanvasClick}
					height={height * scale}
					width={width * scale}
					style={style}
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
