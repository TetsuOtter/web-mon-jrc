import { memo } from "react";

import { CanvasText } from "../../../../../canvas-renderer";
import FooterPageFrame from "../../components/FooterPageFrame";
import { COLORS } from "../../constants";
import { useDriverPageMode } from "../../hooks/usePageMode";
import { PAGE_TYPES } from "../pageTypes";

import type { FooterButtonInfo } from "../../footer/FooterArea";

export default memo(function DriverRoomLight() {
	const mode = useDriverPageMode();
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
		label: "室内灯",
		navigateTo: PAGE_TYPES.ROOM_LIGHT,
	},
	{
		label: "戻る",
		useBackNavigation: true,
	},
] as const satisfies FooterButtonInfo[];
