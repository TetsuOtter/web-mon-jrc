import { useCallback } from "react";

import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "./store";
import type { TypedUseSelectorHook } from "react-redux";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function useAppSelectorWithParams<
	TParam extends readonly unknown[],
	TResult,
>(
	selector: (state: RootState, ...param: TParam) => TResult,
	...param: TParam
): TResult {
	const selectorWithParams = useCallback(
		(state: RootState) => selector(state, ...param),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[selector, ...param]
	);
	return useAppSelector(selectorWithParams);
}
