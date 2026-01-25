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
		navigateTo: PAGE_TYPES.CONDUCTOR_AIR_COND,
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
