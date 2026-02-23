import type { AppSelector } from "../types";
import type { MonitorsState } from "./monitorsSlice";

export const type313sSelector: AppSelector<MonitorsState["type313s"]> = (
	state
) => state.monitors.type313s;
