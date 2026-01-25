import { PAGE_TYPES } from "../pageTypes";

import type { FooterButtonInfo } from "../../footer/FooterArea";

export const FOOTER_MENU = [
	{
		label: "徐行情報",
		navigateTo: PAGE_TYPES.REDUCE_SPEED,
		queryParams: { mode: "DRIVER" },
	},
	{
		label: "地点補正",
		navigateTo: PAGE_TYPES.LOCATION_CORRECTION,
		queryParams: { mode: "DRIVER" },
	},
	{
		label: "運行設定",
		navigateTo: PAGE_TYPES.WORK_SETTING_TOP,
		queryParams: { mode: "DRIVER" },
	},
	{
		label: "車両状態",
		navigateTo: PAGE_TYPES.SWITCHES,
		queryParams: { mode: "DRIVER" },
	},
	{
		label: "運転情報",
		navigateTo: PAGE_TYPES.DRIVER_INFO,
		queryParams: { mode: "DRIVER" },
	},
	{
		label: "メニュー",
		navigateTo: PAGE_TYPES.MENU,
		queryParams: { mode: "MENU" },
	},
] as const satisfies FooterButtonInfo[];

export const REDUCE_SPEED_FOOTER_MENU = [
	{
		label: "徐行情報",
		navigateTo: PAGE_TYPES.REDUCE_SPEED,
		queryParams: { mode: "DRIVER" },
	},
	{
		label: "戻る",
		navigateTo: PAGE_TYPES.DRIVER_INFO,
		queryParams: { mode: "DRIVER" },
	},
] as const satisfies FooterButtonInfo[];
