import { memo } from "react";

import CanvasObjectGroup from "@web-mon-jrc/canvas-renderer/objects/CanvasObjectGroup";

import { SHADOW_WIDTH } from "../../../components/Button";
import TextButton from "../../../components/TextButton";
import { COLORS } from "../../../constants";

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
			<TextButton
				text={buttonText}
				relX={0}
				relY={0}
				width={BUTTON_WIDTH}
				height={BUTTON_HEIGHT}
				shadowWidth={SHADOW_WIDTH.SMALL}
				onClick={onButtonClick}
				scaleY={2}
			/>

			{/* Direction Display Area */}
			<TextButton
				text={displayText}
				relX={DIRECTION_DISPLAY_LEFT - DIRECTION_BUTTON_LEFT}
				relY={0}
				width={TYPE_DIRECTION_DISPLAY_WIDTH}
				height={BUTTON_HEIGHT}
				fillColor={COLORS.BLACK}
				textHorizontalAlign="left"
			/>
		</CanvasObjectGroup>
	);
});
