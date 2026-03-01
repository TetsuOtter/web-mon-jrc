import { createSlice } from "@reduxjs/toolkit";

import { SLICE_NAME } from "./constants";
import { loadType313sState } from "./type313sStorage";

import type {
	Type313sCarState,
	Type313sConductorState,
	Type313sState,
} from "./type313sTypes";
import type { PayloadAction } from "@reduxjs/toolkit";

const defaultInitialState: Type313sState = {
	currentLocation: 123.4,

	carStateList: [
		{
			carType: "Mc",
			carNumber: 1,
			hasLeftPantograph: false,
			hasRightPantograph: true,

			isDoorClosed: true,
			isAnnounceOn: true,
			airConditionerState: "AUTO_COOLING",
			fanState: "AUTO_HIGH",
			temperature: 25,
			humidity: 50,
			coolingTargetTemperature: 22,
			heatingTargetTemperature: 28,
			airConditionerAdjustmentMode: "NORMAL",
			isVentOn: false,
			isRoomLightOn: true,
			occupancy: 100,
			occupancyRate: 0.5,

			carStates: {
				isMSOn: true,
				isCPOn: undefined,
				isMRPressureNormal: true,
				isTestSWOn: false,
				isSnowBrakeOn: false,

				sivLineState: {
					isCgKForSIVOn: true,
					isIvMSOn: true,
					isIvHBOn: true,
					isIvLOn: true,
					isSIVOn: true,
					is3phMKOn: true,
					isIvCNOn: true,
					isIVSMDSOn: true,
					sivVoltage: 442,
					sivFrequency: 60,
				},
				isReduceLoadOn: false,

				bcPressure: [300, 300, 300, 300],
				mrPressure: 860,
				receivedNotchCommand: "非常",
			},

			cabState: {
				side: "left",
				cabSesState: "FORWARD",
				isBHEBOn: false,
				isConductorEBOn: false,
				isSpareStraightBrakeOn: false,
				orderedNotchCommand: "非常",
				isTLKOn: false,
			},

			bogieState: {
				isHBOn: true,
				isCCOSNormal: true,
				isLB1On: true,
				vvvf2State: "VVVF",
				isCgKForVVVF2On: true,
				lineVoltage: 1650,

				left: {
					isLbOn: true,
					mmCurrent1: 0,
					mmCurrent2: 0,
					isMCOS1On: true,
					isMCOS2On: true,
				},
				right: {
					isLbOn: true,
					mmCurrent1: 0,
					mmCurrent2: 0,
					isMCOS1On: true,
					isMCOS2On: true,
				},
			},
		},
		{
			carType: "M",
			carNumber: 2,
			hasLeftPantograph: false,
			hasRightPantograph: false,

			isDoorClosed: true,
			isAnnounceOn: true,
			airConditionerState: "AUTO_COOLING",
			fanState: "AUTO_HIGH",
			temperature: 25,
			humidity: 50,
			coolingTargetTemperature: 22,
			heatingTargetTemperature: 28,
			airConditionerAdjustmentMode: "NORMAL",
			isVentOn: false,
			isRoomLightOn: true,
			occupancy: 100,
			occupancyRate: 0.5,

			carStates: {
				isMSOn: true,
				isCPOn: undefined,
				isMRPressureNormal: true,
				isTestSWOn: false,
				isSnowBrakeOn: false,

				sivLineState: undefined,
				isReduceLoadOn: false,

				bcPressure: [300, 300, 300, 300],
				mrPressure: 860,
				receivedNotchCommand: "非常",
			},

			cabState: undefined,

			bogieState: {
				isHBOn: true,
				isCCOSNormal: true,
				isLB1On: true,
				vvvf2State: "VVVF",
				isCgKForVVVF2On: true,
				lineVoltage: 1650,

				left: {
					isLbOn: true,
					mmCurrent1: 0,
					mmCurrent2: 0,
					isMCOS1On: true,
					isMCOS2On: true,
				},
				right: undefined,
			},
		},
		{
			carType: "Tc",
			carNumber: 3,
			hasLeftPantograph: false,
			hasRightPantograph: false,

			isDoorClosed: true,
			isAnnounceOn: true,
			airConditionerState: "AUTO_COOLING",
			fanState: "AUTO_HIGH",
			temperature: 25,
			humidity: 50,
			coolingTargetTemperature: 22,
			heatingTargetTemperature: 28,
			airConditionerAdjustmentMode: "NORMAL",
			isVentOn: false,
			isRoomLightOn: true,
			occupancy: 100,
			occupancyRate: 0.5,

			carStates: {
				isMSOn: true,
				isCPOn: undefined,
				isMRPressureNormal: true,
				isTestSWOn: false,
				isSnowBrakeOn: false,

				sivLineState: undefined,
				isReduceLoadOn: false,

				bcPressure: [300, 300, 300, 300],
				mrPressure: 860,
				receivedNotchCommand: "非常",
			},

			cabState: {
				side: "right",
				cabSesState: "REVERSE",
				isBHEBOn: false,
				isConductorEBOn: false,
				isSpareStraightBrakeOn: false,
				isTLKOn: false,
			},

			bogieState: undefined,
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
		setCarStateList(state, action: PayloadAction<Type313sCarState[]>) {
			state.carStateList = action.payload;
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
	setCarStateList,
	setFullState,
	resetState,
} = type313sSlice.actions;

export default type313sSlice.reducer;
