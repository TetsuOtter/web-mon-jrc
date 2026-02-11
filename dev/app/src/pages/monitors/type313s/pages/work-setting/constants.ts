import { PAGE_MODES } from "../pageTypes";

import type { useWorkSettingPageMode } from "../../hooks/usePageMode";

export const PAGE_NAME_MAP = {
	[PAGE_MODES.WORK_SETTING]: "運行設定",
	[PAGE_MODES.DRIVER]: "運転士運行設定",
	[PAGE_MODES.CONDUCTOR]: "車掌運行設定",
} as const satisfies Record<ReturnType<typeof useWorkSettingPageMode>, string>;
