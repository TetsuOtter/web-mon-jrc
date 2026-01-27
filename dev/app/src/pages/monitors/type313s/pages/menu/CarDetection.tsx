import { memo } from "react";

import { CanvasText } from "../../../../../canvas-renderer";
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
