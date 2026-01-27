import { PAGE_TYPES } from "../pageTypes";

import type { FooterButtonInfo } from "../../footer/FooterArea";

export const FOOTER_MENU = [
	{
		label: "モニター設定",
		navigateTo: PAGE_TYPES.SETTING_MONITOR,
		queryParams: { mode: "MENU" },
	},
	{
		label: "戻る",
		useBackNavigation: true,
	},
] as const satisfies FooterButtonInfo[];
