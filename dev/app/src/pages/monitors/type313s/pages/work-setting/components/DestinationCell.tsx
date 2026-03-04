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

export default memo<CellProps>(function DestinationCell({ index }) {
	const {
		metadata: { height, width },
	} = useCanvasObjectContext();
	if (ELEM_LIST.length <= index) {
		return null;
	}
	const typeName = ELEM_LIST[index];
	if (!typeName) {
		return null;
	}
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

const text = (str: string, str211?: string) => {
	const s1 = str.length === 2 ? `${str[0]}\u3000${str[1]}` : str;
	const tmpS2 = str211 ?? str;
	const s2 = tmpS2.length === 2 ? `${tmpS2[0]}\u3000${tmpS2[1]}` : tmpS2;
	return `${s1}\n（${s2}）`;
};
export const ELEM_LIST: string[] = [
	text("回送"),
	text("試運転"),
	text("臨時"),
	text("団体"),
	"",
	text("沼津"),
	text("静岡"),
	text("浜松"),
	"",
	"",
	text("熱海"),
	text("函南"),
	text("三島"),
	text("沼津"),
	text("東田子の浦"),
	text("富士"),
	text("興津"),
	text("静岡"),
	text("用宗"),
	text("島田"),
	text("菊川"),
	text("掛川"),
	text("浜松"),
	text("高塚"),
];
