import { PAGE_TYPES } from "../pageTypes";

import type { FooterButtonInfo } from "../../footer/FooterArea";

export const FOOTER_MENU = [
	{
		label: "徐行情報",
		navigateTo: PAGE_TYPES.OTHER_SERIES_REDUCE_SPEED,
		queryParams: { mode: "OTHER_SERIES" },
	},
	{
		label: "形式変更",
		navigateTo: PAGE_TYPES.OTHER_SERIES_ANNOUNCE,
		queryParams: { mode: "OTHER_SERIES" },
	},
	{
		label: "地点補正",
		navigateTo: PAGE_TYPES.OTHER_SERIES_ANNOUNCE,
		queryParams: { mode: "OTHER_SERIES" },
	},
	{
		label: "列番設定",
		navigateTo: PAGE_TYPES.OTHER_SERIES_ANNOUNCE,
		queryParams: { mode: "OTHER_SERIES" },
	},
	{
		label: "行先設定",
		navigateTo: PAGE_TYPES.OTHER_SERIES_ANNOUNCE,
		queryParams: { mode: "OTHER_SERIES" },
	},
	{
		label: "放送空調",
		navigateTo: PAGE_TYPES.OTHER_SERIES_ANNOUNCE,
		queryParams: { mode: "OTHER_SERIES" },
	},
	{
		label: "故障状態",
		navigateTo: PAGE_TYPES.OTHER_SERIES_DRIVER_INFO,
		queryParams: { mode: "OTHER_SERIES" },
	},
] as const satisfies FooterButtonInfo[];

export const FOOTER_MENU_CONDUCTOR = [
	{
		label: "形式変更",
		navigateTo: PAGE_TYPES.OTHER_SERIES_ANNOUNCE,
		queryParams: { mode: "OTHER_SERIES" },
	},
	{
		label: "地点補正",
		navigateTo: PAGE_TYPES.OTHER_SERIES_ANNOUNCE,
		queryParams: { mode: "OTHER_SERIES" },
	},
	{
		label: "副設定",
		navigateTo: PAGE_TYPES.OTHER_SERIES_SUB_SETTING,
		queryParams: { mode: "OTHER_SERIES" },
	},
	{
		label: "列番設定",
		navigateTo: PAGE_TYPES.OTHER_SERIES_ANNOUNCE,
		queryParams: { mode: "OTHER_SERIES" },
	},
	{
		label: "行先手動",
		navigateTo: PAGE_TYPES.OTHER_SERIES_ANNOUNCE,
		queryParams: { mode: "OTHER_SERIES" },
	},
	{
		label: "放送空調",
		navigateTo: PAGE_TYPES.OTHER_SERIES_ANNOUNCE,
		queryParams: { mode: "OTHER_SERIES" },
	},
	{
		label: "故障状態",
		navigateTo: PAGE_TYPES.OTHER_SERIES_DRIVER_INFO,
		queryParams: { mode: "OTHER_SERIES" },
	},
] as const satisfies FooterButtonInfo[];

export const FOOTER_MENU_CONDUCTOR_SUB = [
	{
		label: "副設定",
		navigateTo: PAGE_TYPES.OTHER_SERIES_SUB_SETTING,
		queryParams: { mode: "OTHER_SERIES" },
	},
	{
		label: "列番設定",
		navigateTo: PAGE_TYPES.OTHER_SERIES_ANNOUNCE,
		queryParams: { mode: "OTHER_SERIES" },
	},
	{
		label: "行先手動",
		isSelected: true,
		handleClick: () => {},
	},
	{
		label: "放送空調",
		navigateTo: PAGE_TYPES.OTHER_SERIES_ANNOUNCE,
		queryParams: { mode: "OTHER_SERIES" },
	},
	{
		label: "故障状態",
		navigateTo: PAGE_TYPES.OTHER_SERIES_DRIVER_INFO,
		queryParams: { mode: "OTHER_SERIES" },
	},
] as const satisfies FooterButtonInfo[];
