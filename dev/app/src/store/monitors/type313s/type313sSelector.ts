import { type313sSelector } from "../monitorsSelector";

import type { Type313sState } from "./type313sSlice";
import type { AppSelector } from "../../types";

export const trainNumberSelector: AppSelector<Type313sState["trainNumber"]> = (
	state
) => type313sSelector(state).trainNumber;
export const trainTypeSelector: AppSelector<Type313sState["trainType"]> = (
	state
) => type313sSelector(state).trainType;
export const destinationSelector: AppSelector<Type313sState["destination"]> = (
	state
) => type313sSelector(state).destination;
export const currentLocationSelector: AppSelector<
	Type313sState["currentLocation"]
> = (state) => type313sSelector(state).currentLocation;
export const timeMsSelector: AppSelector<Type313sState["timeMs"]> = (state) =>
	type313sSelector(state).timeMs;
