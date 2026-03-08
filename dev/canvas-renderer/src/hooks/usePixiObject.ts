import { useEffect, useMemo, useReducer, useRef } from "react";

import {
	Container,
	Rectangle,
	type FederatedPointerEvent,
	type IHitArea,
} from "pixi.js";

import {
	useCanvasObjectContext,
	useCanvasChildIndex,
} from "../contexts/CanvasObjectContext";

import type {
	CanvasObjectMetadata,
	ClickEventHandler,
	ClickDetector,
} from "../contexts/CanvasObjectContext";

class CustomHitArea implements IHitArea {
	constructor(private detector: (x: number, y: number) => boolean) {}

	contains(x: number, y: number): boolean {
		return this.detector(x, y);
	}
}

export type UsePixiObjectOptions = {
	relX: number;
	relY: number;
	width: number;
	height: number;
	onClick?: ClickEventHandler;
	isClickDetector?: ClickDetector;
};

export type UsePixiObjectResult = {
	/** このオブジェクトのメインコンテナ（子要素のコンテキストに渡す） */
	container: Container;
	/** 描画用コンテナ（zIndex=-1、子要素より背面に描画される） */
	graphicsContainer: Container;
	/** 位置・サイズのメタデータ */
	metadata: CanvasObjectMetadata;
};

/**
 * PIXI.Container のライフサイクルを管理するフック。
 * CanvasObjectBase の代替として、各コンポーネントが直接描画を管理できる。
 */
export function usePixiObject({
	relX,
	relY,
	width,
	height,
	onClick,
	isClickDetector,
}: UsePixiObjectOptions): UsePixiObjectResult {
	const parentContext = useCanvasObjectContext();
	const childIndex = useCanvasChildIndex();
	const [, forceUpdate] = useReducer((x: number) => x + 1, 0);

	const metadata = useMemo(
		(): CanvasObjectMetadata => ({
			absX: relX + parentContext.metadata.absX,
			absY: relY + parentContext.metadata.absY,
			relX,
			relY,
			width,
			height,
		}),
		[relX, relY, width, height, parentContext.metadata],
	);

	// StrictMode 対策: コンテナが破棄された場合は再作成
	const containerRef = useRef<Container | null>(null);
	const graphicsContainerRef = useRef<Container | null>(null);

	if (!containerRef.current || containerRef.current.destroyed) {
		containerRef.current = new Container();
	}
	if (!graphicsContainerRef.current || graphicsContainerRef.current.destroyed) {
		graphicsContainerRef.current = new Container();
		graphicsContainerRef.current.zIndex = -1;
	}

	const container = containerRef.current;
	const graphicsContainer = graphicsContainerRef.current;

	// マウント: 親コンテナに追加、アンマウント: 削除・破棄
	useEffect(() => {
		if (container.destroyed) {
			containerRef.current = null;
			graphicsContainerRef.current = null;
			forceUpdate();
			return;
		}
		const parent = parentContext.pixiContainer;
		parent.addChild(container);
		container.addChild(graphicsContainer);
		container.sortableChildren = true;
		return () => {
			parent.removeChild(container);
			container.destroy({ children: true });
			containerRef.current = null;
			graphicsContainerRef.current = null;
		};
	}, [parentContext.pixiContainer, container, graphicsContainer, forceUpdate]);

	// 位置更新
	useEffect(() => {
		if (container.destroyed) return;
		container.x = relX;
		container.y = relY;
	}, [container, relX, relY]);

	// Z-order 更新
	useEffect(() => {
		if (container.destroyed) return;
		container.zIndex = childIndex;
		if (!parentContext.pixiContainer.destroyed) {
			parentContext.pixiContainer.sortChildren();
		}
	}, [container, childIndex, parentContext.pixiContainer]);

	// クリックハンドラ更新
	useEffect(() => {
		if (container.destroyed) return;
		container.removeAllListeners();

		if (onClick || isClickDetector) {
			container.eventMode = "static";
			if (isClickDetector) {
				container.hitArea = new CustomHitArea(isClickDetector);
			} else {
				container.hitArea = new Rectangle(0, 0, width, height);
			}
			if (onClick) {
				const handler = async (event: FederatedPointerEvent) => {
					const localPos = event.getLocalPosition(container);
					const handled = await onClick(localPos.x, localPos.y);
					if (handled !== false) {
						event.stopPropagation();
					}
				};
				container.on("pointerdown", handler);
			}
		} else {
			container.eventMode = "passive";
			container.hitArea = null;
		}
	}, [container, onClick, isClickDetector, width, height]);

	return { container, graphicsContainer, metadata };
}

/**
 * コンテナの子要素をすべて削除・破棄する
 */
export function clearContainer(container: Container): void {
	const removed = container.removeChildren();
	for (const child of removed) {
		if (!child.destroyed) child.destroy({ children: true });
	}
}
