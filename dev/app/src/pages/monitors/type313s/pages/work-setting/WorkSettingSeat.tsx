import { memo } from "react";

import { CanvasText } from "@web-mon-jrc/canvas-renderer";
import FooterPageFrame from "../../components/FooterPageFrame";
import { COLORS } from "../../constants";
import { useWorkSettingPageMode } from "../../hooks/usePageMode";

import { FOOTER_MENU_FOR_CONDUCTOR } from "./constants";

export default memo(function WorkSettingSeat() {
	const mode = useWorkSettingPageMode();
	return (
		<FooterPageFrame
			mode={mode}
			footerItems={FOOTER_MENU_FOR_CONDUCTOR}>
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
