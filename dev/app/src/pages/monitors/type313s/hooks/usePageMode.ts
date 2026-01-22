import { useSelector } from "react-redux";

import type { RootState } from "../../../../store/store";

const pageModeSelector = (state: RootState) =>
	state.monitors.type313s.currentMode;
export function usePageMode() {
	return useSelector(pageModeSelector);
}
