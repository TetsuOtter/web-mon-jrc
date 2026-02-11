import { memo, useCallback, useMemo } from "react";

import { CanvasText } from "../../../../../../canvas-renderer";
import { toWide } from "../../../../../../utils/toWide";
import Button, { SHADOW_WIDTH } from "../../../components/Button";
import { COLORS } from "../../../constants";

const HEIGHT = 52;
const WIDTH = HEIGHT;

const LEFT = 32;
const TOP = 32;

type TenKeyButtonProps = {
	row: number;
	col: number;
	onClick: (type: TenKeyType) => void;
	type: TenKeyType | undefined;
};
export default memo<TenKeyButtonProps>(function TenKeyButton({
	row,
	col,
	onClick,
	type,
}) {
	const handleClick = useCallback(() => {
		if (type == null || type === TEN_KEY_TYPE.EMPTY) {
			return false;
		}
		onClick(type);
		return true;
	}, [onClick, type]);
	const text = useMemo(
		() => toWide(TYPE_LABEL[type ?? TEN_KEY_TYPE.EMPTY]),
		[type]
	);
	if (type == null) {
		return null;
	}
	return (
		<Button
			relX={LEFT + col * WIDTH}
			relY={TOP + row * HEIGHT}
			width={type === TEN_KEY_TYPE.CLEAR ? WIDTH * 2 : WIDTH}
			height={HEIGHT}
			shadowWidth={SHADOW_WIDTH.SMALL}
			onClick={type != TEN_KEY_TYPE.EMPTY ? handleClick : undefined}>
			{type != TEN_KEY_TYPE.EMPTY && (
				<CanvasText
					relX={0}
					relY={0}
					align="center"
					verticalAlign="center"
					text={text}
					fillColor={type === TEN_KEY_TYPE.CLEAR ? COLORS.RED : COLORS.WHITE}
					scaleX={2}
					scaleY={2}
				/>
			)}
		</Button>
	);
});

export const TEN_KEY_TYPE = {
	EMPTY: -1,
	0: 0,
	1: 1,
	2: 2,
	3: 3,
	4: 4,
	5: 5,
	6: 6,
	7: 7,
	8: 8,
	9: 9,
	CLEAR: 10,
	回: 11,
	救: 12,
	試: 13,
	A: 14,
	C: 15,
	D: 16,
	F: 17,
	G: 18,
	M: 19,
} as const;
export type TenKeyType = (typeof TEN_KEY_TYPE)[keyof typeof TEN_KEY_TYPE];

export const TYPE_LABEL = {
	[TEN_KEY_TYPE.EMPTY]: "",
	0: "0",
	1: "1",
	2: "2",
	3: "3",
	4: "4",
	5: "5",
	6: "6",
	7: "7",
	8: "8",
	9: "9",
	[TEN_KEY_TYPE.CLEAR]: "クリア",
	[TEN_KEY_TYPE.回]: "回",
	[TEN_KEY_TYPE.救]: "救",
	[TEN_KEY_TYPE.試]: "試",
	[TEN_KEY_TYPE.A]: "A",
	[TEN_KEY_TYPE.C]: "C",
	[TEN_KEY_TYPE.D]: "D",
	[TEN_KEY_TYPE.F]: "F",
	[TEN_KEY_TYPE.G]: "G",
	[TEN_KEY_TYPE.M]: "M",
} as const satisfies Record<TenKeyType, string>;
