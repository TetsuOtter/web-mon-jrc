import { memo } from "react";

import { CanvasText } from "../../../canvas-renderer";
import MonitorCanvas from "../../../components/MonitorCanvas";

export default memo(function Type313vPage() {
	return (
		<MonitorCanvas
			width={640}
			height={480}>
			<CanvasText
				relX={0}
				relY={240 - 16}
				align="center"
				text="準備中"
				fillColor="#fff"
				scaleX={2}
				scaleY={2}
			/>
		</MonitorCanvas>
	);
});
