import type { ComponentType } from "react";

import CarStateBrake from "./car-state/CarStateBrake";
import CarStatePower from "./car-state/CarStatePower";
import CarStatePowerBrake from "./car-state/CarStatePowerBrake";
import CarStateSwitches from "./car-state/CarStateSwitches";
import CarStateThreePhaseAc from "./car-state/CarStateThreePhaseAc";
import Conductor315 from "./conductor/Conductor315";
import ConductorAirCond from "./conductor/ConductorAirCond";
import ConductorCarState from "./conductor/ConductorCarState";
import ConductorInfo from "./conductor/ConductorInfo";
import ConductorLocationCorrection from "./conductor/ConductorLocationCorrection";
import ConductorService from "./conductor/ConductorService";
import CorrectionMenu from "./correction/CorrectionMenu";
import CorrectionTime from "./correction/CorrectionTime";
import DriverInfo from "./driver/DriverInfo";
import DriverLocationCorrection from "./driver/DriverLocationCorrection";
import DriverReduceSpeed from "./driver/DriverReduceSpeed";
import DriverRoomLight from "./driver/DriverRoomLight";
import MaintenanceAirCondState from "./maintenance/MaintenanceAirCondState";
import MaintenanceBrokenList from "./maintenance/MaintenanceBrokenList";
import MaintenanceCommState from "./maintenance/MaintenanceCommState";
import MaintenanceCtrlTest from "./maintenance/MaintenanceCtrlTest";
import MaintenanceDiDo from "./maintenance/MaintenanceDiDo";
import MaintenanceDisplayTest from "./maintenance/MaintenanceDisplayTest";
import MaintenanceMenu from "./maintenance/MaintenanceMenu";
import MaintenanceSpecRecord from "./maintenance/MaintenanceSpecRecord";
import MaintenanceTestRun from "./maintenance/MaintenanceTestRun";
import CarDetection from "./menu/CarDetection";
import Menu from "./menu/Menu";
import OccupancyRate from "./menu/OccupancyRate";
import SetLocation from "./menu/SetLocation";
import OtherSeriesAnnounce1 from "./other-series/OtherSeriesAnnounce1";
import OtherSeriesAnnounce2 from "./other-series/OtherSeriesAnnounce2";
import OtherSeriesBroken from "./other-series/OtherSeriesBroken";
import OtherSeriesDriverInfo from "./other-series/OtherSeriesDriverInfo";
import OtherSeriesReduceSpeed from "./other-series/OtherSeriesReduceSpeed";
import OtherSeriesSubSetting from "./other-series/OtherSeriesSubSetting";
import OtherSeriesWorkSetting from "./other-series/OtherSeriesWorkSetting";
import OtherSeriesWorkSettingMenu from "./other-series/OtherSeriesWorkSettingMenu";
import { PAGE_TYPES } from "./pageTypes";
import SettingEntrance from "./setting/SettingEntrance";
import SettingMenu from "./setting/SettingMenu";
import SettingMonitor from "./setting/SettingMonitor";
import TableOfContents from "./toc/TableOfContents";
import WorkSettingSeat from "./work-setting/WorkSettingSeat";
import WorkSettingTop from "./work-setting/WorkSettingTop";
import WorkSettingType from "./work-setting/WorkSettingType";

import type { PageType } from "./pageTypes";

export const PAGE_COMPONENTS = {
	[PAGE_TYPES.MENU]: Menu,
	[PAGE_TYPES.OCCUPANCY_RATE]: OccupancyRate,
	[PAGE_TYPES.CAR_DETECTION]: CarDetection,
	[PAGE_TYPES.SET_LOCATION]: SetLocation,
	[PAGE_TYPES.TABLE_OF_CONTENTS]: TableOfContents,

	// Other Series pages
	[PAGE_TYPES.OTHER_SERIES_DRIVER_INFO]: OtherSeriesDriverInfo,
	[PAGE_TYPES.OTHER_SERIES_SUB_SETTING]: OtherSeriesSubSetting,
	[PAGE_TYPES.OTHER_SERIES_ANNOUNCE_1]: OtherSeriesAnnounce1,
	[PAGE_TYPES.OTHER_SERIES_ANNOUNCE_2]: OtherSeriesAnnounce2,
	[PAGE_TYPES.OTHER_SERIES_BROKEN]: OtherSeriesBroken,
	[PAGE_TYPES.OTHER_SERIES_WORK_SETTING]: OtherSeriesWorkSetting,
	[PAGE_TYPES.OTHER_SERIES_WORK_SETTING_MENU]: OtherSeriesWorkSettingMenu,
	[PAGE_TYPES.OTHER_SERIES_REDUCE_SPEED]: OtherSeriesReduceSpeed,

	// Maintenance pages
	[PAGE_TYPES["MAINTENANCE-MENU"]]: MaintenanceMenu,
	[PAGE_TYPES["MAINTENANCE-CTRL_TEST"]]: MaintenanceCtrlTest,
	[PAGE_TYPES["MAINTENANCE-COMM_STATE"]]: MaintenanceCommState,
	[PAGE_TYPES["MAINTENANCE-SPEC_RECORD"]]: MaintenanceSpecRecord,
	[PAGE_TYPES["MAINTENANCE-BROKEN_LIST"]]: MaintenanceBrokenList,
	[PAGE_TYPES["MAINTENANCE-TEST_RUN"]]: MaintenanceTestRun,
	[PAGE_TYPES["MAINTENANCE-DI_DO"]]: MaintenanceDiDo,
	[PAGE_TYPES["MAINTENANCE-AIR_COND_STATE"]]: MaintenanceAirCondState,
	[PAGE_TYPES["MAINTENANCE-DISPLAY_TEST"]]: MaintenanceDisplayTest,

	// Setting pages
	[PAGE_TYPES["SETTING-ENTRANCE"]]: SettingEntrance,
	[PAGE_TYPES["SETTING-MENU"]]: SettingMenu,
	[PAGE_TYPES["SETTING-MONITOR"]]: SettingMonitor,

	// Correction pages
	[PAGE_TYPES["CORRECTION-MENU"]]: CorrectionMenu,
	[PAGE_TYPES["CORRECTION-TIME"]]: CorrectionTime,

	// Car State pages
	[PAGE_TYPES["CAR_STATE-SWITCHES"]]: CarStateSwitches,
	[PAGE_TYPES["CAR_STATE-POWER"]]: CarStatePower,
	[PAGE_TYPES["CAR_STATE-BRAKE"]]: CarStateBrake,
	[PAGE_TYPES["CAR_STATE-THREE_PHASE_AC"]]: CarStateThreePhaseAc,
	[PAGE_TYPES["CAR_STATE-POWER_BRAKE"]]: CarStatePowerBrake,

	// Conductor pages
	[PAGE_TYPES["CONDUCTOR-INFO"]]: ConductorInfo,
	[PAGE_TYPES["CONDUCTOR-SERVICE"]]: ConductorService,
	[PAGE_TYPES["CONDUCTOR-AIR_COND"]]: ConductorAirCond,
	[PAGE_TYPES["CONDUCTOR-LOCATION_CORRECTION"]]: ConductorLocationCorrection,
	[PAGE_TYPES["CONDUCTOR-CAR_STATE"]]: ConductorCarState,
	[PAGE_TYPES["CONDUCTOR-315"]]: Conductor315,

	// Work Setting pages
	[PAGE_TYPES["WORK_SETTING-TOP"]]: WorkSettingTop,
	[PAGE_TYPES["WORK_SETTING-TYPE"]]: WorkSettingType,
	[PAGE_TYPES["WORK_SETTING-SEAT"]]: WorkSettingSeat,

	// Driver pages
	[PAGE_TYPES["DRIVER-INFO"]]: DriverInfo,
	[PAGE_TYPES["DRIVER-REDUCE_SPEED"]]: DriverReduceSpeed,
	[PAGE_TYPES["DRIVER-ROOM_LIGHT"]]: DriverRoomLight,
	[PAGE_TYPES["DRIVER-LOCATION_CORRECTION"]]: DriverLocationCorrection,
} as const satisfies Record<PageType, ComponentType>;
