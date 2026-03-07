import { type313sSelector } from "../monitorsSelector";

import type { Type313sState, Type313sCarState } from "./type313sTypes";
import type { AppSelector } from "../../types";

export type CarStateByCarIndexSelector<T> = AppSelector<T, [carIndex: number]>;

export const trainNumberSelector: AppSelector<Type313sState["trainNumber"]> = (
	state,
) => type313sSelector(state).trainNumber;
export const trainTypeSelector: AppSelector<Type313sState["trainType"]> = (
	state,
) => type313sSelector(state).trainType;
export const destinationSelector: AppSelector<Type313sState["destination"]> = (
	state,
) => type313sSelector(state).destination;
export const currentLocationSelector: AppSelector<
	Type313sState["currentLocation"]
> = (state) => type313sSelector(state).currentLocation;
export const timeMsSelector: AppSelector<Type313sState["timeMs"]> = (state) =>
	type313sSelector(state).timeMs;

// 編成・車両リスト
export const carStateListSelector: AppSelector<
	Type313sState["carStateList"]
> = (state) => type313sSelector(state).carStateList;
export const carCountSelector: AppSelector<number> = (state) =>
	type313sSelector(state).carStateList.length;

export function createCarStateByCarIndexSelector<T>(
	sel: (carState: Type313sCarState) => T,
): CarStateByCarIndexSelector<T> {
	return (state, carIndex) =>
		sel(type313sSelector(state).carStateList[carIndex]);
}

// 車掌状態（編成全体）
export const conductorIsRoomLightOnSelector: AppSelector<boolean | null> = (
	state,
) => type313sSelector(state).conductorState.isRoomLightOn;

export const conductorIsGuidanceOnSelector: AppSelector<boolean | null> = (
	state,
) => type313sSelector(state).conductorState.isGuidanceOn;
