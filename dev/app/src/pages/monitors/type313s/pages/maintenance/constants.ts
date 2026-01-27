import { PAGE_TYPES } from "../pageTypes";

import type { FooterButtonInfo } from "../../footer/FooterArea";
import type { PageType } from "../pageTypes";

export const FOOTER_BUTTON_INFO_MAINTENANCE_MENU = {
	label: "検修ﾒﾆｭｰ",
	navigateTo: PAGE_TYPES.MAINTENANCE_MENU,
	queryParams: { mode: "MAINTENANCE" },
} as const satisfies FooterButtonInfo;

export const FOOTER_MENU = [
	{
		label: "伝送状態",
		navigateTo: PAGE_TYPES.MAINTENANCE_COMM_STATE,
		queryParams: { mode: "MAINTENANCE" },
	},
	{
		label: "仕様記録",
		navigateTo: PAGE_TYPES.MAINTENANCE_SPEC_RECORD,
		queryParams: { mode: "MAINTENANCE" },
	},
	{
		label: "故障一覧",
		navigateTo: PAGE_TYPES.MAINTENANCE_BROKEN_LIST,
		queryParams: { mode: "MAINTENANCE" },
	},
	{
		label: "試運転",
		navigateTo: PAGE_TYPES.MAINTENANCE_TEST_RUN,
		queryParams: { mode: "MAINTENANCE" },
	},
	{
		label: "DI/DO",
		navigateTo: PAGE_TYPES.MAINTENANCE_DI_DO,
		queryParams: { mode: "MAINTENANCE" },
	},
	{
		label: "空調状態",
		navigateTo: PAGE_TYPES.MAINTENANCE_AIR_COND_STATE,
		queryParams: { mode: "MAINTENANCE" },
	},
	{
		label: "表示試験",
		navigateTo: PAGE_TYPES.MAINTENANCE_DISPLAY_TEST,
		queryParams: { mode: "MAINTENANCE" },
	},
	{
		label: "戻る",
		useBackNavigation: true,
	},
] as const satisfies FooterButtonInfo[];

export const FOOTER_MENU_TEST = [
	{
		label: "制御装置",
		navigateTo: PAGE_TYPES.MAINTENANCE_CTRL_TEST,
		queryParams: { mode: "MAINTENANCE" },
	},
	{
		label: "表示器",
		navigateTo: PAGE_TYPES.MAINTENANCE_DISPLAY_TEST,
		queryParams: { mode: "MAINTENANCE" },
	},
	FOOTER_BUTTON_INFO_MAINTENANCE_MENU,
] as const satisfies FooterButtonInfo[];

export const FOOTER_MENU_BROKEN_RECORD = [
	{
		label: "故障記録",
		navigateTo: PAGE_TYPES.MAINTENANCE_BROKEN_LIST,
		queryParams: { mode: "MAINTENANCE" },
	},
	{
		label: "性能記録",
		navigateTo: PAGE_TYPES.MAINTENANCE_SPEC_RECORD,
		queryParams: { mode: "MAINTENANCE" },
	},
	FOOTER_BUTTON_INFO_MAINTENANCE_MENU,
] as const satisfies FooterButtonInfo[];

export const FOOTER_MENU_TEST_RUN = [
	{
		label: "ＭＭ電流",
		navigateTo: PAGE_TYPES.MAINTENANCE_TEST_RUN,
		queryParams: { mode: "MAINTENANCE" },
	},
	{
		label: "加速度",
		navigateTo: PAGE_TYPES.MAINTENANCE_TEST_RUN,
		queryParams: { mode: "MAINTENANCE" },
	},
	{
		label: "減速度",
		navigateTo: PAGE_TYPES.MAINTENANCE_TEST_RUN,
		queryParams: { mode: "MAINTENANCE" },
	},
	FOOTER_BUTTON_INFO_MAINTENANCE_MENU,
] as const satisfies FooterButtonInfo[];

export const FOOTER_MENU_DIDO = [
	{
		label: "状態出力",
		navigateTo: PAGE_TYPES.MAINTENANCE_DI_DO,
		queryParams: { mode: "MAINTENANCE" },
	},
	{
		label: "運転出力",
		navigateTo: PAGE_TYPES.MAINTENANCE_DI_DO,
		queryParams: { mode: "MAINTENANCE" },
	},
	{
		label: "状態入力",
		navigateTo: PAGE_TYPES.MAINTENANCE_DI_DO,
		queryParams: { mode: "MAINTENANCE" },
	},
	{
		label: "運転入力",
		navigateTo: PAGE_TYPES.MAINTENANCE_DI_DO,
		queryParams: { mode: "MAINTENANCE" },
	},
	FOOTER_BUTTON_INFO_MAINTENANCE_MENU,
] as const satisfies FooterButtonInfo[];

export const FOOTER_MENU_AIR_COND = [
	{
		label: "ﾛｰﾙﾌｨﾙﾀ",
		navigateTo: PAGE_TYPES.MAINTENANCE_AIR_COND_STATE,
		queryParams: { mode: "MAINTENANCE" },
	},
	{
		label: "内蔵ﾋｰﾀ",
		navigateTo: PAGE_TYPES.MAINTENANCE_AIR_COND_STATE,
		queryParams: { mode: "MAINTENANCE" },
	},
	{
		label: "空調状態",
		navigateTo: PAGE_TYPES.MAINTENANCE_AIR_COND_STATE,
		queryParams: { mode: "MAINTENANCE" },
	},
	FOOTER_BUTTON_INFO_MAINTENANCE_MENU,
] as const satisfies FooterButtonInfo[];

export function getMenuListForMaintenanceMode(
	label: string,
	navigateTo: PageType
): FooterButtonInfo[] {
	return [
		{
			label,
			navigateTo,
			queryParams: { mode: "MAINTENANCE" },
		},
		FOOTER_BUTTON_INFO_MAINTENANCE_MENU,
	] as const satisfies FooterButtonInfo[];
}
