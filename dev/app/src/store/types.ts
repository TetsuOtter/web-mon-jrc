import type { RootState } from "./store";

export type AppSelector<
	T = unknown,
	TParam extends readonly unknown[] = readonly [],
> = (state: RootState, ...param: TParam) => T;
