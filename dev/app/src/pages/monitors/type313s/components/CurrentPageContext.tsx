import type { PropsWithChildren } from "react";
import { createContext, memo, useContext } from "react";

import type { PageType } from "../pages/pageTypes";

const currentPageContext = createContext<PageType | null>(null);

export function useCurrentPageType() {
	const currentPageType = useContext(currentPageContext);
	if (import.meta.env.DEV && currentPageType === null) {
		throw new Error(
			"useCurrentPageType must be used within a CurrentPageContextProvider"
		);
	}
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	return currentPageType!;
}

export default memo<PropsWithChildren<{ page: PageType }>>(
	function CurrentPageContextProvider({ children, page }) {
		return (
			<currentPageContext.Provider value={page}>
				{children}
			</currentPageContext.Provider>
		);
	}
);
