// TODO: 号車認識処理ページの実装が必要
import { memo } from "react";

import { CanvasText } from "@web-mon-jrc/canvas-renderer";
import { COLORS } from "../../constants";

export default memo(function CarDetection() {
	return (
		<CanvasText
			relX={0}
			relY={0}
			verticalAlign="center"
			align="center"
			text="準備中"
			fillColor={COLORS.WHITE}
		/>
	);
});
