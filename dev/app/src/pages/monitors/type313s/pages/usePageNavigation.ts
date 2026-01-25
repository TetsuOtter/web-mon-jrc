import { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import type { PageMode, PageType } from "./pageTypes";

export type NavigationQueryParams = {
	mode?: PageMode;
};

function buildMergedQueryString(
	currentSearchParams: URLSearchParams,
	newParams: NavigationQueryParams
): string {
	const mergedParams = new URLSearchParams(currentSearchParams);

	if (newParams.mode != null) {
		mergedParams.set("mode", newParams.mode);
	}

	const queryString = mergedParams.toString();
	return queryString ? `?${queryString}` : "";
}

export function usePageNavigation() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	const navigateToPage = useCallback(
		(pageType: PageType, params?: NavigationQueryParams) => {
			const queryString = buildMergedQueryString(searchParams, params ?? {});
			navigate(`/monitors/type313s/${pageType}${queryString}`);
		},
		[navigate, searchParams]
	);

	return navigateToPage;
}

export function usePageNavigationTo(
	pageType: PageType,
	params?: NavigationQueryParams
) {
	const navigate = usePageNavigation();

	return useCallback(() => {
		navigate(pageType, params);
	}, [navigate, pageType, params]);
}
