import { configureStore } from "@reduxjs/toolkit";

import monitorsSlice from "./monitors/monitorsSlice";

export const store = configureStore({
	reducer: {
		monitors: monitorsSlice,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
