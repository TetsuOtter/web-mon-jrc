import {
	CAB_SES_STATE,
	VVVF2_STATE,
	AIR_CONDITIONER_ADJUSTMENT_MODE,
	AIR_CONDITIONER_STATE,
	FAN_STATE,
	AIR_CONDITIONER_RUN_MODE,
	AIR_CONDITIONER_CTRL_UNIT,
} from "../../store/monitors/type313s/type313sTypes";

import type {
	CarStateBasicField,
	SivLineStateField,
	CabStateField,
	BogieCommonField,
	BogieSideField,
} from "./types";
import type {
	AirConditionerAdjustmentMode,
	AirConditionerCtrlUnit,
	AirConditionerRunMode,
	AirConditionerState,
	CabSesState,
	FanState,
	Type313sBogieCommonState,
	Type313sBogieState,
	Type313sCabState,
	Type313sCarInfoState,
	VVVF2State,
} from "../../store/monitors/type313s/type313sTypes";

// Utility functions
export function nullableBooleanToSelectValue(
	value: boolean | null,
): "true" | "false" | "null" {
	if (value === null) {
		return "null";
	}
	return value ? "true" : "false";
}

export function selectValueToNullableBoolean(value: string): boolean | null {
	if (value === "null") {
		return null;
	}
	return value === "true";
}

export function booleanToSelectValue(value: boolean): "true" | "false" {
	return value ? "true" : "false";
}

export function nullableBooleanOrUndefinedToSelectValue(
	value: boolean | null | undefined,
): "undefined" | "true" | "false" | "null" {
	if (value === undefined) {
		return "undefined";
	}
	if (value === null) {
		return "null";
	}
	return value ? "true" : "false";
}

export function selectValueToNullableBooleanOrUndefined(
	value: string,
): boolean | null | undefined {
	if (value === "undefined") {
		return undefined;
	}
	if (value === "null") {
		return null;
	}
	return value === "true";
}

// Options constants
export const AIR_CONDITIONER_STATE_OPTIONS = Object.values(
	AIR_CONDITIONER_STATE,
);
export const AIR_CONDITIONER_CTRL_UNIT_OPTIONS = Object.values(
	AIR_CONDITIONER_CTRL_UNIT,
);
export const AIR_CONDITIONER_RUN_MODE_OPTIONS = Object.values(
	AIR_CONDITIONER_RUN_MODE,
);
export const FAN_STATE_OPTIONS = Object.values(FAN_STATE);
export const AIR_CONDITIONER_ADJUSTMENT_MODE_OPTIONS = Object.values(
	AIR_CONDITIONER_ADJUSTMENT_MODE,
);
export const CAB_SES_STATE_OPTIONS = Object.values(CAB_SES_STATE);
export const VVVF2_STATE_OPTIONS = Object.values(VVVF2_STATE);
export const NULLABLE_BOOLEAN_OPTIONS = [
	{ value: "null", label: "状態不明" },
	{ value: "true", label: "ON" },
	{ value: "false", label: "OFF" },
] as const;

export const BOOLEAN_OPTIONS = [
	{ value: "true", label: "あり" },
	{ value: "false", label: "なし" },
] as const;

export const NULLABLE_BOOLEAN_DOOR_OPTIONS = [
	{ value: "null", label: "状態不明" },
	{ value: "true", label: "閉" },
	{ value: "false", label: "開" },
] as const;

export const NULLABLE_BOOLEAN_NORMAL_OPTIONS = [
	{ value: "null", label: "状態不明" },
	{ value: "true", label: "正常" },
	{ value: "false", label: "異常" },
] as const;

export const BOOLEAN_OR_UNDEFINED_OPTIONS = [
	{ value: "undefined", label: "非搭載" },
	{ value: "null", label: "状態不明" },
	{ value: "true", label: "ON" },
	{ value: "false", label: "OFF" },
] as const;

export const SIDE_OPTIONS = [
	{ value: "left", label: "left" },
	{ value: "right", label: "right" },
] as const;

export const ENABLED_OPTIONS = [
	{ value: "present", label: "あり" },
	{ value: "undefined", label: "なし" },
] as const;

// Default state creators
export function createDefaultCabState(): Type313sCabState {
	return {
		side: "left",
		cabSesState: null,
		isBHEBOn: null,
		isConductorEBOn: null,
		isSpareStraightBrakeOn: null,
		orderedNotchCommand: null,
		isTLKOn: null,
	};
}

export function createDefaultBogieState(): Type313sBogieState {
	return {
		isLbOn: null,
		mmCurrent1: null,
		mmCurrent2: null,
		isMCOS1On: null,
		isMCOS2On: null,
	};
}

export function createDefaultBogieCommonState(): Type313sBogieCommonState {
	return {
		isHBOn: null,
		isCCOSNormal: null,
		isLB1On: null,
		vvvf2State: null,
		isCgKForVVVF2On: null,
		lineVoltage: null,
		left: createDefaultBogieState(),
		right: createDefaultBogieState(),
	};
}

export function createDefaultCarState(carNumber: number): Type313sCarInfoState {
	return {
		carType: "M",
		carNumber,
		hasLeftPantograph: false,
		hasRightPantograph: false,
		isDoorClosed: null,
		isAnnounceOn: null,
		airConditionerState: null,
		airConditionerCtrlUnit: null,
		airConditionerRunMode: null,
		fanState: null,
		temperature: null,
		humidity: null,
		coolingTargetTemperature: null,
		heatingTargetTemperature: null,
		airConditionerAdjustmentMode: null,
		isVentOn: null,
		isRoomLightOn: null,
		occupancy: null,
		occupancyRate: null,
		carState: {
			isMSOn: undefined,
			isCPOn: undefined,
			isMRPressureNormal: null,
			isTestSWOn: null,
			isSnowBrakeOn: null,
			sivLineState: undefined,
			isReduceLoadOn: null,
			isBrakeChopperOn: false,
			bcPressure: [null, null, null, null],
			mrPressure: null,
			receivedNotchCommand: null,
		},
		cabState: undefined,
		bogieState: undefined,
	};
}

// Field definitions
export const CAR_BASIC_FIELDS: readonly CarStateBasicField[] = [
	{
		type: "string",
		fieldKey: "carType",
		label: "車種",
		getValue: (car) => car.carType,
		setValue: (car, value) => ({ ...car, carType: value }),
	},
	{
		type: "number",
		fieldKey: "carNumber",
		label: "車号",
		getValue: (car) => car.carNumber,
		setValue: (car, value) => ({ ...car, carNumber: value }),
	},
	{
		type: "select",
		fieldKey: "hasLeftPantograph",
		label: "左パンタ",
		options: BOOLEAN_OPTIONS,
		toSelectValue: (car) => booleanToSelectValue(car.hasLeftPantograph),
		fromSelectValue: (car, value) => ({
			...car,
			hasLeftPantograph: value === "true",
		}),
	},
	{
		type: "select",
		fieldKey: "hasRightPantograph",
		label: "右パンタ",
		options: BOOLEAN_OPTIONS,
		toSelectValue: (car) => booleanToSelectValue(car.hasRightPantograph),
		fromSelectValue: (car, value) => ({
			...car,
			hasRightPantograph: value === "true",
		}),
	},
	{
		type: "select",
		fieldKey: "isDoorClosed",
		label: "戸閉",
		options: NULLABLE_BOOLEAN_DOOR_OPTIONS,
		toSelectValue: (car) => nullableBooleanToSelectValue(car.isDoorClosed),
		fromSelectValue: (car, value) => ({
			...car,
			isDoorClosed: selectValueToNullableBoolean(value),
		}),
	},
	{
		type: "select",
		fieldKey: "isAnnounceOn",
		label: "放送",
		options: NULLABLE_BOOLEAN_OPTIONS,
		toSelectValue: (car) => nullableBooleanToSelectValue(car.isAnnounceOn),
		fromSelectValue: (car, value) => ({
			...car,
			isAnnounceOn: selectValueToNullableBoolean(value),
		}),
	},
	{
		type: "select",
		fieldKey: "airConditionerState",
		label: "空調状態",
		options: [
			{ value: "", label: "未設定" },
			...AIR_CONDITIONER_STATE_OPTIONS.map((v) => ({ value: v, label: v })),
		],
		toSelectValue: (car) => car.airConditionerState ?? "",
		fromSelectValue: (car, value) => ({
			...car,
			airConditionerState: value ? (value as AirConditionerState) : null,
		}),
	},
	{
		type: "select",
		fieldKey: "airConditionerCtrlUnit",
		label: "空調制御単位",
		options: [
			{ value: "", label: "未設定" },
			...AIR_CONDITIONER_CTRL_UNIT_OPTIONS.map((v) => ({ value: v, label: v })),
		],
		toSelectValue: (car) => car.airConditionerCtrlUnit ?? "",
		fromSelectValue: (car, value) => ({
			...car,
			airConditionerCtrlUnit: value ? (value as AirConditionerCtrlUnit) : null,
		}),
	},
	{
		type: "select",
		fieldKey: "airConditionerRunMode",
		label: "空調モード",
		options: [
			{ value: "", label: "未設定" },
			...AIR_CONDITIONER_RUN_MODE_OPTIONS.map((v) => ({ value: v, label: v })),
		],
		toSelectValue: (car) => car.airConditionerRunMode ?? "",
		fromSelectValue: (car, value) => ({
			...car,
			airConditionerRunMode: value ? (value as AirConditionerRunMode) : null,
		}),
	},
	{
		type: "select",
		fieldKey: "fanState",
		label: "送風",
		options: [
			{ value: "", label: "未設定" },
			...FAN_STATE_OPTIONS.map((v) => ({ value: v, label: v })),
		],
		toSelectValue: (car) => car.fanState ?? "",
		fromSelectValue: (car, value) => ({
			...car,
			fanState: value ? (value as FanState) : null,
		}),
	},
	{
		type: "nullable-number",
		fieldKey: "temperature",
		label: "温度",
		getValue: (car) => car.temperature,
		setValue: (car, value) => ({ ...car, temperature: value }),
	},
	{
		type: "nullable-number",
		fieldKey: "humidity",
		label: "湿度",
		getValue: (car) => car.humidity,
		setValue: (car, value) => ({ ...car, humidity: value }),
	},
	{
		type: "nullable-number",
		fieldKey: "coolingTargetTemperature",
		label: "冷房目標温度",
		getValue: (car) => car.coolingTargetTemperature,
		setValue: (car, value) => ({ ...car, coolingTargetTemperature: value }),
	},
	{
		type: "nullable-number",
		fieldKey: "heatingTargetTemperature",
		label: "暖房目標温度",
		getValue: (car) => car.heatingTargetTemperature,
		setValue: (car, value) => ({ ...car, heatingTargetTemperature: value }),
	},
	{
		type: "select",
		fieldKey: "airConditionerAdjustmentMode",
		label: "空調補正モード",
		options: [
			{ value: "", label: "未設定" },
			...AIR_CONDITIONER_ADJUSTMENT_MODE_OPTIONS.map((v) => ({
				value: v,
				label: v,
			})),
		],
		toSelectValue: (car) => car.airConditionerAdjustmentMode ?? "",
		fromSelectValue: (car, value) => ({
			...car,
			airConditionerAdjustmentMode: value
				? (value as AirConditionerAdjustmentMode)
				: null,
		}),
	},
	{
		type: "select",
		fieldKey: "isVentOn",
		label: "換気",
		options: NULLABLE_BOOLEAN_OPTIONS,
		toSelectValue: (car) => nullableBooleanToSelectValue(car.isVentOn),
		fromSelectValue: (car, value) => ({
			...car,
			isVentOn: selectValueToNullableBoolean(value),
		}),
	},
	{
		type: "select",
		fieldKey: "isRoomLightOn",
		label: "室内灯",
		options: NULLABLE_BOOLEAN_OPTIONS,
		toSelectValue: (car) => nullableBooleanToSelectValue(car.isRoomLightOn),
		fromSelectValue: (car, value) => ({
			...car,
			isRoomLightOn: selectValueToNullableBoolean(value),
		}),
	},
	{
		type: "nullable-number",
		fieldKey: "occupancy",
		label: "乗車人数",
		getValue: (car) => car.occupancy,
		setValue: (car, value) => ({ ...car, occupancy: value }),
	},
	{
		type: "nullable-number",
		fieldKey: "occupancyRate",
		label: "乗車率",
		step: "0.01",
		getValue: (car) => car.occupancyRate,
		setValue: (car, value) => ({ ...car, occupancyRate: value }),
	},
] as const;

export const CAR_STATES_FIELDS: readonly CarStateBasicField[] = [
	{
		type: "select",
		fieldKey: "isMSOn",
		label: "MS",
		options: BOOLEAN_OR_UNDEFINED_OPTIONS,
		toSelectValue: (car) =>
			nullableBooleanOrUndefinedToSelectValue(car.carState.isMSOn),
		fromSelectValue: (car, value) => ({
			...car,
			carState: {
				...car.carState,
				isMSOn: selectValueToNullableBooleanOrUndefined(value),
			},
		}),
	},
	{
		type: "select",
		fieldKey: "isCPOn",
		label: "CP",
		options: BOOLEAN_OR_UNDEFINED_OPTIONS,
		toSelectValue: (car) =>
			nullableBooleanOrUndefinedToSelectValue(car.carState.isCPOn),
		fromSelectValue: (car, value) => ({
			...car,
			carState: {
				...car.carState,
				isCPOn: selectValueToNullableBooleanOrUndefined(value),
			},
		}),
	},
	{
		type: "select",
		fieldKey: "isMRPressureNormal",
		label: "MR圧正常",
		options: NULLABLE_BOOLEAN_NORMAL_OPTIONS,
		toSelectValue: (car) =>
			nullableBooleanToSelectValue(car.carState.isMRPressureNormal),
		fromSelectValue: (car, value) => ({
			...car,
			carState: {
				...car.carState,
				isMRPressureNormal: selectValueToNullableBoolean(value),
			},
		}),
	},
	{
		type: "select",
		fieldKey: "isTestSWOn",
		label: "試験SW",
		options: NULLABLE_BOOLEAN_OPTIONS,
		toSelectValue: (car) =>
			nullableBooleanToSelectValue(car.carState.isTestSWOn),
		fromSelectValue: (car, value) => ({
			...car,
			carState: {
				...car.carState,
				isTestSWOn: selectValueToNullableBoolean(value),
			},
		}),
	},
	{
		type: "select",
		fieldKey: "isSnowBrakeOn",
		label: "雪ブレーキ",
		options: NULLABLE_BOOLEAN_OPTIONS,
		toSelectValue: (car) =>
			nullableBooleanToSelectValue(car.carState.isSnowBrakeOn),
		fromSelectValue: (car, value) => ({
			...car,
			carState: {
				...car.carState,
				isSnowBrakeOn: selectValueToNullableBoolean(value),
			},
		}),
	},
	{
		type: "select",
		fieldKey: "isReduceLoadOn",
		label: "減負荷",
		options: NULLABLE_BOOLEAN_OPTIONS,
		toSelectValue: (car) =>
			nullableBooleanToSelectValue(car.carState.isReduceLoadOn),
		fromSelectValue: (car, value) => ({
			...car,
			carState: {
				...car.carState,
				isReduceLoadOn: selectValueToNullableBoolean(value),
			},
		}),
	},
	{
		type: "nullable-number",
		fieldKey: "mrPressure",
		label: "MR圧力",
		getValue: (car) => car.carState.mrPressure,
		setValue: (car, value) => ({
			...car,
			carState: { ...car.carState, mrPressure: value },
		}),
	},
	{
		type: "nullable-number",
		fieldKey: "bcPressure0",
		label: "BC圧力 #1",
		getValue: (car) => car.carState.bcPressure[0],
		setValue: (car, value) => {
			const nextBcPressure = [...car.carState.bcPressure] as [
				number | null,
				number | null,
				number | null,
				number | null,
			];
			nextBcPressure[0] = value;
			return {
				...car,
				carState: { ...car.carState, bcPressure: nextBcPressure },
			};
		},
	},
	{
		type: "nullable-number",
		fieldKey: "bcPressure1",
		label: "BC圧力 #2",
		getValue: (car) => car.carState.bcPressure[1],
		setValue: (car, value) => {
			const nextBcPressure = [...car.carState.bcPressure] as [
				number | null,
				number | null,
				number | null,
				number | null,
			];
			nextBcPressure[1] = value;
			return {
				...car,
				carState: { ...car.carState, bcPressure: nextBcPressure },
			};
		},
	},
	{
		type: "nullable-number",
		fieldKey: "bcPressure2",
		label: "BC圧力 #3",
		getValue: (car) => car.carState.bcPressure[2],
		setValue: (car, value) => {
			const nextBcPressure = [...car.carState.bcPressure] as [
				number | null,
				number | null,
				number | null,
				number | null,
			];
			nextBcPressure[2] = value;
			return {
				...car,
				carState: { ...car.carState, bcPressure: nextBcPressure },
			};
		},
	},
	{
		type: "nullable-number",
		fieldKey: "bcPressure3",
		label: "BC圧力 #4",
		getValue: (car) => car.carState.bcPressure[3],
		setValue: (car, value) => {
			const nextBcPressure = [...car.carState.bcPressure] as [
				number | null,
				number | null,
				number | null,
				number | null,
			];
			nextBcPressure[3] = value;
			return {
				...car,
				carState: { ...car.carState, bcPressure: nextBcPressure },
			};
		},
	},
	{
		type: "select",
		fieldKey: "isBrakeChopperOn",
		label: "ブレーキチョッパ",
		options: NULLABLE_BOOLEAN_OPTIONS,
		toSelectValue: (car) =>
			nullableBooleanToSelectValue(car.carState.isBrakeChopperOn),
		fromSelectValue: (car, value) => ({
			...car,
			carState: {
				...car.carState,
				isBrakeChopperOn: selectValueToNullableBoolean(value),
			},
		}),
	},
	{
		type: "nullable-string",
		fieldKey: "receivedNotchCommand",
		label: "受信ノッチ指令",
		getValue: (car) => car.carState.receivedNotchCommand,
		setValue: (car, value) => ({
			...car,
			carState: { ...car.carState, receivedNotchCommand: value },
		}),
	},
] as const;

export const SIV_LINE_STATE_FIELDS: readonly SivLineStateField[] = [
	{
		type: "select",
		fieldKey: "isCgKForSIVOn",
		label: "CgK for SIV",
		options: NULLABLE_BOOLEAN_OPTIONS,
		toSelectValue: (car) =>
			car.carState.sivLineState
				? nullableBooleanToSelectValue(car.carState.sivLineState.isCgKForSIVOn)
				: "null",
		fromSelectValue: (car, value) => {
			if (!car.carState.sivLineState) {
				return car;
			}
			return {
				...car,
				carState: {
					...car.carState,
					sivLineState: {
						...car.carState.sivLineState,
						isCgKForSIVOn: selectValueToNullableBoolean(value),
					},
				},
			};
		},
	},
	{
		type: "select",
		fieldKey: "isIvMSOn",
		label: "IvMS",
		options: BOOLEAN_OPTIONS,
		toSelectValue: (car) =>
			car.carState.sivLineState
				? booleanToSelectValue(car.carState.sivLineState.isIvMSOn)
				: "false",
		fromSelectValue: (car, value) => {
			if (!car.carState.sivLineState) {
				return car;
			}
			return {
				...car,
				carState: {
					...car.carState,
					sivLineState: {
						...car.carState.sivLineState,
						isIvMSOn: value === "true",
					},
				},
			};
		},
	},
	{
		type: "select",
		fieldKey: "isIvHBOn",
		label: "IvHB",
		options: BOOLEAN_OPTIONS,
		toSelectValue: (car) =>
			car.carState.sivLineState
				? booleanToSelectValue(car.carState.sivLineState.isIvHBOn)
				: "false",
		fromSelectValue: (car, value) => {
			if (!car.carState.sivLineState) {
				return car;
			}
			return {
				...car,
				carState: {
					...car.carState,
					sivLineState: {
						...car.carState.sivLineState,
						isIvHBOn: value === "true",
					},
				},
			};
		},
	},
	{
		type: "select",
		fieldKey: "isIvLOn",
		label: "IvL",
		options: BOOLEAN_OPTIONS,
		toSelectValue: (car) =>
			car.carState.sivLineState
				? booleanToSelectValue(car.carState.sivLineState.isIvLOn)
				: "false",
		fromSelectValue: (car, value) => {
			if (!car.carState.sivLineState) {
				return car;
			}
			return {
				...car,
				carState: {
					...car.carState,
					sivLineState: {
						...car.carState.sivLineState,
						isIvLOn: value === "true",
					},
				},
			};
		},
	},
	{
		type: "select",
		fieldKey: "isSIVOn",
		label: "SIV",
		options: NULLABLE_BOOLEAN_OPTIONS,
		toSelectValue: (car) =>
			car.carState.sivLineState
				? nullableBooleanToSelectValue(car.carState.sivLineState.isSIVOn)
				: "null",
		fromSelectValue: (car, value) => {
			if (!car.carState.sivLineState) {
				return car;
			}
			return {
				...car,
				carState: {
					...car.carState,
					sivLineState: {
						...car.carState.sivLineState,
						isSIVOn: selectValueToNullableBoolean(value),
					},
				},
			};
		},
	},
	{
		type: "select",
		fieldKey: "is3phMKOn",
		label: "3相MK",
		options: NULLABLE_BOOLEAN_OPTIONS,
		toSelectValue: (car) =>
			car.carState.sivLineState
				? nullableBooleanToSelectValue(car.carState.sivLineState.is3phMKOn)
				: "null",
		fromSelectValue: (car, value) => {
			if (!car.carState.sivLineState) {
				return car;
			}
			return {
				...car,
				carState: {
					...car.carState,
					sivLineState: {
						...car.carState.sivLineState,
						is3phMKOn: selectValueToNullableBoolean(value),
					},
				},
			};
		},
	},
	{
		type: "select",
		fieldKey: "isIvCNOn",
		label: "IvCN",
		options: NULLABLE_BOOLEAN_OPTIONS,
		toSelectValue: (car) =>
			car.carState.sivLineState
				? nullableBooleanToSelectValue(car.carState.sivLineState.isIvCNOn)
				: "null",
		fromSelectValue: (car, value) => {
			if (!car.carState.sivLineState) {
				return car;
			}
			return {
				...car,
				carState: {
					...car.carState,
					sivLineState: {
						...car.carState.sivLineState,
						isIvCNOn: selectValueToNullableBoolean(value),
					},
				},
			};
		},
	},
	{
		type: "select",
		fieldKey: "isIVSMDSOn",
		label: "IVSMDS",
		options: NULLABLE_BOOLEAN_OPTIONS,
		toSelectValue: (car) =>
			car.carState.sivLineState
				? nullableBooleanToSelectValue(car.carState.sivLineState.isIVSMDSOn)
				: "null",
		fromSelectValue: (car, value) => {
			if (!car.carState.sivLineState) {
				return car;
			}
			return {
				...car,
				carState: {
					...car.carState,
					sivLineState: {
						...car.carState.sivLineState,
						isIVSMDSOn: selectValueToNullableBoolean(value),
					},
				},
			};
		},
	},
	{
		type: "nullable-number",
		fieldKey: "sivVoltage",
		label: "SIV電圧",
		getValue: (car) => car.carState.sivLineState?.sivVoltage ?? null,
		setValue: (car, value) => {
			if (!car.carState.sivLineState) {
				return car;
			}
			return {
				...car,
				carState: {
					...car.carState,
					sivLineState: {
						...car.carState.sivLineState,
						sivVoltage: value,
					},
				},
			};
		},
	},
	{
		type: "nullable-number",
		fieldKey: "sivFrequency",
		label: "SIV周波数",
		getValue: (car) => car.carState.sivLineState?.sivFrequency ?? null,
		setValue: (car, value) => {
			if (!car.carState.sivLineState) {
				return car;
			}
			return {
				...car,
				carState: {
					...car.carState,
					sivLineState: {
						...car.carState.sivLineState,
						sivFrequency: value,
					},
				},
			};
		},
	},
] as const;

export const CAB_STATE_FIELDS: readonly CabStateField[] = [
	{
		type: "select",
		fieldKey: "side",
		label: "運転台側",
		options: SIDE_OPTIONS,
		toSelectValue: (car) => car.cabState?.side ?? "left",
		fromSelectValue: (car, value) => {
			if (!car.cabState) {
				return car;
			}
			return {
				...car,
				cabState: {
					...car.cabState,
					side: value as "left" | "right",
				},
			};
		},
	},
	{
		type: "select",
		fieldKey: "cabSesState",
		label: "SES",
		options: [
			{ value: "", label: "未設定" },
			...CAB_SES_STATE_OPTIONS.map((v) => ({ value: v, label: v })),
		],
		toSelectValue: (car) => car.cabState?.cabSesState ?? "",
		fromSelectValue: (car, value) => {
			if (!car.cabState) {
				return car;
			}
			return {
				...car,
				cabState: {
					...car.cabState,
					cabSesState: value ? (value as CabSesState) : null,
				},
			};
		},
	},
	{
		type: "select",
		fieldKey: "isBHEBOn",
		label: "BHEB",
		options: NULLABLE_BOOLEAN_OPTIONS,
		toSelectValue: (car) =>
			car.cabState
				? nullableBooleanToSelectValue(car.cabState.isBHEBOn)
				: "null",
		fromSelectValue: (car, value) => {
			if (!car.cabState) {
				return car;
			}
			return {
				...car,
				cabState: {
					...car.cabState,
					isBHEBOn: selectValueToNullableBoolean(value),
				},
			};
		},
	},
	{
		type: "select",
		fieldKey: "isConductorEBOn",
		label: "車掌EB",
		options: NULLABLE_BOOLEAN_OPTIONS,
		toSelectValue: (car) =>
			car.cabState
				? nullableBooleanToSelectValue(car.cabState.isConductorEBOn)
				: "null",
		fromSelectValue: (car, value) => {
			if (!car.cabState) {
				return car;
			}
			return {
				...car,
				cabState: {
					...car.cabState,
					isConductorEBOn: selectValueToNullableBoolean(value),
				},
			};
		},
	},
	{
		type: "select",
		fieldKey: "isSpareStraightBrakeOn",
		label: "予備直通ブレーキ",
		options: NULLABLE_BOOLEAN_OPTIONS,
		toSelectValue: (car) =>
			car.cabState
				? nullableBooleanToSelectValue(car.cabState.isSpareStraightBrakeOn)
				: "null",
		fromSelectValue: (car, value) => {
			if (!car.cabState) {
				return car;
			}
			return {
				...car,
				cabState: {
					...car.cabState,
					isSpareStraightBrakeOn: selectValueToNullableBoolean(value),
				},
			};
		},
	},
	{
		type: "nullable-string",
		fieldKey: "orderedNotchCommand",
		label: "指令ノッチ",
		getValue: (car) => car.cabState?.orderedNotchCommand ?? null,
		setValue: (car, value) => {
			if (!car.cabState) {
				return car;
			}
			return {
				...car,
				cabState: {
					...car.cabState,
					orderedNotchCommand: value,
				},
			};
		},
	},
	{
		type: "select",
		fieldKey: "isTLKOn",
		label: "TLK",
		options: NULLABLE_BOOLEAN_OPTIONS,
		toSelectValue: (car) =>
			car.cabState
				? nullableBooleanToSelectValue(car.cabState.isTLKOn)
				: "null",
		fromSelectValue: (car, value) => {
			if (!car.cabState) {
				return car;
			}
			return {
				...car,
				cabState: {
					...car.cabState,
					isTLKOn: selectValueToNullableBoolean(value),
				},
			};
		},
	},
] as const;

export const BOGIE_COMMON_FIELDS: readonly BogieCommonField[] = [
	{
		type: "select",
		fieldKey: "isHBOn",
		label: "HB",
		options: NULLABLE_BOOLEAN_OPTIONS,
		toSelectValue: (car) =>
			car.bogieState
				? nullableBooleanToSelectValue(car.bogieState.isHBOn)
				: "null",
		fromSelectValue: (car, value) => {
			if (!car.bogieState) {
				return car;
			}
			return {
				...car,
				bogieState: {
					...car.bogieState,
					isHBOn: selectValueToNullableBoolean(value),
				},
			};
		},
	},
	{
		type: "select",
		fieldKey: "isCCOSNormal",
		label: "CCOS正常",
		options: NULLABLE_BOOLEAN_NORMAL_OPTIONS,
		toSelectValue: (car) =>
			car.bogieState
				? nullableBooleanToSelectValue(car.bogieState.isCCOSNormal)
				: "null",
		fromSelectValue: (car, value) => {
			if (!car.bogieState) {
				return car;
			}
			return {
				...car,
				bogieState: {
					...car.bogieState,
					isCCOSNormal: selectValueToNullableBoolean(value),
				},
			};
		},
	},
	{
		type: "select",
		fieldKey: "isLB1On",
		label: "LB1",
		options: NULLABLE_BOOLEAN_OPTIONS,
		toSelectValue: (car) =>
			car.bogieState
				? nullableBooleanToSelectValue(car.bogieState.isLB1On)
				: "null",
		fromSelectValue: (car, value) => {
			if (!car.bogieState) {
				return car;
			}
			return {
				...car,
				bogieState: {
					...car.bogieState,
					isLB1On: selectValueToNullableBoolean(value),
				},
			};
		},
	},
	{
		type: "select",
		fieldKey: "vvvf2State",
		label: "VVVF2状態",
		options: [
			{ value: "", label: "未設定" },
			...VVVF2_STATE_OPTIONS.map((v) => ({ value: v, label: v })),
		],
		toSelectValue: (car) => car.bogieState?.vvvf2State ?? "",
		fromSelectValue: (car, value) => {
			if (!car.bogieState) {
				return car;
			}
			return {
				...car,
				bogieState: {
					...car.bogieState,
					vvvf2State: value ? (value as VVVF2State) : null,
				},
			};
		},
	},
	{
		type: "select",
		fieldKey: "isCgKForVVVF2On",
		label: "CgK for VVVF2",
		options: NULLABLE_BOOLEAN_OPTIONS,
		toSelectValue: (car) =>
			car.bogieState
				? nullableBooleanToSelectValue(car.bogieState.isCgKForVVVF2On)
				: "null",
		fromSelectValue: (car, value) => {
			if (!car.bogieState) {
				return car;
			}
			return {
				...car,
				bogieState: {
					...car.bogieState,
					isCgKForVVVF2On: selectValueToNullableBoolean(value),
				},
			};
		},
	},
	{
		type: "nullable-number",
		fieldKey: "lineVoltage",
		label: "線間電圧",
		getValue: (car) => car.bogieState?.lineVoltage ?? null,
		setValue: (car, value) => {
			if (!car.bogieState) {
				return car;
			}
			return {
				...car,
				bogieState: {
					...car.bogieState,
					lineVoltage: value,
				},
			};
		},
	},
] as const;

export const createBogieSideFields = (
	side: "left" | "right",
): readonly BogieSideField[] => {
	const prefix = side === "left" ? "left" : "right";
	const sideKey = side;

	return [
		{
			type: "select",
			fieldKey: `${prefix}-isLbOn`,
			label: "LB",
			options: NULLABLE_BOOLEAN_OPTIONS,
			toSelectValue: (car) =>
				car.bogieState?.[sideKey]
					? nullableBooleanToSelectValue(car.bogieState[sideKey].isLbOn)
					: "null",
			fromSelectValue: (car, value) => {
				if (!car.bogieState?.[sideKey]) {
					return car;
				}
				return {
					...car,
					bogieState: {
						...car.bogieState,
						[sideKey]: {
							...car.bogieState[sideKey],
							isLbOn: selectValueToNullableBoolean(value),
						},
					},
				};
			},
		},
		{
			type: "nullable-number",
			fieldKey: `${prefix}-mmCurrent1`,
			label: "MM電流1",
			getValue: (car) => car.bogieState?.[sideKey]?.mmCurrent1 ?? null,
			setValue: (car, value) => {
				if (!car.bogieState?.[sideKey]) {
					return car;
				}
				return {
					...car,
					bogieState: {
						...car.bogieState,
						[sideKey]: {
							...car.bogieState[sideKey],
							mmCurrent1: value,
						},
					},
				};
			},
		},
		{
			type: "nullable-number",
			fieldKey: `${prefix}-mmCurrent2`,
			label: "MM電流2",
			getValue: (car) => car.bogieState?.[sideKey]?.mmCurrent2 ?? null,
			setValue: (car, value) => {
				if (!car.bogieState?.[sideKey]) {
					return car;
				}
				return {
					...car,
					bogieState: {
						...car.bogieState,
						[sideKey]: {
							...car.bogieState[sideKey],
							mmCurrent2: value,
						},
					},
				};
			},
		},
		{
			type: "select",
			fieldKey: `${prefix}-isMCOS1On`,
			label: "MCOS1",
			options: NULLABLE_BOOLEAN_OPTIONS,
			toSelectValue: (car) =>
				car.bogieState?.[sideKey]
					? nullableBooleanToSelectValue(car.bogieState[sideKey].isMCOS1On)
					: "null",
			fromSelectValue: (car, value) => {
				if (!car.bogieState?.[sideKey]) {
					return car;
				}
				return {
					...car,
					bogieState: {
						...car.bogieState,
						[sideKey]: {
							...car.bogieState[sideKey],
							isMCOS1On: selectValueToNullableBoolean(value),
						},
					},
				};
			},
		},
		{
			type: "select",
			fieldKey: `${prefix}-isMCOS2On`,
			label: "MCOS2",
			options: NULLABLE_BOOLEAN_OPTIONS,
			toSelectValue: (car) =>
				car.bogieState?.[sideKey]
					? nullableBooleanToSelectValue(car.bogieState[sideKey].isMCOS2On)
					: "null",
			fromSelectValue: (car, value) => {
				if (!car.bogieState?.[sideKey]) {
					return car;
				}
				return {
					...car,
					bogieState: {
						...car.bogieState,
						[sideKey]: {
							...car.bogieState[sideKey],
							isMCOS2On: selectValueToNullableBoolean(value),
						},
					},
				};
			},
		},
	] as const;
};

export const BOGIE_LEFT_FIELDS = createBogieSideFields("left");
export const BOGIE_RIGHT_FIELDS = createBogieSideFields("right");
