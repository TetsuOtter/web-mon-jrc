import { memo } from "react";

import { CanvasText } from "../../../../../canvas-renderer";
import CanvasObjectGroup from "../../../../../canvas-renderer/objects/CanvasObjectGroup";
import Button, { SHADOW_WIDTH } from "../Button";
import { COLORS, FONT_SIZE_1X } from "../../constants";

const WIDTH = 104;
const HEIGHT = 28;
const DEFAULT_X = 686;
const DEFAULT_Y = 3;

const LABEL_WIDTH = FONT_SIZE_1X * 2;
const VALUE_WIDTH = WIDTH - LABEL_WIDTH;
const TEXT_TOP = Math.floor((HEIGHT - FONT_SIZE_1X) / 2);

type BrightnessControlButtonProps = {
	readonly relX?: number;
	readonly relY?: number;
	readonly brightnessLevel?: "明" | "中" | "暗";
	readonly onClick?: () => void;
};

export default memo<BrightnessControlButtonProps>(
	function BrightnessControlButton({
		relX = DEFAULT_X,
		relY = DEFAULT_Y,
		brightnessLevel = "明",
		onClick,
	}) {
		return (
			<Button
				relX={relX}
				relY={relY}
				width={WIDTH}
				height={HEIGHT}
				shadowWidth={SHADOW_WIDTH.SMALL}
				onClick={onClick}>
				<CanvasObjectGroup relX={0} relY={0} width={WIDTH} height={HEIGHT}>
					<CanvasText
						relX={4}
						relY={TEXT_TOP}
						text="輝度"
						fillColor={COLORS.WHITE}
					/>
					<CanvasText
						relX={LABEL_WIDTH}
						relY={TEXT_TOP}
						maxWidthPx={VALUE_WIDTH - 8}
						text={brightnessLevel}
						fillColor={COLORS.WHITE}
						align="right"
					/>
				</CanvasObjectGroup>
			</Button>
		);
	}
);
