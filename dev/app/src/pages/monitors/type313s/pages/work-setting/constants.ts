import { PAGE_MODES, PAGE_TYPES } from "../pageTypes";

import type { FooterButtonInfo } from "../../footer/FooterArea";
import type { useWorkSettingPageMode } from "../../hooks/usePageMode";

export const PAGE_NAME_MAP = {
	[PAGE_MODES.WORK_SETTING]: "運行設定",
	[PAGE_MODES.DRIVER]: "運転士運行設定",
	[PAGE_MODES.CONDUCTOR]: "車掌運行設定",
} as const satisfies Record<ReturnType<typeof useWorkSettingPageMode>, string>;

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
