import { PAGE_TYPES } from "../pageTypes";

import type { FooterButtonInfo } from "../../footer/FooterArea";

export const FOOTER_MENU = [
	{
		label: "メニュー",
		navigateTo: PAGE_TYPES.MENU,
		queryParams: { mode: "MENU" },
	},
] as const satisfies FooterButtonInfo[];
