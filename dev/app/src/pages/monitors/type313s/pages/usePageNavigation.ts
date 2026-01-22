import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";

import { setPageMode } from "../../../../store/monitors/type313s/type313sSlice";

import type { PageType } from "./pageTypes";
import type { PageMode } from "../../../../store/monitors/type313s/type313sSlice";

export function usePageNavigation() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const navigateToPage = useCallback(
		(pageType: PageType, pageMode?: PageMode) => {
			if (pageMode) {
				dispatch(setPageMode(pageMode));
			}
			navigate(`/monitors/type313s/${pageType}`);
		},
		[navigate, dispatch]
	);

	return navigateToPage;
}

export function usePageNavigationTo(pageType: PageType, pageMode?: PageMode) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	return useCallback(() => {
		if (pageMode) {
			dispatch(setPageMode(pageMode));
		}
		navigate(`/monitors/type313s/${pageType}`);
	}, [navigate, dispatch, pageType, pageMode]);
}
