import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { PAGE_MODES, type PageMode } from "../pages/pageTypes";

export function usePageMode<
	TDefault extends PageMode,
	TAvailable extends PageMode,
>(
	defaultMode: TDefault,
	availableModeList?: readonly (TDefault | TAvailable)[]
): TDefault | TAvailable {
	const [searchParams] = useSearchParams();
	return useMemo(() => {
		const modeParam = searchParams.get("mode") as TDefault;
		if (modeParam && availableModeList?.includes(modeParam)) {
			return modeParam;
		} else {
			return defaultMode;
		}
	}, [availableModeList, defaultMode, searchParams]);
}

const CAR_STATE_AVAILABLE_MODES: readonly PageMode[] = [
	PAGE_MODES.CAR_STATE,
	PAGE_MODES.DRIVER,
	PAGE_MODES.CONDUCTOR,
];
const CORRECTION_AVAILABLE_MODES: readonly PageMode[] = [
	PAGE_MODES.CORRECTION,
	PAGE_MODES.DRIVER,
	PAGE_MODES.CONDUCTOR,
];
const WORK_SETTING_AVAILABLE_MODES = [
	PAGE_MODES.WORK_SETTING,
	PAGE_MODES.DRIVER,
	PAGE_MODES.CONDUCTOR,
] as const;
export const useCarStatePageMode = () =>
	usePageMode(PAGE_MODES.CAR_STATE, CAR_STATE_AVAILABLE_MODES);
export const useDriverPageMode = () => usePageMode(PAGE_MODES.DRIVER);
export const useConductorPageMode = () => usePageMode(PAGE_MODES.CONDUCTOR);
export const useCorrectionPageMode = () =>
	usePageMode(PAGE_MODES.CORRECTION, CORRECTION_AVAILABLE_MODES);
export const useMaintenancePageMode = () => usePageMode(PAGE_MODES.MAINTENANCE);
export const useMenuPageMode = () => usePageMode(PAGE_MODES.MENU);
export const useOtherSeriesPageMode = () =>
	usePageMode(PAGE_MODES.OTHER_SERIES);
export const useWorkSettingPageMode = () =>
	usePageMode(PAGE_MODES.WORK_SETTING, WORK_SETTING_AVAILABLE_MODES);
export const useTableOfContentsPageMode = () =>
	usePageMode(PAGE_MODES.TABLE_OF_CONTENTS);
