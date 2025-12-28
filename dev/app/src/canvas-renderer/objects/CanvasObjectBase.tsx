import type { PropsWithChildren } from "react";
import { memo, useCallback, useEffect, useId, useMemo, useRef } from "react";

import CanvasObjectContext, {
	useCanvasObjectContext,
	useCanvasChildIndex,
} from "../contexts/CanvasObjectContext";

import type {
	ClickEventHandler,
	ClickDetector,
	CanvasObjectMetadata,
	CanvasRenderFunctionObject,
	CanvasRenderFunction,
} from "../contexts/CanvasObjectContext";

type CanvasObjectBaseProps = {
	onRender: CanvasRenderFunction;
	onClick?: ClickEventHandler;
	isClickDetector?: ClickDetector;
	relX: number;
	relY: number;
	width: number;
	height: number;
	isFilled: boolean;
};
export default memo<PropsWithChildren<CanvasObjectBaseProps>>(
	function CanvasObjectBase({
		onRender: propsOnRender,
		onClick,
		isClickDetector,
		relX,
		relY,
		width,
		height,
		isFilled,
		children,
	}) {
		const parentObjectContext = useCanvasObjectContext();
		const childIndex = useCanvasChildIndex();
		const metadata: CanvasObjectMetadata = useMemo(
			() => ({
				absX: relX + parentObjectContext.metadata.absX,
				absY: relY + parentObjectContext.metadata.absY,
				relX,
				relY,
				width,
				height,
				isFilled,
			}),
			[relX, relY, width, height, isFilled, parentObjectContext]
		);

		const registeredObjectListRef = useRef<CanvasRenderFunctionObject[]>([]);

		const onRender: CanvasRenderFunction = useCallback(
			async (ctx, metadata, renderArea) => {
				await propsOnRender(ctx, metadata, renderArea);
				// リスト順に従って子要素を描画
				for (const obj of registeredObjectListRef.current) {
					await obj.onRender(ctx, obj.metadata, renderArea);
				}
			},
			[propsOnRender]
		);

		const onClickHandler: ClickEventHandler = useCallback(
			async (relX, relY) => {
				let isChildClicked = false;
				// 逆順で走査（Z-order）
				for (let i = registeredObjectListRef.current.length - 1; i >= 0; i--) {
					const obj = registeredObjectListRef.current[i];
					if (!obj.onClickHandler) {
						continue;
					}
					const m = obj.metadata;
					const childRelX = relX - m.relX;
					const childRelY = relY - m.relY;
					const isClicked =
						(await obj.isClickDetector?.(childRelX, childRelY)) ??
						(m.relX <= relX &&
							relX <= m.relX + m.width &&
							m.relY <= relY &&
							relY <= m.relY + m.height);
					if (isClicked) {
						await obj.onClickHandler(childRelX, childRelY);
						isChildClicked = true;
						break;
					}
				}
				// 親のクリックハンドラを呼び出す
				if (onClick && !isChildClicked) {
					await onClick(relX, relY);
				}
			},
			[onClick]
		);

		const objectId = useId();
		const render = useMemo(
			(): CanvasRenderFunctionObject => ({
				objectId,
				onRender,
				onClickHandler,
				isClickDetector,
				metadata,
			}),
			[objectId, onRender, onClickHandler, isClickDetector, metadata]
		);

		useEffect(() => {
			if (!parentObjectContext) return;
			parentObjectContext.onMount(render, childIndex);
			return () => {
				parentObjectContext.onUnmount(render);
			};
		}, [parentObjectContext, render, childIndex]);
		return (
			<CanvasObjectContext
				registeredObjectListRef={registeredObjectListRef}
				metadata={metadata}>
				{children}
			</CanvasObjectContext>
		);
	}
);
