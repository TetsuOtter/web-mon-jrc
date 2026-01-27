import { PAGE_TYPES } from "../pageTypes";

import type { FooterButtonInfo } from "../../footer/FooterArea";

export const FOOTER_MENU = [
	{
		label: "運行タイプ",
		navigateTo: PAGE_TYPES.WORK_SETTING_TYPE,
		queryParams: { mode: "WORK_SETTING" },
	},
	{
		label: "運転席",
		navigateTo: PAGE_TYPES.WORK_SETTING_SEAT,
		queryParams: { mode: "WORK_SETTING" },
	},
	{
		label: "戻る",
		useBackNavigation: true,
	},
] as const satisfies FooterButtonInfo[];
