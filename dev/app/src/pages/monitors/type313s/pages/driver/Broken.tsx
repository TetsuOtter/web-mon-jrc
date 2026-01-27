import { memo } from "react";

import { CanvasText } from "../../../../../canvas-renderer";
import FooterPageFrame from "../../components/FooterPageFrame";
import { COLORS } from "../../constants";
import { useDriverPageMode } from "../../hooks/usePageMode";

import { FOOTER_MENU_WHEN_BROKEN } from "./constants";

export default memo(function Broken() {
	const mode = useDriverPageMode();
	return (
		<FooterPageFrame
			mode={mode}
			footerItems={FOOTER_MENU_WHEN_BROKEN}>
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
