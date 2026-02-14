import { PAGE_MODES, PAGE_TYPES } from "../pageTypes";

import type { FooterButtonInfo } from "../../footer/FooterArea";
import type { useWorkSettingPageMode } from "../../hooks/usePageMode";

export const PAGE_NAME_MAP = {
	[PAGE_MODES.WORK_SETTING]: "運行設定",
	[PAGE_MODES.DRIVER]: "運転士運行設定",
	[PAGE_MODES.CONDUCTOR]: "車掌運行設定",
} as const satisfies Record<ReturnType<typeof useWorkSettingPageMode>, string>;

export const FOOTER_MENU_FOR_CONDUCTOR = [
	{
		label: "号車",
		navigateTo: PAGE_TYPES.WORK_SETTING_SEAT,
	},
	{
		label: "行先設定",
		navigateTo: PAGE_TYPES.WORK_SETTING_TOP,
	},
	{
		label: "列番設定",
		navigateTo: PAGE_TYPES.WORK_SETTING_TRAIN_NUMBER,
	},
	{
		label: "メニュー",
		navigateTo: PAGE_TYPES.MENU,
		queryParams: { mode: PAGE_MODES.MENU },
	},
] as const satisfies FooterButtonInfo[];
