import { memo } from "react";

import { CanvasText } from "../../../../../canvas-renderer";
import FooterPageFrame from "../../components/FooterPageFrame";
import { COLORS } from "../../constants";
import { useMaintenancePageMode } from "../../hooks/usePageMode";
import { PAGE_TYPES } from "../pageTypes";

import { getMenuListForMaintenanceMode } from "./constants";

export default memo(function MaintenanceSpecRecord() {
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

const FOOTER_MENU = getMenuListForMaintenanceMode(
	"性能記録",
	PAGE_TYPES.MAINTENANCE_SPEC_RECORD
);
