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
import { PAGE_MODES, PAGE_TYPES } from "../pages/pageTypes";

import { useCurrentPageType } from "./CurrentPageContext";

import type { FooterButtonInfo } from "../footer/FooterArea";
import type { IconData } from "../icons";
import type { PageMode, PageType } from "../pages/pageTypes";

type FooterPageFrameProps = {
	readonly mode: PageMode;
	readonly footerItems: FooterButtonInfo[];
};

export default memo<PropsWithChildren<FooterPageFrameProps>>(
	function FooterPageFrame({ mode, footerItems, children }) {
		const pageType = useCurrentPageType();
		const parentObjectContext = useCanvasObjectContext();
		return (
			<CanvasObjectGroup
				relX={0}
				relY={0}
				width={parentObjectContext.metadata.width}
				height={parentObjectContext.metadata.height}>
				<HeaderArea
					icon={ICON_MAP_BY_MODE[mode]}
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

const ICON_MAP_BY_MODE = {
	[PAGE_MODES.BROKEN]: ICONS.BROKEN,
	[PAGE_MODES.CAR_STATE]: ICONS.CAR_INFO_1,
	[PAGE_MODES.CONDUCTOR]: ICONS.CONDUCTOR,
	[PAGE_MODES.CORRECTION]: ICONS.CORRECTION,
	[PAGE_MODES.DRIVER]: ICONS.DRIVER,
	[PAGE_MODES.EMBEDDED_MANUAL]: ICONS.EMBEDDED_MANUAL,
	[PAGE_MODES.MAINTENANCE]: ICONS.MAINTENANCE,
	[PAGE_MODES.MENU]: ICONS.MENU,
	[PAGE_MODES.OCCUPANCY_RATE]: ICONS.OCCUPANCY_RATE,
	[PAGE_MODES.OTHER_SERIES]: ICONS.OTHER_SERIES,
	[PAGE_MODES.TABLE_OF_CONTENTS]: ICONS.TABLE_OF_CONTENTS_1,
	[PAGE_MODES.WORK_SETTING]: ICONS.WORK_SETTING_1,
} as const satisfies Record<PageMode, IconData>;

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
	[PAGE_TYPES.MAINTENANCE_MENU]: "検修メニュー",
	[PAGE_TYPES.MAINTENANCE_CTRL_TEST]: "検修制御試験",
	[PAGE_TYPES.MAINTENANCE_COMM_STATE]: "検修通信状態",
	[PAGE_TYPES.MAINTENANCE_SPEC_RECORD]: "検修仕様記録",
	[PAGE_TYPES.MAINTENANCE_BROKEN_LIST]: "検修故障一覧",
	[PAGE_TYPES.MAINTENANCE_TEST_RUN]: "検修試運転",
	[PAGE_TYPES.MAINTENANCE_DI_DO]: "検修DI/DO",
	[PAGE_TYPES.MAINTENANCE_AIR_COND_STATE]: "検修空調状態",
	[PAGE_TYPES.MAINTENANCE_DISPLAY_TEST]: "検修表示試験",

	// Setting pages
	[PAGE_TYPES.SETTING_ENTRANCE]: "設定入口",
	[PAGE_TYPES.SETTING_MENU]: "設定メニュー",
	[PAGE_TYPES.SETTING_MONITOR]: "設定モニター",

	// Correction pages
	[PAGE_TYPES.CORRECTION_MENU]: "補正メニュー",
	[PAGE_TYPES.CORRECTION_TIME]: "補正時間",
	// Car State pages
	[PAGE_TYPES.SWITCHES]: "SW情報",
	[PAGE_TYPES.POWER]: "力行情報",
	[PAGE_TYPES.BRAKE]: "ブレーキ情報",
	[PAGE_TYPES.THREE_PHASE_AC]: "三相交流",
	[PAGE_TYPES.POWER_BRAKE]: "力行/制動",

	// Conductor pages
	[PAGE_TYPES.CONDUCTOR_INFO]: "車掌",
	[PAGE_TYPES.CONDUCTOR_SERVICE]: "サービス",
	[PAGE_TYPES.CONDUCTOR_AIR_COND]: "空調制御",
	[PAGE_TYPES.CONDUCTOR_LOCATION_CORRECTION]: "位置補正",
	[PAGE_TYPES.CONDUCTOR_315]: "315系",
	// Work Setting pages
	[PAGE_TYPES.WORK_SETTING_TOP]: "運行設定",
	[PAGE_TYPES.WORK_SETTING_TYPE]: "種別設定",
	[PAGE_TYPES.WORK_SETTING_SEAT]: "座席設定",

	// Driver pages
	[PAGE_TYPES.DRIVER_INFO]: "運転士",
	[PAGE_TYPES.REDUCE_SPEED]: "徐行情報",
	[PAGE_TYPES.ROOM_LIGHT]: "室内灯",
	[PAGE_TYPES.LOCATION_CORRECTION]: "位置補正",
};
