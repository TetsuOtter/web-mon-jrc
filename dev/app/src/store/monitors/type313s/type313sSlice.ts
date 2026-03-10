import { createSlice } from "@reduxjs/toolkit";

import { SLICE_NAME } from "./constants";
import { createM, createMc, createTc } from "./type313sCarInfoUtil";
import { loadType313sState } from "./type313sStorage";

import type {
	Type313sConductorState,
	Type313sFormation,
	Type313sState,
} from "./type313sTypes";
import type { PayloadAction } from "@reduxjs/toolkit";

const defaultInitialState: Type313sState = {
	currentLocation: 123.4,

	formations: [
		{
			carInfoList: [createMc(1), createM(2), createTc(3)],
		},
	],
	conductorState: {
		isRoomLightOn: true,
		isGuidanceOn: true,
	},
};

// LocalStorage に保存済みのデータがあればそちらを初期値として使用する
const initialState: Type313sState = loadType313sState() ?? defaultInitialState;

const type313sSlice = createSlice({
	name: SLICE_NAME,
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
		setTimeMs(state, action: PayloadAction<number>) {
			state.timeMs = action.payload;
		},
		setConductorState(state, action: PayloadAction<Type313sConductorState>) {
			state.conductorState = action.payload;
		},
		setFormations(state, action: PayloadAction<Type313sFormation[]>) {
			state.formations = action.payload;
		},
		/**
		 * LocalStorage や他タブからの変更を受け取り、State 全体を置き換える。
		 */
		setFullState(_state, action: PayloadAction<Type313sState>) {
			return action.payload;
		},
		/**
		 * State を初期値にリセットする
		 */
		resetState() {
			return defaultInitialState;
		},
	},
});

export const {
	setTrainNumber,
	setTrainType,
	setDestination,
	setCurrentLocation,
	setTimeMs,
	setConductorState,
	setFormations,
	setFullState,
	resetState,
} = type313sSlice.actions;

export default type313sSlice.reducer;
