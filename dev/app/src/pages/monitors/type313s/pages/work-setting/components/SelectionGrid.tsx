import type { ComponentType } from "react";
import { memo, useCallback } from "react";

import { CanvasLine, CanvasText } from "@web-mon-jrc/canvas-renderer";
import CanvasObjectGroup from "@web-mon-jrc/canvas-renderer/objects/CanvasObjectGroup";

import { COLORS, DISPLAY_WIDTH, FONT_SIZE_1X } from "../../../constants";

const ROW_COUNT = 6;
const COLUMN_COUNT = 4;

const ROW_HEIGHT = 60;
const COLUMN_WIDTH = 200;

const CELL_INDEX_OFFSET_X = 4;
const CELL_INDEX_OFFSET_Y = 5;

const AREA_WIDTH = DISPLAY_WIDTH;
const AREA_HEIGHT = ROW_HEIGHT * ROW_COUNT;

export const CELL_COUNT = ROW_COUNT * COLUMN_COUNT;

export type CellProps = {
	index: number;
};
type SelectionGridProps = {
	offsetY?: number;
	pageIndex: number;
	onClickCell: (index: number) => void;
	CellComponent: ComponentType<CellProps>;
};
export default memo<SelectionGridProps>(function SelectionGrid({
	offsetY = 88,
	pageIndex,
	onClickCell,
	CellComponent,
}) {
	return (
		<CanvasObjectGroup
			relX={0}
			relY={offsetY}
			width={AREA_WIDTH}
			height={AREA_HEIGHT}>
			{Array.from({ length: ROW_COUNT }).map((_, idx) => (
				<CanvasLine
					// eslint-disable-next-line react/no-array-index-key
					key={`hline-${idx}`}
					relX1={0}
					relX2={AREA_WIDTH - 1}
					// Cellの下側に線を引く
					relY1={(idx + 1) * ROW_HEIGHT - 1}
					relY2={(idx + 1) * ROW_HEIGHT - 1}
					color={COLORS.WHITE}
				/>
			))}
			{Array.from({ length: COLUMN_COUNT - 1 }).map((_, idx) => (
				<CanvasLine
					// eslint-disable-next-line react/no-array-index-key
					key={`vline-${idx}`}
					// Cellの左側に線を引く
					relX1={(idx + 1) * COLUMN_WIDTH}
					relX2={(idx + 1) * COLUMN_WIDTH}
					relY1={0}
					relY2={AREA_HEIGHT - 1}
					color={COLORS.WHITE}
				/>
			))}
			{Array.from({ length: COLUMN_COUNT })
				.map((_, colIdx) =>
					Array.from({ length: ROW_COUNT }).map((_, rowIdx) => {
						const cellIndex = rowIdx + colIdx * ROW_COUNT;
						const pagedCellIndex = pageIndex * CELL_COUNT + cellIndex;
						return (
							<CellWrapper
								key={`cell-${cellIndex}`}
								rowIdx={rowIdx}
								colIdx={colIdx}
								pagedCellIndex={pagedCellIndex}
								CellComponent={CellComponent}
								onClickCell={onClickCell}
							/>
						);
					})
				)
				.flat()}
		</CanvasObjectGroup>
	);
});

type CellWrapperProps = {
	rowIdx: number;
	colIdx: number;
	pagedCellIndex: number;
	onClickCell: (index: number) => void;
	CellComponent: ComponentType<CellProps>;
};
// eslint-disable-next-line react/no-multi-comp
const CellWrapper = memo<CellWrapperProps>(function CellWrapper({
	rowIdx,
	colIdx,
	pagedCellIndex,
	onClickCell,
	CellComponent,
}) {
	const handleClick = useCallback(() => {
		onClickCell(pagedCellIndex);
		return true;
	}, [pagedCellIndex, onClickCell]);
	return (
		<CanvasObjectGroup
			relX={colIdx * COLUMN_WIDTH}
			relY={rowIdx * ROW_HEIGHT}
			width={COLUMN_WIDTH}
			height={ROW_HEIGHT}
			onClick={handleClick}>
			<CellComponent index={pagedCellIndex} />
			<CanvasText
				relX={CELL_INDEX_OFFSET_X}
				relY={CELL_INDEX_OFFSET_Y}
				maxWidthPx={FONT_SIZE_1X * 1.5}
				align="right"
				text={`${pagedCellIndex + 1}.`}
				fillColor={COLORS.WHITE}
			/>
		</CanvasObjectGroup>
	);
});
