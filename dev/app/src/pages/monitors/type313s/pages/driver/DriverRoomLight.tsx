import { memo } from "react";

import { CanvasText } from "../../../../../canvas-renderer";

export default memo(function DriverRoomLight() {
	return (
		<CanvasText
			relX={0}
			relY={0}
			verticalAlign="center"
			align="center"
			text="準備中"
		/>
	);
});
