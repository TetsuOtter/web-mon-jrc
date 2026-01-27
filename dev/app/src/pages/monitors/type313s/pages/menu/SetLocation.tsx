import { memo } from "react";

import { CanvasText } from "../../../../../canvas-renderer";
import FooterPageFrame from "../../components/FooterPageFrame";
import { COLORS } from "../../constants";
import { PAGE_TYPES, PAGE_MODES } from "../pageTypes";

import type { FooterButtonInfo } from "../../footer/FooterArea";

export default memo(function SetLocation() {
	return (
		<FooterPageFrame
			mode={PAGE_MODES.MAINTENANCE}
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
		label: "地点登録",
		navigateTo: PAGE_TYPES.SET_LOCATION,
	},
	{
		label: "メニュー",
		navigateTo: PAGE_TYPES.MENU,
		queryParams: {
			mode: PAGE_MODES.MENU,
		},
	},
] as const satisfies FooterButtonInfo[];
