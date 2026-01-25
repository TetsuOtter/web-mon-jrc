import { PAGE_TYPES } from "../pageTypes";

import type { FooterButtonInfo } from "../../footer/FooterArea";

export const FOOTER_MENU = [
	{
		label: "起動制動",
		navigateTo: PAGE_TYPES.POWER_BRAKE,
	},
	{
		label: "三相給電",
		navigateTo: PAGE_TYPES.THREE_PHASE_AC,
	},
	{
		label: "制動確認",
		navigateTo: PAGE_TYPES.BRAKE,
	},
	{
		label: "起動確認",
		navigateTo: PAGE_TYPES.POWER,
	},
	{
		label: "ｽｲｯﾁ状態",
		navigateTo: PAGE_TYPES.SWITCHES,
	},
	{
		label: "戻る",
		navigateTo: PAGE_TYPES.MENU,
	},
] as const satisfies FooterButtonInfo[];
