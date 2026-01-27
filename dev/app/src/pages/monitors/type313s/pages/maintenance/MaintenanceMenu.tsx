import { memo } from "react";

import { CanvasText } from "../../../../../canvas-renderer";
import FooterPageFrame from "../../components/FooterPageFrame";
import { COLORS } from "../../constants";
import { useMaintenancePageMode } from "../../hooks/usePageMode";
import { PAGE_TYPES } from "../pageTypes";

import type { FooterButtonInfo } from "../../footer/FooterArea";

export default memo(function MaintenanceMenu() {
	const mode = useMaintenancePageMode();
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

export const FOOTER_MENU = [
	{
		label: "検修ﾒﾆｭｰ",
		navigateTo: PAGE_TYPES.MAINTENANCE_MENU,
		queryParams: { mode: "MAINTENANCE" },
	},
	{
		label: "メニュー",
		navigateTo: PAGE_TYPES.MENU,
		queryParams: { mode: "MENU" },
	},
] as const satisfies FooterButtonInfo[];
