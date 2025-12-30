import { memo } from "react";

import { CanvasText } from "../../../canvas-renderer";
import MonitorCanvas from "../../../components/MonitorCanvas";

export default memo(function Type313sPage() {
	return (
		<MonitorCanvas
			width={800}
			height={600}>
			<CanvasText
				relX={0}
				relY={300 - 16}
				align="center"
				text="準備中"
				fillColor="#fff"
				scaleX={2}
				scaleY={2}
			/>
		</MonitorCanvas>
	);
});
