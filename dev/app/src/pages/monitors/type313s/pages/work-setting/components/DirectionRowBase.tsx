import { memo } from "react";

import { CanvasText } from "@web-mon-jrc/canvas-renderer";
import CanvasObjectGroup from "@web-mon-jrc/canvas-renderer/objects/CanvasObjectGroup";
import Button, { SHADOW_WIDTH } from "../../../components/Button";
import { COLORS, RGB_COLORS } from "../../../constants";

const BUTTON_WIDTH = 100;
const BUTTON_HEIGHT = 52;
const TYPE_DIRECTION_DISPLAY_WIDTH = 240;
const BUTTON_DISPLAY_PADDING = 8;
const DIRECTION_BUTTON_LEFT = 16;
const DIRECTION_DISPLAY_LEFT =
	DIRECTION_BUTTON_LEFT + BUTTON_WIDTH + BUTTON_DISPLAY_PADDING;

type DirectionRowProps = {
	readonly relY: number;
	readonly buttonText: string;
	readonly displayText: string;
	readonly onButtonClick: () => void;
};

export default memo<DirectionRowProps>(function DirectionRowBase({
	relY,
	buttonText,
	displayText,
	onButtonClick,
}) {
	return (
		<CanvasObjectGroup
			relX={DIRECTION_BUTTON_LEFT}
			relY={relY}
			width={
				BUTTON_WIDTH + BUTTON_DISPLAY_PADDING + TYPE_DIRECTION_DISPLAY_WIDTH
			}
			height={BUTTON_HEIGHT}>
			{/* Direction Button */}
			<Button
				relX={0}
				relY={0}
				width={BUTTON_WIDTH}
				height={BUTTON_HEIGHT}
				shadowWidth={SHADOW_WIDTH.SMALL}
				onClick={onButtonClick}>
				<CanvasText
					relX={0}
					relY={0}
					align="center"
					verticalAlign="center"
					text={buttonText}
					fillColor={COLORS.WHITE}
					scaleY={2}
				/>
			</Button>

			{/* Direction Display Area */}
			<Button
				relX={DIRECTION_DISPLAY_LEFT - DIRECTION_BUTTON_LEFT}
				relY={0}
				width={TYPE_DIRECTION_DISPLAY_WIDTH}
				height={BUTTON_HEIGHT}
				fillColor={RGB_COLORS.BLACK}>
				<CanvasText
					relX={0}
					relY={0}
					align="left"
					verticalAlign="center"
					text={displayText}
					fillColor={COLORS.WHITE}
				/>
			</Button>
		</CanvasObjectGroup>
	);
});
