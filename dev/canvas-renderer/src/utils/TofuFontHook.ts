import { useMemo } from "react";

import { Bitmap } from "bdfparser";

import type { FontInfo, GlyphData } from "../types/FontInfo";

export type Tofu = {
	halfWidth: GlyphData;
	fullWidth: GlyphData;
};
export function useTofu(font: FontInfo): Tofu {
	const fontWidth = font.fontSize;
	return useMemo(() => {
		const widthForHalfWidth = fontWidth / 2;
		const halfWidthRows: string[] = [];
		const fullWidthRows: string[] = [];

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
			halfWidthRows.push(halfWidthRow);
			fullWidthRows.push(fullWidthRow);
		}

		return {
			halfWidth: {
				bitmap: new Bitmap(halfWidthRows),
				advanceWidth: widthForHalfWidth,
				xOffset: 0,
				yOffset: 0,
			},
			fullWidth: {
				bitmap: new Bitmap(fullWidthRows),
				advanceWidth: fontWidth,
				xOffset: 0,
				yOffset: 0,
			},
		};
	}, [fontWidth]);
}

function getTofuLine(
	row: number,
	col: number,
	height: number,
	width: number,
): "1" | "0" {
	const isFirstOrLastRow = row === 0 || row === height - 1;
	const isFirstOrLastCol = col === 0 || col === width - 1;
	const isFirstOrLast = isFirstOrLastRow || isFirstOrLastCol;

	const isOneInnerRow = row === 1 || row === height - 2;
	const isOneInnerCol = col === 1 || col === width - 2;
	const isOneInner = isOneInnerRow || isOneInnerCol;

	return isOneInner && !isFirstOrLast ? "1" : "0";
}
