import { memo } from "react";

import { CanvasText } from "../../../../../canvas-renderer";
import FooterPageFrame from "../../components/FooterPageFrame";
import { COLORS } from "../../constants";
import { PAGE_MODES, PAGE_TYPES } from "../pageTypes";

import type { FooterButtonInfo } from "../../footer/FooterArea";

export default memo(function OccupancyRate() {
	return (
		<FooterPageFrame
			mode={PAGE_MODES.OCCUPANCY_RATE}
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
		label: "乗車率",
		navigateTo: PAGE_TYPES.OCCUPANCY_RATE,
	},
	{
		label: "メニュー",
		navigateTo: PAGE_TYPES.MENU,
		queryParams: {
			mode: PAGE_MODES.MENU,
		},
	},
] as const satisfies FooterButtonInfo[];
