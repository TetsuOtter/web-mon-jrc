import { memo, useCallback, useMemo } from "react";

import CanvasObjectBase from "../../../../canvas-renderer/objects/CanvasObjectBase";
import CanvasText from "../../../../canvas-renderer/objects/CanvasText";

import type { CanvasRenderFunction } from "../../../../canvas-renderer/contexts/CanvasObjectContext";
import type { CanvasTextProps } from "../../../../canvas-renderer/objects/CanvasText";

export type CellInfo = {
	text: string;
	textColor: string;
	backgroundColor?: string;
	verticalAlign?: CanvasTextProps["verticalAlign"];
	horizontalAlign?: CanvasTextProps["align"];
	scaleX?: number;
	scaleY?: number;
};

export type CellListForRow = CellInfo[];
export type RowList = CellListForRow[];

type TableProps = {
	relX: number;
	relY: number;
	rowList: RowList;
	cellPaddingXList?: { left: number; right: number }[];
} & TableBaseProps;
export default memo<TableProps>(function Table(props) {
	const { relX, relY, rowList, cellPaddingXList } = props;
	const { totalHeight, totalWidth, baseImage, rowDefinitionList } =
		useTableBase(props);
	const onRender: CanvasRenderFunction = useCallback(
		(ctx, metadata) => {
			const absX = Math.round(metadata.absX);
			const absY = Math.round(metadata.absY);

			ctx.imageSmoothingEnabled = false;
			ctx.drawImage(baseImage, absX, absY);

			ctx.save();
			for (let rowIndex = 0; rowIndex < rowList.length; rowIndex++) {
				const cellList = rowList[rowIndex];
				const rowDef = rowDefinitionList[rowIndex];
				for (let colIndex = 0; colIndex < cellList.length; colIndex++) {
					const cell = cellList[colIndex];
					const cellDef = rowDef.cells[colIndex];

					// 背景色
					if (cell.backgroundColor) {
						ctx.fillStyle = cell.backgroundColor;
						ctx.fillRect(
							absX + cellDef.x,
							absY + rowDef.y,
							cellDef.width,
							rowDef.height
						);
					}
				}
			}
			ctx.restore();
		},
		[baseImage, rowDefinitionList, rowList]
	);

	const cells = useMemo(
		() =>
			rowList
				.map((cellList, rowIndex) => {
					const rowDef = rowDefinitionList[rowIndex];
					return cellList.map((cell, colIndex) => {
						if (!cell.text) {
							return null;
						}
						const cellDef = rowDef.cells[colIndex];
						const cellPaddingX = cellPaddingXList?.[colIndex] ?? {
							left: 0,
							right: 0,
						};
						const maxWidthPx =
							cellDef.width +
							cellDef.borderThickness -
							cellPaddingX.left -
							cellPaddingX.right;
						const maxHeightPx = rowDef.height + cellDef.borderThickness;
						return (
							<CanvasText
								// eslint-disable-next-line react/no-array-index-key
								key={`table-cell-${rowIndex}-${colIndex}`}
								relX={cellDef.x + cellPaddingX.left}
								relY={rowDef.y}
								maxWidthPx={maxWidthPx}
								maxHeightPx={maxHeightPx}
								text={cell.text}
								fillColor={cell.textColor}
								verticalAlign={cell.verticalAlign}
								align={cell.horizontalAlign}
								scaleX={cell.scaleX}
								scaleY={cell.scaleY}
							/>
						);
					});
				})
				.flat()
				.filter((cell) => cell != null),
		[cellPaddingXList, rowDefinitionList, rowList]
	);

	return (
		<CanvasObjectBase
			onRender={onRender}
			relX={relX}
			relY={relY}
			width={totalWidth}
			height={totalHeight}
			isFilled={false}>
			{cells}
		</CanvasObjectBase>
	);
});

type TableBaseProps = {
	cellHeightList: number[];
	cellWidthList: number[];
	borderColor: string;
	borderWidth: number | number[];
	borderHeight: number | number[];
};
type TableBaseReturn = {
	totalWidth: number;
	totalHeight: number;
	rowDefinitionList: RowDefinition[];
	baseImage: OffscreenCanvas;
};
function useTableBase(props: TableBaseProps): TableBaseReturn {
	const {
		cellHeightList,
		cellWidthList,
		borderColor,
		borderWidth,
		borderHeight,
	} = props;
	return useMemo(() => {
		const {
			totalSize: totalWidth,
			lineDefinitionList: verticalLineDefinitionList,
		} = getTotalWidthAndLinesDefinition(cellWidthList, borderWidth);
		const {
			totalSize: totalHeight,
			lineDefinitionList: horizontalLineDefinitionList,
		} = getTotalWidthAndLinesDefinition(cellHeightList, borderHeight);

		const canvas = new OffscreenCanvas(totalWidth, totalHeight);
		const ctx = canvas.getContext("2d");
		if (!ctx) {
			throw new Error("Failed to get OffscreenCanvasRenderingContext2D");
		}

		ctx.fillStyle = borderColor;
		horizontalLineDefinitionList.forEach(({ pos, thickness }) => {
			ctx.fillRect(0, pos, totalWidth, thickness);
		});
		verticalLineDefinitionList.forEach(({ pos, thickness }) => {
			ctx.fillRect(pos, 0, thickness, totalHeight);
		});

		return {
			totalWidth,
			totalHeight,
			rowDefinitionList: getRowDefinitionList(
				cellHeightList,
				cellWidthList,
				horizontalLineDefinitionList,
				verticalLineDefinitionList
			),
			baseImage: canvas,
		};
	}, [cellHeightList, cellWidthList, borderColor, borderWidth, borderHeight]);
}

type LineDefinition = {
	pos: number;
	thickness: number;
};
function getTotalWidthAndLinesDefinition(
	cellSizeList: number[],
	borderThickness: number | number[]
): { totalSize: number; lineDefinitionList: LineDefinition[] } {
	const borderThicknessList = Array.isArray(borderThickness)
		? borderThickness
		: Array.from({ length: cellSizeList.length + 1 }, () => borderThickness);
	if (borderThicknessList.length !== cellSizeList.length + 1) {
		throw new Error("borderThickness length mismatch");
	}
	const lineDefinitionList: LineDefinition[] = [
		{ pos: 0, thickness: borderThicknessList[0] },
	];
	let totalSize = borderThicknessList[0];
	for (let i = 0; i < cellSizeList.length; i++) {
		totalSize += cellSizeList[i];
		lineDefinitionList.push({
			pos: totalSize,
			thickness: borderThicknessList[i + 1],
		});
		totalSize += borderThicknessList[i + 1];
	}
	return { totalSize, lineDefinitionList };
}

type CellDefinition = {
	x: number;
	width: number;
	borderThickness: number;
};
type RowDefinition = {
	y: number;
	height: number;
	borderThickness: number;
	cells: CellDefinition[];
};
function getRowDefinitionList(
	cellHeightList: number[],
	cellWidthList: number[],
	horizontalLineDefinitionList: LineDefinition[],
	verticalLineDefinitionList: LineDefinition[]
): RowDefinition[] {
	const rowDefinitionList: RowDefinition[] = [];
	let currentY = 0;
	for (let rowIndex = 0; rowIndex < cellHeightList.length; rowIndex++) {
		currentY += horizontalLineDefinitionList[rowIndex].thickness;
		const rowHeight = cellHeightList[rowIndex];
		const cells: CellDefinition[] = [];
		let currentX = 0;
		for (let colIndex = 0; colIndex < cellWidthList.length; colIndex++) {
			currentX += verticalLineDefinitionList[colIndex].thickness;
			const cellWidth = cellWidthList[colIndex];
			cells.push({
				x: currentX,
				width: cellWidth,
				borderThickness: verticalLineDefinitionList[colIndex].thickness,
			});
			currentX += cellWidth;
		}
		rowDefinitionList.push({
			y: currentY,
			height: rowHeight,
			borderThickness: horizontalLineDefinitionList[rowIndex].thickness,
			cells,
		});
		currentY += rowHeight;
	}
	return rowDefinitionList;
}
