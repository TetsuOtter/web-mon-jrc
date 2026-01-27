import { PAGE_TYPES } from "../pageTypes";

import type { FooterButtonInfo } from "../../footer/FooterArea";

export const FOOTER_MENU = [
	{
		label: "運行設定",
		navigateTo: PAGE_TYPES.WORK_SETTING_TOP,
		queryParams: { mode: "CONDUCTOR" },
	},
	{
		label: "車両状態",
		navigateTo: PAGE_TYPES.SWITCHES,
		queryParams: { mode: "CONDUCTOR" },
	},
	{
		label: "地点補正",
		navigateTo: PAGE_TYPES.LOCATION_CORRECTION,
		queryParams: { mode: "CONDUCTOR" },
	},
	{
		label: "空調制御",
		navigateTo: PAGE_TYPES.CONDUCTOR_AIR_COND_MODE,
		queryParams: { mode: "CONDUCTOR" },
	},
	{
		label: "サービス",
		navigateTo: PAGE_TYPES.CONDUCTOR_SERVICE,
		queryParams: { mode: "CONDUCTOR" },
	},
	{
		label: "車掌情報",
		navigateTo: PAGE_TYPES.CONDUCTOR_INFO,
		queryParams: { mode: "CONDUCTOR" },
	},
	{
		label: "メニュー",
		navigateTo: PAGE_TYPES.MENU,
		queryParams: { mode: "MENU" },
	},
] as const satisfies FooterButtonInfo[];

export const FOOTER_MENU_AC_LEFT = [
	{
		label: "空調制御",
		navigateTo: PAGE_TYPES.CONDUCTOR_AIR_COND_MODE,
		queryParams: { mode: "CONDUCTOR" },
	},
] as const satisfies FooterButtonInfo[];
export const FOOTER_MENU_AC_RIGHT = [
	{
		label: "換気",
		navigateTo: PAGE_TYPES.CONDUCTOR_AIR_COND_VENT,
		queryParams: { mode: "CONDUCTOR" },
	},
	{
		label: "副設定",
		navigateTo: PAGE_TYPES.CONDUCTOR_AIR_COND_SUB,
		queryParams: { mode: "CONDUCTOR" },
	},
	{
		label: "横流ﾌｧﾝ",
		navigateTo: PAGE_TYPES.CONDUCTOR_AIR_COND_FAN,
		queryParams: { mode: "CONDUCTOR" },
	},
	{
		label: "空調制御",
		isSelected: true,
		handleClick: () => {},
	},
	{
		label: "サービス",
		navigateTo: PAGE_TYPES.CONDUCTOR_SERVICE,
		queryParams: { mode: "CONDUCTOR" },
	},
	{
		label: "車掌情報",
		navigateTo: PAGE_TYPES.CONDUCTOR_INFO,
		queryParams: { mode: "CONDUCTOR" },
	},
	{
		label: "メニュー",
		navigateTo: PAGE_TYPES.MENU,
		queryParams: { mode: "MENU" },
	},
] as const satisfies FooterButtonInfo[];
