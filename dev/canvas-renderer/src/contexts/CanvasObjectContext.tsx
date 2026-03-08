import type { PropsWithChildren, ReactElement } from "react";
import {
	Children,
	createContext,
	isValidElement,
	memo,
	useContext,
	useMemo,
} from "react";

import type { Container } from "pixi.js";

export type CanvasObjectMetadata = {
	absX: number;
	absY: number;
	relX: number;
	relY: number;
	width: number;
	height: number;
};

export type CanvasRenderFunction = (
	container: Container,
	metadata: CanvasObjectMetadata,
) => void | Promise<void>;

export type ClickEventHandler = (
	relX: number,
	relY: number,
) => boolean | Promise<boolean>;

export type ClickDetector = (relX: number, relY: number) => boolean;

export type CanvasObjectContextType = {
	pixiContainer: Container;
	metadata: CanvasObjectMetadata;
};

const CanvasObjectContext = createContext<CanvasObjectContextType | null>(null);

/**
 * Childのインデックス情報を提供するContext（Z-order管理に使用）
 */
const CanvasChildIndexContext = createContext<number>(0);

export function useCanvasObjectContext() {
	const context = useContext(CanvasObjectContext);
	if (context === null) {
		throw new Error(
			"useCanvasObjectContext must be used within a CanvasObjectContext.Provider",
		);
	}
	return context;
}

export function useCanvasChildIndex() {
	return useContext(CanvasChildIndexContext);
}

type CanvasObjectContextProviderProps = {
	pixiContainer: Container;
	metadata: CanvasObjectMetadata;
};

function injectChildIndexToChildren(
	children: PropsWithChildren<unknown>["children"],
): ReactElement[] {
	const wrappedChildren: ReactElement[] = [];
	let childIndex = 0;

	Children.forEach(children, (child) => {
		if (isValidElement(child)) {
			wrappedChildren.push(
				<CanvasChildIndexContext.Provider
					key={child.key ?? childIndex}
					value={childIndex}
				>
					{child}
				</CanvasChildIndexContext.Provider>,
			);
			childIndex++;
		}
	});

	return wrappedChildren;
}

export default memo<PropsWithChildren<CanvasObjectContextProviderProps>>(
	function CanvasObjectContextProvider({ pixiContainer, metadata, children }) {
		const contextValue = useMemo(
			(): CanvasObjectContextType => ({ pixiContainer, metadata }),
			[pixiContainer, metadata],
		);

		const wrappedChildren = useMemo(
			() => injectChildIndexToChildren(children),
			[children],
		);

		return (
			<CanvasObjectContext.Provider value={contextValue}>
				{wrappedChildren}
			</CanvasObjectContext.Provider>
		);
	},
);
