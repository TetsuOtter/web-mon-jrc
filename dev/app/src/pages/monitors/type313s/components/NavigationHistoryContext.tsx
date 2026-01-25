import { createContext, memo, useContext, useMemo, useRef } from "react";
import type { PropsWithChildren } from "react";

import { getPageGroup } from "../pages/pageTypes";

import type { PageType } from "../pages/pageTypes";

export type NavigationHistoryEntry = {
	pageType: PageType;
	queryParams?: Record<string, string>;
};

type NavigationHistoryContextValue = {
	popHistory: () => NavigationHistoryEntry | undefined;
	peekHistory: () => NavigationHistoryEntry | undefined;
	pushHistory: (
		currentPage: PageType,
		nextPage: PageType,
		queryParams?: Record<string, string>
	) => void;
	clearHistory: () => void;
};

const NavigationHistoryContext = createContext<
	NavigationHistoryContextValue | undefined
>(undefined);

export default memo<PropsWithChildren>(function NavigationHistoryProvider({
	children,
}) {
	const historyRef = useRef<NavigationHistoryEntry[]>([]);

	const contextValue: NavigationHistoryContextValue = useMemo(
		() => ({
			popHistory: () => {
				return historyRef.current.pop();
			},
			peekHistory: () => {
				const history = historyRef.current;
				return history.length > 0 ? history[history.length - 1] : undefined;
			},
			pushHistory: (currentPage, nextPage, queryParams) => {
				const currentGroup = getPageGroup(currentPage);
				const nextGroup = getPageGroup(nextPage);

				if (currentGroup === nextGroup) {
					return;
				}

				historyRef.current.push({
					pageType: currentPage,
					queryParams,
				});
			},
			clearHistory: () => {
				historyRef.current = [];
			},
		}),
		[]
	);

	return (
		<NavigationHistoryContext.Provider value={contextValue}>
			{children}
		</NavigationHistoryContext.Provider>
	);
});

export function useNavigationHistory(): NavigationHistoryContextValue {
	const context = useContext(NavigationHistoryContext);
	if (!context) {
		throw new Error(
			"useNavigationHistory must be used within NavigationHistoryProvider"
		);
	}
	return context;
}
