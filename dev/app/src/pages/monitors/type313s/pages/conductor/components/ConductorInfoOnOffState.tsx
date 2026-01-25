import { memo } from "react";

import { CanvasRect, CanvasText } from "../../../../../../canvas-renderer";
import { COLORS } from "../../../constants";

const ON_COLOR = COLORS.YELLOW;
const OFF_COLOR = COLORS.RED;

const ON_TEXT_COLOR = COLORS.BLACK;
const OFF_TEXT_COLOR = COLORS.WHITE;

const HEIGHT = 36;
const WIDTH = 90;

type ConductorInfoOnOffStateProps = {
	relX: number;
	relY: number;
	isOn: boolean;
};
export default memo<ConductorInfoOnOffStateProps>(
	function ConductorInfoOnOffState({ relX, relY, isOn }) {
		return (
			<CanvasRect
				relX={relX}
				relY={relY}
				width={WIDTH}
				height={HEIGHT}
				fillColor={isOn ? ON_COLOR : OFF_COLOR}>
				<CanvasText
					relX={0}
					relY={0}
					text={isOn ? "入" : "切"}
					align="center"
					verticalAlign="center"
					fillColor={isOn ? ON_TEXT_COLOR : OFF_TEXT_COLOR}
					scaleX={2}
					scaleY={2}
				/>
			</CanvasRect>
		);
	}
);
