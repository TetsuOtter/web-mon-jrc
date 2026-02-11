import { memo } from "react";

import { CanvasText } from "../../../../../canvas-renderer";
import FooterPageFrame from "../../components/FooterPageFrame";
import { COLORS } from "../../constants";
import { useWorkSettingPageMode } from "../../hooks/usePageMode";
import { ICONS } from "../../icons";
import { PAGE_TYPES } from "../pageTypes";

import { PAGE_NAME_MAP } from "./constants";

import type { FooterButtonInfo } from "../../footer/FooterArea";

export default memo(function WorkSettingTrainNumber() {
	const mode = useWorkSettingPageMode();
	return (
		<FooterPageFrame
			mode={mode}
			pageIcon={ICONS.WORK_SETTING_1}
			pageName={PAGE_NAME_MAP[mode]}
			footerItems={FOOTER_MENU}>
			<CanvasText
				relX={0}
				relY={0}
				verticalAlign="center"
				align="center"
				text="準備中"
				fillColor={COLORS.WHITE}
			/>
		</FooterPageFrame>
	);
});

const FOOTER_MENU = [
	{
		label: "列番設定",
		navigateTo: PAGE_TYPES.WORK_SETTING_TRAIN_NUMBER,
	},
	{
		label: "戻る",
		navigateTo: PAGE_TYPES.WORK_SETTING_TOP,
	},
] as const satisfies FooterButtonInfo[];
