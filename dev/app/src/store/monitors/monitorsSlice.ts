import { combineReducers } from "@reduxjs/toolkit";

import type313sSlice from "./type313s/type313sSlice";

const slice = combineReducers({
	type313s: type313sSlice,
});

export type MonitorsState = ReturnType<typeof slice>;

export default slice;
