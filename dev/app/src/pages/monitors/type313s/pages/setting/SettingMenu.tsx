// TODO: 設定メニューページの実装が必要
import { memo } from "react";

import { CanvasText } from "@web-mon-jrc/canvas-renderer";
import FooterPageFrame from "../../components/FooterPageFrame";
import { COLORS } from "../../constants";
import { useMenuPageMode } from "../../hooks/usePageMode";

import { FOOTER_MENU } from "./constants";

export default memo(function SettingMenu() {
	const mode = useMenuPageMode();
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
