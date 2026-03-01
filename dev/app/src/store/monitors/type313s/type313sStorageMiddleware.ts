import { SLICE_NAME } from "./constants";
import { setFullState } from "./type313sSlice";
import { saveType313sState } from "./type313sStorage";

import type { Middleware } from "@reduxjs/toolkit";

export const type313sStorageMiddleware: Middleware =
	(storeAPI) => (next) => (action) => {
		const result = next(action);

		// setFullState は他タブの storage イベントから dispatch されるため
		// ここで再度保存するとイベントが無限ループするのでスキップする
		if (
			typeof action === "object" &&
			action != null &&
			"type" in action &&
			typeof action.type === "string" &&
			action.type.startsWith(`${SLICE_NAME}/`) &&
			action.type !== setFullState.type
		) {
			const state = storeAPI.getState();
			saveType313sState(state.monitors.type313s);
		}

		return result;
	};
