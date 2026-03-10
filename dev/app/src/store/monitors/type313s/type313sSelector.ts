import { type313sSelector } from "../monitorsSelector";

import type {
	Type313sState,
	Type313sCarInfoState,
	Type313sFormation,
} from "./type313sTypes";
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

// 編成
export const formationsSelector: AppSelector<Type313sFormation[]> = (state) =>
	type313sSelector(state).formations;

// 編成・車両リスト（全編成をフラットに展開）
export const carStateListSelector: AppSelector<Type313sCarInfoState[]> = (
	state,
) => type313sSelector(state).formations.flatMap((f) => f.carInfoList);
export const carCountSelector: AppSelector<number> = (state) =>
	type313sSelector(state).formations.reduce(
		(sum, f) => sum + f.carInfoList.length,
		0,
	);

export function createCarStateByCarIndexSelector<T>(
	sel: (carState: Type313sCarInfoState, carIndex: number) => T,
): CarStateByCarIndexSelector<T> {
	return (state, carIndex) =>
		sel(carStateListSelector(state)[carIndex], carIndex);
}

// 車掌状態（編成全体）
export const conductorIsRoomLightOnSelector: AppSelector<boolean | null> = (
	state,
) => type313sSelector(state).conductorState.isRoomLightOn;

export const conductorIsGuidanceOnSelector: AppSelector<boolean | null> = (
	state,
) => type313sSelector(state).conductorState.isGuidanceOn;
