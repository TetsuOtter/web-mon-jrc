import { CAB_SES_STATE } from "./type313sTypes";

import type {
	CabSesState,
	Type313sCabState,
	Type313sCarInfoState,
	Type313sCarState,
	Type313sBogieCommonState,
	Type313sBogieState,
} from "./type313sTypes";

export function createMc(carNumber: number): Type313sCarInfoState {
	return createCarInfoInitialValue({
		carType: "Mc",
		carNumber,
		hasLeftPantograph: false,
		hasRightPantograph: true,
		hasMS: true,
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
export function createM(carNumber: number): Type313sCarInfoState {
	return createCarInfoInitialValue({
		carType: "M",
		carNumber,
		hasLeftPantograph: false,
		hasRightPantograph: false,
		hasMS: true,
		hasCP: false,
		hasSIV: false,
		cab: undefined,
		hasLeftMotoredBogie: true,
		hasRightMotoredBogie: false,
	});
}
export function createTc(carNumber: number): Type313sCarInfoState {
	return createCarInfoInitialValue({
		carType: "Tc",
		carNumber,
		hasLeftPantograph: false,
		hasRightPantograph: false,
		hasMS: false,
		hasCP: false,
		hasSIV: false,
		cab: {
			side: "right",
			cabSesState: CAB_SES_STATE.REVERSE,
		},
		hasLeftMotoredBogie: false,
		hasRightMotoredBogie: false,
	});
}

type CarInfoInitialValueConfig = Readonly<{
	carType: string;
	carNumber: number;
	hasLeftPantograph: boolean;
	hasRightPantograph: boolean;
	cab: CabStateInitialValueConfig | undefined;
}> &
	CarStateInitialValueConfig &
	BogieStateInitialValueConfig;
export function createCarInfoInitialValue({
	carType,
	carNumber,
	hasLeftPantograph,
	hasRightPantograph,
	cab,
	...carStateConfig
}: CarInfoInitialValueConfig): Type313sCarInfoState {
	return {
		carType,
		carNumber,
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
	hasMS: boolean;
	hasCP: boolean;
	hasSIV: boolean;
}>;
function createCarStateInitialValue({
	hasMS,
	hasCP,
	hasSIV,
}: CarStateInitialValueConfig): Type313sCarState {
	return {
		isMSOn: hasMS ? true : undefined,
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
