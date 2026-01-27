import { memo } from "react";

import { CanvasText } from "../../../../../canvas-renderer";
import FooterPageFrame from "../../components/FooterPageFrame";
import { COLORS } from "../../constants";
import { useConductorPageMode } from "../../hooks/usePageMode";

import { FOOTER_MENU_AC_RIGHT, FOOTER_MENU_AC_LEFT } from "./constants";

export default memo(function ConductorAirCondMode() {
	const mode = useConductorPageMode();
	return (
		<FooterPageFrame
			mode={mode}
			footerItems={FOOTER_MENU_AC_RIGHT}
			leftFooterItems={FOOTER_MENU_AC_LEFT}>
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
