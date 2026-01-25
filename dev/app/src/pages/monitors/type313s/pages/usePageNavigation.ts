import { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useCurrentPageType } from "../components/CurrentPageContext";
import { useNavigationHistory } from "../components/NavigationHistoryContext";

import { PAGE_TYPES } from "./pageTypes";

import type { PageMode, PageType } from "./pageTypes";

export type NavigationQueryParams = {
	mode?: PageMode;
	[key: string]: string | undefined;
};

function buildMergedQueryString(
	currentSearchParams: URLSearchParams,
	newParams: NavigationQueryParams
): string {
	const mergedParams = new URLSearchParams(currentSearchParams);

	for (const [key, value] of Object.entries(newParams)) {
		if (value != null) {
			mergedParams.set(key, value);
		}
	}

	const queryString = mergedParams.toString();
	return queryString ? `?${queryString}` : "";
}

export function usePageNavigation() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const currentPageType = useCurrentPageType();
	const { pushHistory } = useNavigationHistory();

	const navigateToPage = useCallback(
		(pageType: PageType, params?: NavigationQueryParams) => {
			const currentParams: Record<string, string> = {};
			searchParams.forEach((value, key) => {
				currentParams[key] = value;
			});

			pushHistory(currentPageType, pageType, currentParams);

			const queryString = buildMergedQueryString(searchParams, params ?? {});
			navigate(`/monitors/type313s/${pageType}${queryString}`);
		},
		[navigate, searchParams, currentPageType, pushHistory]
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

export function usePageBackNavigation() {
	const navigate = useNavigate();
	const navigateToMenu = usePageNavigationTo(PAGE_TYPES.MENU);
	const { popHistory } = useNavigationHistory();

	return useCallback(() => {
		const previousPage = popHistory();
		if (previousPage) {
			const queryParams = previousPage.queryParams ?? {};
			const searchParams = new URLSearchParams();
			for (const [key, value] of Object.entries(queryParams)) {
				if (value != null) {
					searchParams.set(key, value);
				}
			}
			const queryString = searchParams.toString();
			const url = `/monitors/type313s/${previousPage.pageType}${
				queryString ? `?${queryString}` : ""
			}`;
			navigate(url);
		} else {
			navigateToMenu();
		}
	}, [navigate, navigateToMenu, popHistory]);
}
