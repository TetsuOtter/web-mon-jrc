import { memo } from "react";

import { CanvasText } from "../../../../../canvas-renderer";
import FooterPageFrame from "../../components/FooterPageFrame";
import { COLORS } from "../../constants";
import { useMaintenancePageMode } from "../../hooks/usePageMode";

import { FOOTER_MENU_TEST_RUN } from "./constants";

export default memo(function MaintenanceTestRun() {
	const mode = useMaintenancePageMode();
	return (
		<FooterPageFrame
			mode={mode}
			footerItems={FOOTER_MENU_TEST_RUN}>
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
