import { memo } from "react";

import { CanvasText } from "../../../../../canvas-renderer";
import FooterPageFrame from "../../components/FooterPageFrame";
import { COLORS } from "../../constants";
import { useCorrectionPageMode } from "../../hooks/usePageMode";
import { PAGE_TYPES } from "../pageTypes";

import type { FooterButtonInfo } from "../../footer/FooterArea";

export default memo(function CorrectionTime() {
	const mode = useCorrectionPageMode();
	return (
		<FooterPageFrame
			mode={mode}
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
		label: "時刻補正",
		navigateTo: PAGE_TYPES.CORRECTION_TIME,
		queryParams: { mode: "CORRECTION" },
	},
	{
		label: "補正ﾒﾆｭｰ",
		navigateTo: PAGE_TYPES.CORRECTION_MENU,
		queryParams: { mode: "CORRECTION" },
	},
] as const satisfies FooterButtonInfo[];
