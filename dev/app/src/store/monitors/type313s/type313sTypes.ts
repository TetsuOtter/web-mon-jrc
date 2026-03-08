export type Type313sState = {
	trainNumber?: string;
	trainType?: string;
	destination?: string;
	currentLocation: number;
	timeMs?: number;

	carStateList: Type313sCarState[];
	conductorState: Type313sConductorState;
};

export type Type313sConductorState = {
	isRoomLightOn: boolean | null;
	isGuidanceOn: boolean | null;
};

export type Type313sCarState = {
	// 編成表示系
	carType: string;
	carNumber: number;
	hasLeftPantograph: boolean;
	hasRightPantograph: boolean;

	// 車掌系
	isDoorClosed: boolean | null;
	isAnnounceOn: boolean | null;
	airConditionerState: AirConditionerState | null;
	airConditionerCtrlUnit: AirConditionerCtrlUnit | null;
	airConditionerRunMode: AirConditionerRunMode | null;
	fanState: FanState | null;
	temperature: number | null;
	humidity: number | null;
	coolingTargetTemperature: number | null;
	heatingTargetTemperature: number | null;
	airConditionerAdjustmentMode: AirConditionerAdjustmentMode | null;
	isVentOn: boolean | null;
	isRoomLightOn: boolean | null;

	// 乗車率
	occupancy: number | null;
	occupancyRate: number | null;

	// 車両状態
	carStates: Type313sCarStatus;

	cabState?: Type313sCabState;
	bogieState?: Type313sBogieCommonState;
};

export type Type313sCarStatus = {
	isMSOn?: boolean | null;
	isCPOn?: boolean | null;
	isMRPressureNormal: boolean | null;
	isTestSWOn: boolean | null;
	isSnowBrakeOn: boolean | null;

	sivLineState?: Type313sSIVLineState;
	isReduceLoadOn: boolean | null;

	isBrakeChopperOn: boolean | null;
	bcPressure: [number | null, number | null, number | null, number | null];
	mrPressure: number | null;
	receivedNotchCommand: string | null;
};

export type Type313sSIVLineState = {
	isCgKForSIVOn: boolean | null;
	isIvMSOn: boolean;
	isIvHBOn: boolean;
	isIvLOn: boolean;
	isSIVOn: boolean | null;
	is3phMKOn: boolean | null;
	isIvCNOn: boolean | null;
	isIVSMDSOn: boolean | null;
	sivVoltage: number | null;
	sivFrequency: number | null;
};

export type Type313sCabState = {
	side: "left" | "right";
	cabSesState: CabSesState | null;
	isBHEBOn: boolean | null;
	isConductorEBOn: boolean | null;
	isSpareStraightBrakeOn: boolean | null;
	orderedNotchCommand?: string | null;
	isTLKOn: boolean | null;
};
export type Type313sBogieCommonState = {
	isHBOn: boolean | null;
	isCCOSNormal: boolean | null;
	isLB1On: boolean | null;
	vvvf2State: VVVF2State | null;
	isCgKForVVVF2On: boolean | null;
	lineVoltage: number | null;

	left?: Type313sBogieState;
	right?: Type313sBogieState;
};
export type Type313sBogieState = {
	isLbOn: boolean | null;
	mmCurrent1: number | null;
	mmCurrent2: number | null;
	isMCOS1On: boolean | null;
	isMCOS2On: boolean | null;
};

export const AIR_CONDITIONER_STATE = {
	AUTO_HEATING: "AUTO_HEATING",
	AUTO_COOLING: "AUTO_COOLING",
	OFF: "OFF",
} as const;
export type AirConditionerState =
	(typeof AIR_CONDITIONER_STATE)[keyof typeof AIR_CONDITIONER_STATE];
export const AIR_CONDITIONER_CTRL_UNIT = {
	CENTRAL: "CENTRAL",
} as const;
export type AirConditionerCtrlUnit =
	(typeof AIR_CONDITIONER_CTRL_UNIT)[keyof typeof AIR_CONDITIONER_CTRL_UNIT];
export const AIR_CONDITIONER_RUN_MODE = {
	...AIR_CONDITIONER_STATE,
	FULL_AUTO: "FULL_AUTO",
} as const;
export type AirConditionerRunMode =
	(typeof AIR_CONDITIONER_RUN_MODE)[keyof typeof AIR_CONDITIONER_RUN_MODE];

export const FAN_STATE = {
	AUTO_HIGH: "AUTO_HIGH",
	AUTO_LOW: "AUTO_LOW",
	AUTO_OFF: "AUTO_OFF",
	MANUAL_HIGH: "MANUAL_HIGH",
	MANUAL_LOW: "MANUAL_LOW",
	MANUAL_OFF: "MANUAL_OFF",
} as const;
export type FanState = (typeof FAN_STATE)[keyof typeof FAN_STATE];

export const AIR_CONDITIONER_ADJUSTMENT_MODE = {
	HIGH: "HIGH",
	NORMAL: "NORMAL",
	LOW: "LOW",
} as const;
export type AirConditionerAdjustmentMode =
	(typeof AIR_CONDITIONER_ADJUSTMENT_MODE)[keyof typeof AIR_CONDITIONER_ADJUSTMENT_MODE];

export const CAB_SES_STATE = {
	FORWARD: "FORWARD",
	NEUTRAL: "NEUTRAL",
	REVERSE: "REVERSE",
} as const;
export type CabSesState = (typeof CAB_SES_STATE)[keyof typeof CAB_SES_STATE];

export const VVVF2_STATE = {
	VVVF: "VVVF",
	VVVF2: "VVVF2",
} as const;
export type VVVF2State = (typeof VVVF2_STATE)[keyof typeof VVVF2_STATE];
