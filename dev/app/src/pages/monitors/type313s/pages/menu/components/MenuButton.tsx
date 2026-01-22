import { memo, useCallback } from "react";

import { CanvasText } from "../../../../../../canvas-renderer";
import CanvasDotPattern from "../../../../../../canvas-renderer/objects/CanvasDotPattern";
import CanvasObjectGroup from "../../../../../../canvas-renderer/objects/CanvasObjectGroup";
import Button from "../../../components/Button";
import { COLORS, FONT_SIZE_2X } from "../../../constants";
import { usePageNavigation } from "../../usePageNavigation";

import type { IconData } from "../../../icons";
import type { PageMode, PageType } from "../../pageTypes";

const BUTTON_HEIGHT = 56;
const BUTTON_WIDTH = 96;

const TEXT_TOP = BUTTON_HEIGHT + 4;

const AREA_HEIGHT = TEXT_TOP + FONT_SIZE_2X;

const ICON_X = BUTTON_WIDTH / 2 - 20;
const ICON_Y = BUTTON_HEIGHT / 2 - 20;

const FIRST_COL_X = 112;
const COL_GAP = 160;
const FIRST_ROW_Y = 48;
const ROW_GAP = 140;

type MenuButtonProps = {
	row: number;
	col: number;
	icon: IconData;
	text: string;
	page: PageType;
	mode: PageMode;
};
export default memo<MenuButtonProps>(function MenuButton({
	row,
	col,
	icon,
	text,
	page,
	mode,
}) {
	const navigate = usePageNavigation();
	const handleClick = useCallback(() => {
		navigate(page, { mode });
	}, [navigate, page, mode]);
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
				onClick={handleClick}>
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
