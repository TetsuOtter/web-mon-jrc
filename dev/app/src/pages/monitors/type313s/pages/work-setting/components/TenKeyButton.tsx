import { memo, useCallback, useMemo } from "react";

import { CanvasText } from "@web-mon-jrc/canvas-renderer";

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

export const TEN_KEY_TYPE_NUMBER = {
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
} as const;
export const TEN_KEY_TYPE_PREFIX = {
	回: 101,
	救: 102,
	試: 103,
} as const;
export const TEN_KEY_TYPE_SUFFIX = {
	A: 201,
	C: 202,
	D: 203,
	F: 204,
	G: 205,
	M: 206,
} as const;
export const TEN_KEY_TYPE_OTHER = {
	EMPTY: -1,
	CLEAR: -2,
} as const;
export const TEN_KEY_TYPE = {
	...TEN_KEY_TYPE_NUMBER,
	...TEN_KEY_TYPE_PREFIX,
	...TEN_KEY_TYPE_SUFFIX,
	...TEN_KEY_TYPE_OTHER,
} as const;
export type TenKeyTypeNumber =
	(typeof TEN_KEY_TYPE_NUMBER)[keyof typeof TEN_KEY_TYPE_NUMBER];
export type TenKeyTypePrefix =
	(typeof TEN_KEY_TYPE_PREFIX)[keyof typeof TEN_KEY_TYPE_PREFIX];
export type TenKeyTypeSuffix =
	(typeof TEN_KEY_TYPE_SUFFIX)[keyof typeof TEN_KEY_TYPE_SUFFIX];
export type TenKeyType = (typeof TEN_KEY_TYPE)[keyof typeof TEN_KEY_TYPE];

const tenKeyTypeNumberValuesSet = new Set(Object.values(TEN_KEY_TYPE_NUMBER));
export function isTenKeyTypeNumber(type: TenKeyType): type is TenKeyTypeNumber {
	return tenKeyTypeNumberValuesSet.has(type as TenKeyTypeNumber);
}
const tenKeyTypePrefixValuesSet = new Set(Object.values(TEN_KEY_TYPE_PREFIX));
export function isTenKeyTypePrefix(type: TenKeyType): type is TenKeyTypePrefix {
	return tenKeyTypePrefixValuesSet.has(type as TenKeyTypePrefix);
}
const tenKeyTypeSuffixValuesSet = new Set(Object.values(TEN_KEY_TYPE_SUFFIX));
export function isTenKeyTypeSuffix(type: TenKeyType): type is TenKeyTypeSuffix {
	return tenKeyTypeSuffixValuesSet.has(type as TenKeyTypeSuffix);
}

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
