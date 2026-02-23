import { createSlice } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";

export type Type313sState = {
	trainNumber?: string;
	trainType?: string;
	destination?: string;
	currentLocation: number;
};

const initialState: Type313sState = {
	currentLocation: 123.4,
};

const type313sSlice = createSlice({
	name: "type313s",
	initialState,
	reducers: {
		setTrainNumber(state, action: PayloadAction<string>) {
			state.trainNumber = action.payload;
		},
		setTrainType(state, action: PayloadAction<string>) {
			state.trainType = action.payload;
		},
		setDestination(state, action: PayloadAction<string>) {
			state.destination = action.payload;
		},
		setCurrentLocation(state, action: PayloadAction<number>) {
			state.currentLocation = action.payload;
		},
	},
});

export const {
	setTrainNumber,
	setTrainType,
	setDestination,
	setCurrentLocation,
} = type313sSlice.actions;
export default type313sSlice.reducer;
