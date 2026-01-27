import { memo } from "react";

import { CanvasText } from "../../../../../canvas-renderer";
import FooterPageFrame from "../../components/FooterPageFrame";
import { COLORS } from "../../constants";
import { useMaintenancePageMode } from "../../hooks/usePageMode";

import { FOOTER_MENU_BROKEN_RECORD } from "./constants";

export default memo(function MaintenanceBrokenList() {
	const mode = useMaintenancePageMode();
	return (
		<FooterPageFrame
			mode={mode}
			footerItems={FOOTER_MENU_BROKEN_RECORD}>
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
