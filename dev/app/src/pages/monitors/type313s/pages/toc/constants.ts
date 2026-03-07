import { PAGE_MODES, PAGE_TYPES } from "../pageTypes";

import type { NavigationQueryParams } from "../usePageNavigation";
import type { PageInfo } from "./PageGroup";
import type { FooterButtonInfo } from "../../footer/FooterArea";

export const FOOTER_MENU = [
	{
		label: "目次",
		navigateTo: PAGE_TYPES.TABLE_OF_CONTENTS,
		queryParams: { mode: "TABLE_OF_CONTENTS" },
	},
	{
		label: "メニュー",
		navigateTo: PAGE_TYPES.MENU,
		queryParams: { mode: "MENU" },
	},
] as const satisfies FooterButtonInfo[];

export type PageGroupInfo = {
	title: string;
	infoList: PageInfo[];
};

const DRIVER_NAV_PARAMS = {
	mode: PAGE_MODES.DRIVER,
} as const satisfies NavigationQueryParams;
export const DRIVER_PAGE_GROUP: PageGroupInfo = {
	title: "運転士",
	infoList: [
		{
			title: "運転情報",
			pageType: PAGE_TYPES.DRIVER_INFO,
			params: DRIVER_NAV_PARAMS,
		},
		{
			title: "車両状態",
			pageType: PAGE_TYPES.SWITCHES,
			params: DRIVER_NAV_PARAMS,
		},
		{
			title: "運転士運行設定",
			pageType: PAGE_TYPES.WORK_SETTING_TRAIN_NUMBER,
			params: DRIVER_NAV_PARAMS,
		},
		{
			title: "地点補正",
			pageType: PAGE_TYPES.LOCATION_CORRECTION,
			params: DRIVER_NAV_PARAMS,
		},
		{
			title: "徐行情報",
			pageType: PAGE_TYPES.REDUCE_SPEED,
			params: DRIVER_NAV_PARAMS,
		},
	],
};

const WORK_SETTING_NAV_PARAMS = {
	mode: PAGE_MODES.WORK_SETTING,
} as const satisfies NavigationQueryParams;
export const WORK_SETTING_PAGE_GROUP: PageGroupInfo = {
	title: "運行設定",
	infoList: [
		{
			title: "行先設定",
			pageType: PAGE_TYPES.WORK_SETTING_TOP,
			params: WORK_SETTING_NAV_PARAMS,
		},
		{
			title: "列番設定",
			pageType: PAGE_TYPES.WORK_SETTING_TRAIN_NUMBER,
			params: WORK_SETTING_NAV_PARAMS,
		},
	],
};

const CONDUCTOR_NAV_PARAMS = {
	mode: PAGE_MODES.CONDUCTOR,
} as const satisfies NavigationQueryParams;
export const CONDUCTOR_PAGE_GROUP: PageGroupInfo = {
	title: "車掌",
	infoList: [
		{
			title: "車掌情報",
			pageType: PAGE_TYPES.CONDUCTOR_INFO,
			params: CONDUCTOR_NAV_PARAMS,
		},
		{
			title: "サービス",
			pageType: PAGE_TYPES.CONDUCTOR_SERVICE,
			params: CONDUCTOR_NAV_PARAMS,
		},
		{
			title: "空調制御",
			pageType: PAGE_TYPES.CONDUCTOR_AIR_COND_MODE,
			params: CONDUCTOR_NAV_PARAMS,
		},
		{
			title: "地点補正",
			pageType: PAGE_TYPES.LOCATION_CORRECTION,
			params: CONDUCTOR_NAV_PARAMS,
		},
		{
			title: "車両状態",
			pageType: PAGE_TYPES.SWITCHES,
			params: CONDUCTOR_NAV_PARAMS,
		},
		{
			title: "車掌運行設定",
			pageType: PAGE_TYPES.WORK_SETTING_TRAIN_NUMBER,
			params: CONDUCTOR_NAV_PARAMS,
		},
	],
};

const CORRECTION_NAV_PARAMS = {
	mode: PAGE_MODES.CORRECTION,
} as const satisfies NavigationQueryParams;
export const CORRECTION_PAGE_GROUP: PageGroupInfo = {
	title: "補　正",
	infoList: [
		{
			title: "時刻設定",
			pageType: PAGE_TYPES.CORRECTION_TIME,
			params: CORRECTION_NAV_PARAMS,
		},
		// 乗車率体重はページ未実装
		// {
		// 	title: "乗車率体重",
		// 	pageType: PAGE_TYPES.,
		// 	params: CORRECTION_NAV_PARAMS,
		// },
	],
};

const CAR_STATE_NAV_PARAMS = {
	mode: PAGE_MODES.CAR_STATE,
} as const satisfies NavigationQueryParams;
export const CAR_STATE_PAGE_GROUP: PageGroupInfo = {
	title: "車両状態",
	infoList: [
		{
			title: "スイッチ状態",
			pageType: PAGE_TYPES.SWITCHES,
			params: CAR_STATE_NAV_PARAMS,
		},
		{
			title: "起動確認",
			pageType: PAGE_TYPES.POWER,
			params: CAR_STATE_NAV_PARAMS,
		},
		{
			title: "制動確認",
			pageType: PAGE_TYPES.BRAKE,
			params: CAR_STATE_NAV_PARAMS,
		},
		{
			title: "三相給電",
			pageType: PAGE_TYPES.THREE_PHASE_AC,
			params: CAR_STATE_NAV_PARAMS,
		},
		{
			title: "起動制動確認",
			pageType: PAGE_TYPES.POWER_BRAKE,
			params: CAR_STATE_NAV_PARAMS,
		},
	],
};

const OCCUPANCY_RATE_NAV_PARAMS = {
	mode: PAGE_MODES.OCCUPANCY_RATE,
} as const satisfies NavigationQueryParams;
export const OCCUPANCY_RATE_PAGE_GROUP: PageGroupInfo = {
	title: "乗車率",
	infoList: [
		{
			title: "乗車率",
			pageType: PAGE_TYPES.OCCUPANCY_RATE,
			params: OCCUPANCY_RATE_NAV_PARAMS,
		},
	],
};
