export const ICON_SIZE_PX = 40;

type ZeroOrOneChar = "0" | "1";

// より小さな単位で段階的に構築
type Bit1 = ZeroOrOneChar;
type Bit2 = `${Bit1}${Bit1}`;
type Bit4 = `${Bit2}${Bit2}`;
type Bit8 = `${Bit4}${Bit4}`;

const EMPTY_CHAR8 = "00000000" satisfies Bit8;
export const EMPTY = getLine(
	EMPTY_CHAR8,
	EMPTY_CHAR8,
	EMPTY_CHAR8,
	EMPTY_CHAR8,
	EMPTY_CHAR8
);

export type IconLineStrictType = string & {
	length: typeof ICON_SIZE_PX;
};
export type IconDataStrictType = readonly IconLineStrictType[] & {
	length: typeof ICON_SIZE_PX;
};

export function getLine(
	c1: Bit8,
	c2: Bit8,
	c3: Bit8,
	c4: Bit8,
	c5: Bit8
): IconLineStrictType {
	return `${c1 as string}${c2 as string}${c3 as string}${c4 as string}${c5 as string}` as IconLineStrictType;
}
