import { useMemo, useState } from "react";

import type { FooterAreaWithPagerProps } from "./FooterAreaWithPager";

export function useFooterAreaWithPagerProps(
	maxPageIndex: number
): FooterAreaWithPagerProps {
	const [pageIndex, setPageIndex] = useState(0);
	return useMemo(
		() => ({
			currentPageIndex: pageIndex,
			maxPageIndex,
			setPageIndex,
		}),
		[pageIndex, maxPageIndex]
	);
}
