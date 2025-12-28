import { useMemo } from "react";

import { Bitmap } from "bdfparser";

import type { FontInfo } from "../types/FontInfo";

export type Tofu = {
	halfWidth: Bitmap;
	fullWidth: Bitmap;
};
export function useTofu(font: FontInfo): Tofu {
	const fontWidth = font.fontSize;
	return useMemo(() => {
		const widthForHalfWidth = fontWidth / 2;
		const halfWidth: string[] = [];
		const fullWidth: string[] = [];

		for (let row = 0; row < fontWidth; row++) {
			let halfWidthRow = "";
			let fullWidthRow = "";
			for (let col = 0; col < fontWidth; col++) {
				fullWidthRow += getTofuLine(row, col, fontWidth, fontWidth);

				const isInHalfWidth = col < widthForHalfWidth;
				if (!isInHalfWidth) {
					continue;
				}
				halfWidthRow += getTofuLine(row, col, fontWidth, widthForHalfWidth);
			}
			halfWidth.push(halfWidthRow);
			fullWidth.push(fullWidthRow);
		}

		return {
			halfWidth: new Bitmap(halfWidth),
			fullWidth: new Bitmap(fullWidth),
		};
	}, [fontWidth]);
}

function getTofuLine(
	row: number,
	col: number,
	height: number,
	width: number
): "1" | "0" {
	const isFirstOrLastRow = row === 0 || row === height - 1;
	const isFirstOrLastCol = col === 0 || col === width - 1;
	const isFirstOrLast = isFirstOrLastRow || isFirstOrLastCol;

	const isOneInnerRow = row === 1 || row === height - 2;
	const isOneInnerCol = col === 1 || col === width - 2;
	const isOneInner = isOneInnerRow || isOneInnerCol;

	return isOneInner && !isFirstOrLast ? "1" : "0";
}
