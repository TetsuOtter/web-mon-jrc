import { memo } from "react";

import { CanvasText } from "../../../../../canvas-renderer";
import FooterPageFrame from "../../components/FooterPageFrame";
import { COLORS } from "../../constants";
import { useMaintenancePageMode } from "../../hooks/usePageMode";

import { FOOTER_MENU_TEST } from "./constants";

export default memo(function MaintenanceCtrlTest() {
	const mode = useMaintenancePageMode();
	return (
		<FooterPageFrame
			mode={mode}
			footerItems={FOOTER_MENU_TEST}>
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
