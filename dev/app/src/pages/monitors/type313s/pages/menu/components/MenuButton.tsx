import { memo } from "react";

import { CanvasText } from "../../../../../../canvas-renderer";
import CanvasDotPattern from "../../../../../../canvas-renderer/objects/CanvasDotPattern";
import CanvasObjectGroup from "../../../../../../canvas-renderer/objects/CanvasObjectGroup";
import Button from "../../../components/Button";
import { COLORS, FONT_SIZE_2X } from "../../../constants";

import type { IconData } from "../../../icons";

const BUTTON_HEIGHT = 68;
const BUTTON_WIDTH = 114;

const TEXT_TOP = BUTTON_HEIGHT + 4;

const AREA_HEIGHT = TEXT_TOP + FONT_SIZE_2X;

const ICON_X = BUTTON_WIDTH / 2 - 20;
const ICON_Y = BUTTON_HEIGHT / 2 - 20;

const FIRST_COL_X = 90;
const COL_GAP = 159;
const FIRST_ROW_Y = 35;
const ROW_GAP = 144;

type MenuButtonProps = {
	row: number;
	col: number;
	icon: IconData;
	text: string;
	onClick?: () => void;
};
export default memo<MenuButtonProps>(function MenuButton({
	row,
	col,
	icon,
	text,
	onClick,
}) {
	return (
		<CanvasObjectGroup
			relX={FIRST_COL_X + COL_GAP * col}
			relY={FIRST_ROW_Y + ROW_GAP * row}
			width={BUTTON_WIDTH}
			height={AREA_HEIGHT}>
			<Button
				relX={0}
				relY={0}
				width={BUTTON_WIDTH}
				height={BUTTON_HEIGHT}
				onClick={onClick}>
				<CanvasDotPattern
					image={icon}
					x={ICON_X}
					y={ICON_Y}
					color={COLORS.WHITE}
				/>
			</Button>
			<CanvasText
				relX={0}
				relY={TEXT_TOP}
				maxWidthPx={BUTTON_WIDTH}
				align="center"
				text={text}
				fillColor={COLORS.WHITE}
				scaleY={2}
			/>
		</CanvasObjectGroup>
	);
});
