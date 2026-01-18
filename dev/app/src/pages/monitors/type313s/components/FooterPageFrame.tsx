import type { PropsWithChildren } from "react";
import { memo } from "react";

import { useCanvasObjectContext } from "../../../../canvas-renderer/contexts/CanvasObjectContext";
import CanvasObjectGroup from "../../../../canvas-renderer/objects/CanvasObjectGroup";
import {
	DISPLAY_HEIGHT,
	DISPLAY_WIDTH,
	FOOTER_HEIGHT,
	HEADER_HEIGHT,
} from "../constants";
import FooterArea from "../footer/FooterArea";
import HeaderArea from "../header/HeaderArea";
import { ICONS } from "../icons";
import { PAGE_TYPES } from "../pages/pageTypes";

import { useCurrentPageType } from "./CurrentPageContext";

import type { FooterButtonInfo } from "../footer/FooterArea";
import type { IconData } from "../icons";
import type { PageType } from "../pages/pageTypes";

type FooterPageFrameProps = {
	readonly footerItems: FooterButtonInfo[];
};

export default memo<PropsWithChildren<FooterPageFrameProps>>(
	function FooterPageFrame({ footerItems, children }) {
		const pageType = useCurrentPageType();
		const parentObjectContext = useCanvasObjectContext();
		return (
			<CanvasObjectGroup
				relX={0}
				relY={0}
				width={parentObjectContext.metadata.width}
				height={parentObjectContext.metadata.height}>
				<HeaderArea
					icon={ICON_MAP_BY_PAGE[pageType]}
					pageName={PAGE_NAME_MAP[pageType]}
					trainNumber="1234"
					trainType="普通"
					trainDestination="大垣"
					timeMinutes={5}
				/>
				<CanvasObjectGroup
					relX={0}
					relY={HEADER_HEIGHT}
					width={DISPLAY_WIDTH}
					height={DISPLAY_HEIGHT - HEADER_HEIGHT}>
					<CanvasObjectGroup
						relX={0}
						relY={0}
						width={DISPLAY_WIDTH}
						height={DISPLAY_HEIGHT - HEADER_HEIGHT - FOOTER_HEIGHT}>
						{children}
					</CanvasObjectGroup>
					<FooterArea buttons={footerItems} />
				</CanvasObjectGroup>
			</CanvasObjectGroup>
		);
	}
);

const ICON_MAP_BY_PAGE: Record<PageType, IconData> = {
	// Menu pages
	[PAGE_TYPES.MENU]: ICONS.MENU,
	[PAGE_TYPES.OCCUPANCY_RATE]: ICONS.OCCUPANCY_RATE,
	[PAGE_TYPES.CAR_DETECTION]: ICONS.MENU,
	[PAGE_TYPES.SET_LOCATION]: ICONS.CORRECTION,
	[PAGE_TYPES.TABLE_OF_CONTENTS]: ICONS.TABLE_OF_CONTENTS_1,

	// Other Series pages
	[PAGE_TYPES.OTHER_SERIES_DRIVER_INFO]: ICONS.OTHER_SERIES,
	[PAGE_TYPES.OTHER_SERIES_SUB_SETTING]: ICONS.OTHER_SERIES,
	[PAGE_TYPES.OTHER_SERIES_ANNOUNCE_1]: ICONS.OTHER_SERIES,
	[PAGE_TYPES.OTHER_SERIES_ANNOUNCE_2]: ICONS.OTHER_SERIES,
	[PAGE_TYPES.OTHER_SERIES_BROKEN]: ICONS.OTHER_SERIES,
	[PAGE_TYPES.OTHER_SERIES_WORK_SETTING]: ICONS.OTHER_SERIES,
	[PAGE_TYPES.OTHER_SERIES_WORK_SETTING_MENU]: ICONS.OTHER_SERIES,
	[PAGE_TYPES.OTHER_SERIES_REDUCE_SPEED]: ICONS.OTHER_SERIES,

	// Maintenance pages
	[PAGE_TYPES["MAINTENANCE-MENU"]]: ICONS.MAINTENANCE,
	[PAGE_TYPES["MAINTENANCE-CTRL_TEST"]]: ICONS.MAINTENANCE,
	[PAGE_TYPES["MAINTENANCE-COMM_STATE"]]: ICONS.MAINTENANCE,
	[PAGE_TYPES["MAINTENANCE-SPEC_RECORD"]]: ICONS.MAINTENANCE,
	[PAGE_TYPES["MAINTENANCE-BROKEN_LIST"]]: ICONS.MAINTENANCE,
	[PAGE_TYPES["MAINTENANCE-TEST_RUN"]]: ICONS.MAINTENANCE,
	[PAGE_TYPES["MAINTENANCE-DI_DO"]]: ICONS.MAINTENANCE,
	[PAGE_TYPES["MAINTENANCE-AIR_COND_STATE"]]: ICONS.MAINTENANCE,
	[PAGE_TYPES["MAINTENANCE-DISPLAY_TEST"]]: ICONS.MAINTENANCE,

	// Setting pages
	[PAGE_TYPES["SETTING-ENTRANCE"]]: ICONS.MAINTENANCE,
	[PAGE_TYPES["SETTING-MENU"]]: ICONS.MAINTENANCE,
	[PAGE_TYPES["SETTING-MONITOR"]]: ICONS.MAINTENANCE,

	// Correction pages
	[PAGE_TYPES["CORRECTION-MENU"]]: ICONS.CORRECTION,
	[PAGE_TYPES["CORRECTION-TIME"]]: ICONS.CORRECTION,

	// Car State pages
	[PAGE_TYPES["CAR_STATE-SWITCHES"]]: ICONS.CAR_INFO_1,
	[PAGE_TYPES["CAR_STATE-POWER"]]: ICONS.CAR_INFO_1,
	[PAGE_TYPES["CAR_STATE-BRAKE"]]: ICONS.CAR_INFO_1,
	[PAGE_TYPES["CAR_STATE-THREE_PHASE_AC"]]: ICONS.CAR_INFO_1,
	[PAGE_TYPES["CAR_STATE-POWER_BRAKE"]]: ICONS.CAR_INFO_1,

	// Conductor pages
	[PAGE_TYPES["CONDUCTOR-INFO"]]: ICONS.CONDUCTOR,
	[PAGE_TYPES["CONDUCTOR-SERVICE"]]: ICONS.CONDUCTOR,
	[PAGE_TYPES["CONDUCTOR-AIR_COND"]]: ICONS.CONDUCTOR,
	[PAGE_TYPES["CONDUCTOR-LOCATION_CORRECTION"]]: ICONS.CONDUCTOR,
	[PAGE_TYPES["CONDUCTOR-CAR_STATE"]]: ICONS.CONDUCTOR,
	[PAGE_TYPES["CONDUCTOR-315"]]: ICONS.CONDUCTOR,

	// Work Setting pages
	[PAGE_TYPES["WORK_SETTING-TOP"]]: ICONS.WORK_SETTING_1,
	[PAGE_TYPES["WORK_SETTING-TYPE"]]: ICONS.WORK_SETTING_1,
	[PAGE_TYPES["WORK_SETTING-SEAT"]]: ICONS.WORK_SETTING_1,

	// Driver pages
	[PAGE_TYPES["DRIVER-INFO"]]: ICONS.DRIVER,
	[PAGE_TYPES["DRIVER-REDUCE_SPEED"]]: ICONS.DRIVER,
	[PAGE_TYPES["DRIVER-ROOM_LIGHT"]]: ICONS.DRIVER,
	[PAGE_TYPES["DRIVER-LOCATION_CORRECTION"]]: ICONS.DRIVER,
};

const PAGE_NAME_MAP: Record<PageType, string> = {
	// Menu pages
	[PAGE_TYPES.MENU]: "メニュー",
	[PAGE_TYPES.OCCUPANCY_RATE]: "乗車率",
	[PAGE_TYPES.CAR_DETECTION]: "車両検知",
	[PAGE_TYPES.SET_LOCATION]: "位置設定",
	[PAGE_TYPES.TABLE_OF_CONTENTS]: "目次",
	// Other Series pages
	[PAGE_TYPES.OTHER_SERIES_DRIVER_INFO]: "他シリーズ運転情報",
	[PAGE_TYPES.OTHER_SERIES_SUB_SETTING]: "他シリーズサブ設定",
	[PAGE_TYPES.OTHER_SERIES_ANNOUNCE_1]: "他シリーズ案内1",
	[PAGE_TYPES.OTHER_SERIES_ANNOUNCE_2]: "他シリーズ案内2",
	[PAGE_TYPES.OTHER_SERIES_BROKEN]: "他シリーズ故障",
	[PAGE_TYPES.OTHER_SERIES_WORK_SETTING]: "他シリーズ作業設定",
	[PAGE_TYPES.OTHER_SERIES_WORK_SETTING_MENU]: "他シリーズ作業設定メニュー",
	[PAGE_TYPES.OTHER_SERIES_REDUCE_SPEED]: "他シリーズ速度低減",

	// Maintenance pages
	[PAGE_TYPES["MAINTENANCE-MENU"]]: "検修メニュー",
	[PAGE_TYPES["MAINTENANCE-CTRL_TEST"]]: "検修制御試験",
	[PAGE_TYPES["MAINTENANCE-COMM_STATE"]]: "検修通信状態",
	[PAGE_TYPES["MAINTENANCE-SPEC_RECORD"]]: "検修仕様記録",
	[PAGE_TYPES["MAINTENANCE-BROKEN_LIST"]]: "検修故障一覧",
	[PAGE_TYPES["MAINTENANCE-TEST_RUN"]]: "検修試運転",
	[PAGE_TYPES["MAINTENANCE-DI_DO"]]: "検修DI/DO",
	[PAGE_TYPES["MAINTENANCE-AIR_COND_STATE"]]: "検修空調状態",
	[PAGE_TYPES["MAINTENANCE-DISPLAY_TEST"]]: "検修表示試験",

	// Setting pages
	[PAGE_TYPES["SETTING-ENTRANCE"]]: "設定入口",
	[PAGE_TYPES["SETTING-MENU"]]: "設定メニュー",
	[PAGE_TYPES["SETTING-MONITOR"]]: "設定モニター",

	// Correction pages
	[PAGE_TYPES["CORRECTION-MENU"]]: "補正メニュー",
	[PAGE_TYPES["CORRECTION-TIME"]]: "補正時間",
	// Car State pages
	[PAGE_TYPES["CAR_STATE-SWITCHES"]]: "SW情報",
	[PAGE_TYPES["CAR_STATE-POWER"]]: "力行情報",
	[PAGE_TYPES["CAR_STATE-BRAKE"]]: "ブレーキ情報",
	[PAGE_TYPES["CAR_STATE-THREE_PHASE_AC"]]: "三相交流",
	[PAGE_TYPES["CAR_STATE-POWER_BRAKE"]]: "力行/制動",

	// Conductor pages
	[PAGE_TYPES["CONDUCTOR-INFO"]]: "車掌",
	[PAGE_TYPES["CONDUCTOR-SERVICE"]]: "サービス",
	[PAGE_TYPES["CONDUCTOR-AIR_COND"]]: "空調制御",
	[PAGE_TYPES["CONDUCTOR-LOCATION_CORRECTION"]]: "位置補正",
	[PAGE_TYPES["CONDUCTOR-CAR_STATE"]]: "車両状態",
	[PAGE_TYPES["CONDUCTOR-315"]]: "315系",
	// Work Setting pages
	[PAGE_TYPES["WORK_SETTING-TOP"]]: "運行設定",
	[PAGE_TYPES["WORK_SETTING-TYPE"]]: "種別設定",
	[PAGE_TYPES["WORK_SETTING-SEAT"]]: "座席設定",

	// Driver pages
	[PAGE_TYPES["DRIVER-INFO"]]: "運転士",
	[PAGE_TYPES["DRIVER-REDUCE_SPEED"]]: "徐行情報",
	[PAGE_TYPES["DRIVER-ROOM_LIGHT"]]: "室内灯",
	[PAGE_TYPES["DRIVER-LOCATION_CORRECTION"]]: "位置補正",
};
