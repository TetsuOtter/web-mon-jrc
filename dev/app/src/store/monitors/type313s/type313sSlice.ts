import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type PageMode =
	| "CAR_STATE"
	| "DRIVER"
	| "CONDUCTOR"
	| "WORK_SETTING"
	| "MAINTENANCE"
	| "CORRECTION"
	| "SETTING"
	| null;

type Type313sState = {
	currentMode: PageMode;
};

const initialState: Type313sState = {
	currentMode: null,
};

const type313sSlice = createSlice({
	name: "type313s",
	initialState,
	reducers: {
		setPageMode: (state, action: PayloadAction<PageMode>) => {
			state.currentMode = action.payload;
		},
	},
});

export const { setPageMode } = type313sSlice.actions;
export default type313sSlice.reducer;
