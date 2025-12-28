import type { PropsWithChildren, RefObject, ReactElement } from "react";
import {
	Children,
	createContext,
	memo,
	useCallback,
	useContext,
	useMemo,
	isValidElement,
	useRef,
} from "react";

import { useRequestRenderFunction } from "./RenderRequestContext";

import type { RenderArea } from "./RenderRequestContext";

export type CanvasRenderFunction = (
	ctx: CanvasRenderingContext2D,
	metadata: CanvasObjectMetadata,
	renderArea: RenderArea[]
) => void | Promise<void>;

export type ClickEventHandler = (
	relX: number,
	relY: number
) => void | Promise<void>;

export type ClickDetector = (
	relX: number,
	relY: number
) => boolean | Promise<boolean>;

/**
 * オブジェクトの座標・領域情報
 * 削除時の効率的な再描画のために使用
 */
export type CanvasObjectMetadata = {
	absX: number;
	absY: number;
	relX: number;
	relY: number;
	width: number;
	height: number;
	isFilled: boolean;
};

export type CanvasRenderFunctionObject = {
	objectId: string;
	onRender: CanvasRenderFunction;
	onClickHandler?: ClickEventHandler;
	isClickDetector?: ClickDetector;
	metadata: CanvasObjectMetadata;
};

export type CanvasObjectContextType = {
	onMount: (obj: CanvasRenderFunctionObject, childIndex?: number) => void;
	onUnmount: (obj: CanvasRenderFunctionObject) => void;
	metadata: CanvasObjectMetadata;
};

/**
 * Childrenの登録順序を保持するためのリスト
 */
export type RegisteredObjectListRef = RefObject<CanvasRenderFunctionObject[]>;

const CanvasObjectContext = createContext<CanvasObjectContextType | null>(null);

/**
 * Childのインデックス情報を提供するContext
 */
const CanvasChildIndexContext = createContext<number>(0);

export function useCanvasObjectContext() {
	const context = useContext(CanvasObjectContext);
	if (!import.meta.env.PROD && !context) {
		throw new Error(
			"useCanvasObjectContext must be used within a CanvasObjectContext.Provider"
		);
	}
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	return context!;
}

/**
 * 現在のChildのインデックスを取得する
 */
export function useCanvasChildIndex() {
	return useContext(CanvasChildIndexContext);
}

type CanvasObjectContextProviderProps = {
	registeredObjectListRef: RefObject<CanvasRenderFunctionObject[]>;
	metadata: CanvasObjectMetadata;
};

/**
 * Childrenに_canvasChildIndexをinjectionする
 * これにより、各子要素は親内での位置情報を知ることができる
 */
function injectChildIndexToChildren(
	children: PropsWithChildren<unknown>["children"]
): ReactElement[] {
	const wrappedChildren: ReactElement[] = [];
	let childIndex = 0;

	Children.forEach(children, (child) => {
		if (isValidElement(child)) {
			wrappedChildren.push(
				<CanvasChildIndexContext.Provider
					key={child.key ?? childIndex}
					value={childIndex}>
					{child}
				</CanvasChildIndexContext.Provider>
			);
			childIndex++;
		}
	});

	return wrappedChildren;
}
export default memo<PropsWithChildren<CanvasObjectContextProviderProps>>(
	function CanvasObjectContextProvider({
		registeredObjectListRef,
		metadata,
		children,
	}) {
		const requestRender = useRequestRenderFunction();

		// childIndexを持つオブジェクトを管理するMap
		const objectIndexMapRef = useRef<Record<string, number>>({});

		// リストをchildIndexの順序でソートする
		const sortObjectList = useCallback(() => {
			if (registeredObjectListRef.current.length === 0) {
				return;
			}

			registeredObjectListRef.current.sort((a, b) => {
				const aIndex = objectIndexMapRef.current[a.objectId] ?? Infinity;
				const bIndex = objectIndexMapRef.current[b.objectId] ?? Infinity;
				return aIndex - bIndex;
			});
		}, [objectIndexMapRef, registeredObjectListRef]);

		// childrenを処理してchildIndexをinjection
		const wrappedChildren = useMemo(
			() => injectChildIndexToChildren(children),
			[children]
		);

		const onMount: CanvasObjectContextType["onMount"] = useCallback(
			(obj, childIndex) => {
				const index = registeredObjectListRef.current.findIndex(
					(item) => item.objectId === obj.objectId
				);
				if (index === -1) {
					registeredObjectListRef.current.push(obj);
				}
				// childIndexを記録
				if (childIndex != null) {
					objectIndexMapRef.current[obj.objectId] = childIndex;
				}
				// リストを即座にソート
				sortObjectList();
				requestRender(obj.metadata);
			},
			[
				registeredObjectListRef,
				objectIndexMapRef,
				requestRender,
				sortObjectList,
			]
		);
		const onUnmount: CanvasObjectContextType["onUnmount"] = useCallback(
			(obj) => {
				const index = registeredObjectListRef.current.findIndex(
					(item) => item.objectId === obj.objectId
				);
				if (-1 < index) {
					registeredObjectListRef.current.splice(index, 1);
				}
				// indexマップからも削除
				// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
				delete objectIndexMapRef.current[obj.objectId];
				requestRender(obj.metadata);
			},
			[registeredObjectListRef, objectIndexMapRef, requestRender]
		);
		const contextValue = useMemo(
			(): CanvasObjectContextType => ({
				onMount,
				onUnmount,
				metadata,
			}),
			[onMount, onUnmount, metadata]
		);

		return (
			<CanvasObjectContext.Provider value={contextValue}>
				{wrappedChildren}
			</CanvasObjectContext.Provider>
		);
	}
);
