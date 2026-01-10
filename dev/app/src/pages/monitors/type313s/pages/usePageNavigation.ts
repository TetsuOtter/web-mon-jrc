import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import type { PageType } from "./pageTypes";

export function usePageNavigation() {
	const navigate = useNavigate();

	const navigateToPage = useCallback(
		(pageType: PageType) => {
			navigate(`/monitors/type313s${pageType}`);
		},
		[navigate]
	);

	return navigateToPage;
}

export function usePageNavigationTo(pageType: PageType) {
	const navigate = useNavigate();
	return useCallback(() => {
		navigate(`/monitors/type313s${pageType}`);
	}, [navigate, pageType]);
}
