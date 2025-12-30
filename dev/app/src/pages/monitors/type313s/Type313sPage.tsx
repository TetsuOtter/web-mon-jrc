import { memo } from "react";

import { CanvasText } from "../../../canvas-renderer";
import MonitorCanvas from "../../../components/MonitorCanvas";

import { DISPLAY_HEIGHT, DISPLAY_WIDTH } from "./constants";
import HeaderArea from "./header/HeaderArea";
import { ICONS } from "./icons";

export default memo(function Type313sPage() {
	return (
		<MonitorCanvas
			width={DISPLAY_WIDTH}
			height={DISPLAY_HEIGHT}>
			<HeaderArea
				icon={ICONS.MENU}
				pageName="メニュー"
				trainNumber="1234"
				trainType="普通"
				trainDestination="大垣"
				timeMinutes={5}
			/>
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
