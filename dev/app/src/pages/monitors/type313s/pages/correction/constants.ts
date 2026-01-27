import { PAGE_TYPES } from "../pageTypes";

import type { FooterButtonInfo } from "../../footer/FooterArea";

export const FOOTER_MENU = [
	{
		label: "時刻補正",
		navigateTo: PAGE_TYPES.CORRECTION_TIME,
		queryParams: { mode: "CORRECTION" },
	},
	{
		label: "戻る",
		useBackNavigation: true,
	},
] as const satisfies FooterButtonInfo[];
