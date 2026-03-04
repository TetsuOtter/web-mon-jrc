import { memo } from "react";

import { CanvasText } from "@web-mon-jrc/canvas-renderer";
import { useCanvasObjectContext } from "@web-mon-jrc/canvas-renderer/contexts/CanvasObjectContext";
import CanvasObjectGroup from "@web-mon-jrc/canvas-renderer/objects/CanvasObjectGroup";

import { COLORS, FONT_SIZE_2X } from "../../../constants";

import type { CellProps } from "./SelectionGrid";

const FIRST_LINE_X = 32;
const FIRST_LINE_Y = 4;
const SECOND_LINE_X = FIRST_LINE_X;
const SECOND_LINE_Y = FIRST_LINE_Y + FONT_SIZE_2X + 4;

export default memo<CellProps>(function TypeCell({ index }) {
	const {
		metadata: { height, width },
	} = useCanvasObjectContext();
	if (ELEM_LIST.length <= index) {
		return null;
	}
	const typeName = ELEM_LIST[index];
	const firstLine = typeName.split("\n")[0];
	const secondLine = typeName.split("\n")[1];
	if (!secondLine) {
		return (
			<CanvasText
				relX={FIRST_LINE_X}
				relY={FIRST_LINE_Y}
				text={firstLine}
				scaleY={2}
				fillColor={COLORS.WHITE}
			/>
		);
	}
	return (
		<CanvasObjectGroup
			relX={0}
			relY={0}
			width={width}
			height={height}>
			<CanvasText
				relX={FIRST_LINE_X}
				relY={FIRST_LINE_Y}
				text={firstLine}
				scaleY={2}
				fillColor={COLORS.WHITE}
			/>
			<CanvasText
				relX={SECOND_LINE_X}
				relY={SECOND_LINE_Y}
				text={secondLine}
				fillColor={COLORS.WHITE}
			/>
		</CanvasObjectGroup>
	);
});

export const ELEM_LIST: string[] = [
	"回　送",
	"試運転",
	"臨　時",
	"団　体",
	"普　通",
	"快　速",
	"ワンマン",
	"ワンマン普通",
	"ワンマン快速",
	"通勤快速",
	"普　通\n（熱海）",
];
