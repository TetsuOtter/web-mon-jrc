import { CAB_SES_STATE, CAR_SERIES } from "./type313sTypes";

import type {
	CabSesState,
	Type313sCabState,
	Type313sCarInfoState,
	Type313sCarState,
	Type313sBogieCommonState,
	Type313sBogieState,
	Type313sFormation,
} from "./type313sTypes";

export function create313_Y0(): Type313sFormation {
	return create313Formation("Y0編成", ["Mc1", "T1", "M1", "Tc1"]);
}
export function create313_Y30_K(): Type313sFormation {
	return create313Formation("Y30/K編成", ["Mc2", "Tc2"]);
}

export function create313_B0_J0_1000(): Type313sFormation {
	return create313Formation("B0/J0編成(1000番台)", ["Mc1", "T1", "M1", "Tc1"]);
}
export function create313_B100_J150_1500(): Type313sFormation {
	return create313Formation("B100/J150編成(1500番台)", ["Mc1", "M2", "Tc1"]);
}

export function create313_V_B300_R100(): Type313sFormation {
	return create313Formation("V/B300/R100編成", ["Mc4_2Pan", "Tc2"]);
}

export function create313_B200_S(): Type313sFormation {
	return create313Formation("B200/S編成", ["Mc1", "M2", "Tc1"]);
}

export function create313_B0_J0_1100(): Type313sFormation {
	return create313Formation("B0/J0編成(1100番台)", ["Mc1", "T2", "M1", "Tc2"]);
}
export function create313_B100_J150_1600(): Type313sFormation {
	return create313Formation("B100/J160編成(1600番台)", ["Mc1", "M4", "Tc2"]);
}

export function create313_B150_J170(): Type313sFormation {
	return create313Formation("B150/J170編成", ["Mc3", "M6", "Tc2"]);
}

export function create313_T(): Type313sFormation {
	return create313Formation("T編成", ["Mc1", "M4", "Tc2"]);
}
export function create313_N(): Type313sFormation {
	return create313Formation("N編成", ["Mc3", "M6", "Tc2"]);
}
export function create313_W_2300(): Type313sFormation {
	return create313Formation("W編成(2300番台)", ["Mc4", "Tc2"]);
}
export function create313_W_2350(): Type313sFormation {
	return create313Formation("W編成(2350番台)", ["Mc4_2Pan", "Tc2"]);
}

export function create313_V(): Type313sFormation {
	return create313Formation("V編成", ["Mc4_2Pan", "Tc2"]);
}

export function create313_Y100(): Type313sFormation {
	return create313Formation("Y100編成", ["Mc3", "T3", "M3", "T2", "M5", "Tc2"]);
}

export function create313_J0(): Type313sFormation {
	return create313Formation("J0編成", ["Mc1", "T2", "M1", "Tc2"]);
}

export function create313_B400_L_B500_R200(): Type313sFormation {
	return create313Formation("B400/L/B500/R200編成", ["Mc4_2Pan", "Tc2"]);
}
export function create313_Z(): Type313sFormation {
	return create313Formation("Z編成", ["Mc4", "Tc2"]);
}

export function create315_C0(): Type313sFormation {
	return create315Formation("C0編成", [
		"Tc1L",
		"M1",
		"M2",
		"T1",
		"T2",
		"M1",
		"M2",
		"Tc2R",
	]);
}
export function create315_C100_U(): Type313sFormation {
	return create315Formation("C100/U編成", ["Tc1L", "M1", "M2", "Tc2R"]);
}

function create313Formation(
	unitName: string,
	types: Type313CarTypes[],
): Type313sFormation {
	const carInfoList: Type313sCarInfoState[] = types.map((type) => {
		return TYPE313_CAR_CREATOR_MAP[type]();
	});
	return {
		series: CAR_SERIES[313],
		unitName,
		carInfoList,
	};
}

function create315Formation(
	unitName: string,
	types: Type315CarTypes[],
): Type313sFormation {
	const carInfoList: Type313sCarInfoState[] = types.map((type) => {
		return TYPE315_CAR_CREATOR_MAP[type]();
	});
	return {
		series: CAR_SERIES[315],
		unitName,
		carInfoList,
	};
}

// variations src: https://ja.wikipedia.org/wiki/JR%E6%9D%B1%E6%B5%B7313%E7%B3%BB%E9%9B%BB%E8%BB%8A
const TYPE313_CAR_CREATOR_MAP = {
	Mc1: getCreator(createMc, {
		hasLeftPantograph: false,
		hasRightPantograph: true,
	}),
	Mc2: getCreator(createMc, {
		hasLeftPantograph: false,
		hasRightPantograph: true,
	}),
	Mc3: getCreator(createMc, {
		hasLeftPantograph: false,
		hasRightPantograph: true,
	}),
	Mc4: getCreator(createMc, {
		hasLeftPantograph: false,
		hasRightPantograph: true,
	}),
	Mc4_2Pan: getCreator(createMc, {
		hasLeftPantograph: true,
		hasRightPantograph: false,
	}),
	M1: getCreator(createM, {
		hasRightPantograph: true,
		hasRightMotoredBogie: true,
		hasCP: false,
		hasSIV: false,
	}),
	M2: getCreator(createM, {
		hasRightPantograph: false,
		hasRightMotoredBogie: false,
		hasCP: false,
		hasSIV: false,
	}),
	M3: getCreator(createM, {
		hasRightPantograph: true,
		hasRightMotoredBogie: true,
		hasCP: false,
		hasSIV: false,
	}),
	M4: getCreator(createM, {
		hasRightPantograph: true,
		hasRightMotoredBogie: true,
		hasCP: true,
		hasSIV: false,
	}),
	M5: getCreator(createM, {
		hasRightPantograph: true,
		hasRightMotoredBogie: true,
		hasCP: false,
		hasSIV: true,
	}),
	M6: getCreator(createM, {
		hasRightPantograph: true,
		hasRightMotoredBogie: true,
		hasCP: true,
		hasSIV: false,
	}),
	T1: getCreator(createT, {
		hasCP: false,
	}),
	T2: getCreator(createT, {
		hasCP: true,
	}),
	T3: getCreator(createT, {
		hasCP: true,
	}),
	Tc1: getCreator(create313Tc, undefined),
	Tc2: getCreator(create313Tc, undefined),
} as const satisfies Record<string, () => Type313sCarInfoState>;
type Type313CarTypes = keyof typeof TYPE313_CAR_CREATOR_MAP;

// variations src: https://ja.wikipedia.org/wiki/JR%E6%9D%B1%E6%B5%B7315%E7%B3%BB%E9%9B%BB%E8%BB%8A
const TYPE315_CAR_CREATOR_MAP = {
	M1: getCreator(createM, {
		hasRightPantograph: true,
		hasRightMotoredBogie: true,
		hasCP: false,
		hasSIV: true,
	}),
	M2: getCreator(createM, {
		hasRightPantograph: true,
		hasRightMotoredBogie: true,
		hasCP: false,
		hasSIV: false,
	}),
	T1: getCreator(createT, {
		hasCP: true,
	}),
	T2: getCreator(createT, {
		hasCP: true,
	}),
	Tc1L: getCreator(create315Tc, "left"),
	Tc2R: getCreator(create315Tc, "right"),
} as const satisfies Record<string, () => Type313sCarInfoState>;
type Type315CarTypes = keyof typeof TYPE315_CAR_CREATOR_MAP;

function getCreator<T>(
	creatorFunc: (arg: T) => Type313sCarInfoState,
	arg: T,
): () => Type313sCarInfoState {
	return () => creatorFunc(arg);
}

type CreateMcConfig = Readonly<{
	hasLeftPantograph: boolean;
	hasRightPantograph: boolean;
}>;
function createMc({
	hasLeftPantograph,
	hasRightPantograph,
}: CreateMcConfig): Type313sCarInfoState {
	return createCarInfoInitialValue({
		carType: "Mc",

		hasLeftPantograph,
		hasRightPantograph,
		hasCP: true,
		hasSIV: true,
		cab: {
			side: "left",
			cabSesState: CAB_SES_STATE.FORWARD,
		},
		hasLeftMotoredBogie: true,
		hasRightMotoredBogie: true,
	});
}

type CreateMConfig = Readonly<{
	hasRightPantograph: boolean;
	hasRightMotoredBogie: boolean;
	hasCP: boolean;
	hasSIV: boolean;
}>;
function createM({
	hasRightPantograph,
	hasRightMotoredBogie,
	hasCP,
	hasSIV,
}: CreateMConfig): Type313sCarInfoState {
	return createCarInfoInitialValue({
		carType: "M",

		hasLeftPantograph: false,
		hasRightPantograph,
		hasCP,
		hasSIV,
		cab: undefined,
		hasLeftMotoredBogie: true,
		hasRightMotoredBogie,
	});
}
type CreateTConfig = Readonly<{
	hasCP: boolean;
}>;
function createT({ hasCP }: CreateTConfig): Type313sCarInfoState {
	return createCarInfoInitialValue({
		carType: "T",

		hasLeftPantograph: false,
		hasRightPantograph: false,
		hasCP,
		hasSIV: false,
		cab: undefined,
		hasLeftMotoredBogie: false,
		hasRightMotoredBogie: false,
	});
}

function create313Tc(): Type313sCarInfoState {
	return createCarInfoInitialValue({
		carType: "Tc",
		hasLeftPantograph: false,
		hasRightPantograph: false,
		hasCP: true,
		hasSIV: false,
		cab: {
			side: "right",
			cabSesState: CAB_SES_STATE.REVERSE,
		},
		hasLeftMotoredBogie: false,
		hasRightMotoredBogie: false,
	});
}
function create315Tc(cabSide: "left" | "right"): Type313sCarInfoState {
	return createCarInfoInitialValue({
		carType: "Tc",
		hasLeftPantograph: false,
		hasRightPantograph: false,
		hasCP: true,
		hasSIV: false,
		cab: {
			side: cabSide,
			cabSesState:
				cabSide === "left" ? CAB_SES_STATE.FORWARD : CAB_SES_STATE.REVERSE,
		},
		hasLeftMotoredBogie: false,
		hasRightMotoredBogie: false,
	});
}

type CarInfoInitialValueConfig = Readonly<{
	carType: string;
	hasLeftPantograph: boolean;
	hasRightPantograph: boolean;
	cab: CabStateInitialValueConfig | undefined;
}> &
	CarStateInitialValueConfig &
	BogieStateInitialValueConfig;
function createCarInfoInitialValue({
	carType,
	hasLeftPantograph,
	hasRightPantograph,
	cab,
	...carStateConfig
}: CarInfoInitialValueConfig): Type313sCarInfoState {
	return {
		carType,

		hasLeftPantograph,
		hasRightPantograph,

		isDoorClosed: true,
		isAnnounceOn: true,
		airConditionerState: "AUTO_COOLING",
		airConditionerCtrlUnit: "CENTRAL",
		airConditionerRunMode: "AUTO_COOLING",
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

		carState: createCarStateInitialValue(carStateConfig),

		cabState: cab != null ? createCabStateInitialValue(cab) : undefined,

		bogieState: createBogieCommonStateInitialValue(carStateConfig),
	};
}

type CarStateInitialValueConfig = Readonly<{
	hasCP: boolean;
	hasSIV: boolean;
}> &
	BogieStateInitialValueConfig;
function createCarStateInitialValue({
	hasCP,
	hasSIV,
	hasLeftMotoredBogie,
	hasRightMotoredBogie,
}: CarStateInitialValueConfig): Type313sCarState {
	return {
		isMSOn: hasLeftMotoredBogie || hasRightMotoredBogie ? true : undefined,
		isCPOn: hasCP ? true : undefined,
		isMRPressureNormal: true,
		isTestSWOn: false,
		isSnowBrakeOn: false,

		sivLineState: hasSIV
			? {
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
				}
			: undefined,
		isReduceLoadOn: false,

		isBrakeChopperOn: false,
		bcPressure: [300, 300, 300, 300],
		mrPressure: 860,
		receivedNotchCommand: "非常",
	};
}

type CabStateInitialValueConfig = Readonly<{
	side: "left" | "right";
	cabSesState: CabSesState;
}>;
function createCabStateInitialValue({
	side,
	cabSesState,
}: CabStateInitialValueConfig): Type313sCabState {
	return {
		side,
		cabSesState,
		isBHEBOn: false,
		isConductorEBOn: false,
		isSpareStraightBrakeOn: false,
		orderedNotchCommand:
			cabSesState === CAB_SES_STATE.FORWARD ? "非常" : undefined,
		isTLKOn: false,
	};
}

type BogieStateInitialValueConfig = Readonly<{
	hasLeftMotoredBogie: boolean;
	hasRightMotoredBogie: boolean;
}>;
function createBogieCommonStateInitialValue({
	hasLeftMotoredBogie,
	hasRightMotoredBogie,
}: BogieStateInitialValueConfig): Type313sBogieCommonState {
	return {
		isHBOn: true,
		isCCOSNormal: true,
		isLB1On: true,
		vvvf2State: "VVVF",
		isCgKForVVVF2On: true,
		lineVoltage: 1650,

		left: hasLeftMotoredBogie ? createBogieStateInitialValue() : undefined,
		right: hasRightMotoredBogie ? createBogieStateInitialValue() : undefined,
	};
}

function createBogieStateInitialValue(): Type313sBogieState {
	return {
		isLbOn: true,
		mmCurrent1: 0,
		mmCurrent2: 0,
		isMCOS1On: true,
		isMCOS2On: true,
	};
}

export type FormationTemplate = Readonly<{
	name: string;
	displayName: string;
	series: 313 | 315;
	carCount: number;
	creator: () => Type313sFormation;
}>;

export const FORMATION_TEMPLATES: readonly FormationTemplate[] = [
	// 313系
	{
		name: "Y0",
		displayName: "Y0編成",
		series: 313,
		carCount: 4,
		creator: create313_Y0,
	},
	{
		name: "Y30_K",
		displayName: "Y30/K編成",
		series: 313,
		carCount: 2,
		creator: create313_Y30_K,
	},
	{
		name: "B0_J0_1000",
		displayName: "B0/J0編成(1000番台)",
		series: 313,
		carCount: 4,
		creator: create313_B0_J0_1000,
	},
	{
		name: "B100_J150_1500",
		displayName: "B100/J150編成(1500番台)",
		series: 313,
		carCount: 3,
		creator: create313_B100_J150_1500,
	},
	{
		name: "V_B300_R100",
		displayName: "V/B300/R100編成",
		series: 313,
		carCount: 2,
		creator: create313_V_B300_R100,
	},
	{
		name: "B200_S",
		displayName: "B200/S編成",
		series: 313,
		carCount: 3,
		creator: create313_B200_S,
	},
	{
		name: "B0_J0_1100",
		displayName: "B0/J0編成(1100番台)",
		series: 313,
		carCount: 4,
		creator: create313_B0_J0_1100,
	},
	{
		name: "B100_J150_1600",
		displayName: "B100/J160編成(1600番台)",
		series: 313,
		carCount: 3,
		creator: create313_B100_J150_1600,
	},
	{
		name: "B150_J170",
		displayName: "B150/J170編成",
		series: 313,
		carCount: 3,
		creator: create313_B150_J170,
	},
	{
		name: "T",
		displayName: "T編成",
		series: 313,
		carCount: 3,
		creator: create313_T,
	},
	{
		name: "N",
		displayName: "N編成",
		series: 313,
		carCount: 3,
		creator: create313_N,
	},
	{
		name: "W_2300",
		displayName: "W編成(2300番台)",
		series: 313,
		carCount: 2,
		creator: create313_W_2300,
	},
	{
		name: "W_2350",
		displayName: "W編成(2350番台)",
		series: 313,
		carCount: 2,
		creator: create313_W_2350,
	},
	{
		name: "V",
		displayName: "V編成",
		series: 313,
		carCount: 2,
		creator: create313_V,
	},
	{
		name: "Y100",
		displayName: "Y100編成",
		series: 313,
		carCount: 6,
		creator: create313_Y100,
	},
	{
		name: "J0",
		displayName: "J0編成",
		series: 313,
		carCount: 4,
		creator: create313_J0,
	},
	{
		name: "B400_L_B500_R200",
		displayName: "B400/L/B500/R200編成",
		series: 313,
		carCount: 2,
		creator: create313_B400_L_B500_R200,
	},
	{
		name: "Z",
		displayName: "Z編成",
		series: 313,
		carCount: 2,
		creator: create313_Z,
	},
	// 315系
	{
		name: "C0",
		displayName: "C0編成",
		series: 315,
		carCount: 8,
		creator: create315_C0,
	},
	{
		name: "C100_U",
		displayName: "C100/U編成",
		series: 315,
		carCount: 4,
		creator: create315_C100_U,
	},
] as const;
