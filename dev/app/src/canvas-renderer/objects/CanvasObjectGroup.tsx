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
 * オブジェクトとしての実態は持たないものの、位置・サイズ情報を持つグループコンポーネント
 * 複数の子要素をグループ化し、グループの位置をまとめて決定するために使用
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
				isFilled: false,
			}),
			[relX, relY, width, height, parentObjectContext]
		);

		const registeredObjectListRef = useRef<CanvasRenderFunctionObject[]>([]);

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
				onRender: async (ctx, _metadata, renderArea) => {
					// グループ自体は描画されない、子要素のみを描画
					for (const obj of registeredObjectListRef.current) {
						await obj.onRender(ctx, obj.metadata, renderArea);
					}
				},
				onClickHandler,
				isClickDetector,
				metadata,
			}),
			[objectId, onClickHandler, isClickDetector, metadata]
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
