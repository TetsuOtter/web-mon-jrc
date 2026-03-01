import { configureStore } from "@reduxjs/toolkit";

import monitorsSlice from "./monitors/monitorsSlice";
import { setupStorageSyncListener } from "./monitors/type313s/type313sStorage";
import { type313sStorageMiddleware } from "./monitors/type313s/type313sStorageMiddleware";

export const store = configureStore({
	reducer: {
		monitors: monitorsSlice,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(type313sStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/**
 * 他タブで LocalStorage が更新された場合に自タブの Redux state を同期する。
 */
setupStorageSyncListener(store.dispatch);
