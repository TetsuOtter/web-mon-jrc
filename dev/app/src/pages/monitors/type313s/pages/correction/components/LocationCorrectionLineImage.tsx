import { memo, useCallback } from "react";

import { CanvasImage, CanvasText } from "@web-mon-jrc/canvas-renderer";
import CanvasObjectBase from "@web-mon-jrc/canvas-renderer/objects/CanvasObjectBase";

import { COLORS, DISPLAY_WIDTH } from "../../../constants";

import type {
	CanvasRenderFunction,
	ClickEventHandler,
} from "@web-mon-jrc/canvas-renderer/contexts/CanvasObjectContext";

const WIDTH = DISPLAY_WIDTH;
const HEIGHT = 70;

const ROW_Y = 210;
const STEP_Y = 104;

export const CELL_COUNT = 4;

const FIRST_CELL_LEFT = 64;
const CELL_TOP = 34;
const CELL_WIDTH = 104;
const CELL_HEIGHT = HEIGHT - CELL_TOP;

const STEP_X = 200;

const LINE_TOP = 46;
const LINE_HEIGHT = 10;
const LINE_STRIPE_WIDTH = 32;
const LINE_STRIPE_HEIGHT = LINE_HEIGHT - 2;
const STROKE_THICKNESS = 1;

type LocationCorrectionLineImageProps = {
	row: number;
	stationNameList: string[];
	stationNameStartIndex: number;
	carImageStationIndex: number;
	onClick: (index: number) => void;
};

export default memo<LocationCorrectionLineImageProps>(
	function LocationCorrectionLineImage({
		row,
		stationNameList,
		stationNameStartIndex,
		carImageStationIndex,
		onClick,
	}) {
		const onRender: CanvasRenderFunction = useCallback(
			(ctx, metadata) => {
				ctx.save();

				const ix = Math.round(metadata.absX);
				const iy = Math.round(metadata.absY);
				const iw = Math.round(metadata.width);

				ctx.imageSmoothingEnabled = false;
				ctx.fillStyle = COLORS.WHITE;
				ctx.beginPath();
				const lineAbsY = iy + LINE_TOP;
				ctx.fillRect(ix, lineAbsY, iw, STROKE_THICKNESS);
				ctx.fillRect(
					ix,
					lineAbsY + LINE_HEIGHT - STROKE_THICKNESS,
					iw,
					STROKE_THICKNESS
				);
				ctx.fillRect(ix, lineAbsY, STROKE_THICKNESS, LINE_HEIGHT);
				ctx.fillRect(
					ix + iw - STROKE_THICKNESS,
					lineAbsY,
					STROKE_THICKNESS,
					LINE_HEIGHT
				);

				Array.from({ length: CELL_COUNT }).forEach((_, i) => {
					const absX = ix + (FIRST_CELL_LEFT + STEP_X * i);
					const absY = iy + CELL_TOP;
					ctx.fillStyle = COLORS.BLACK;
					ctx.fillRect(absX, absY, CELL_WIDTH, CELL_HEIGHT);
					ctx.fillStyle = COLORS.WHITE;
					ctx.fillRect(absX, absY, CELL_WIDTH, STROKE_THICKNESS);
					ctx.fillRect(absX, absY + CELL_HEIGHT, CELL_WIDTH, STROKE_THICKNESS);
					ctx.fillRect(absX, absY, STROKE_THICKNESS, CELL_HEIGHT);
					ctx.fillRect(
						absX + CELL_WIDTH - STROKE_THICKNESS,
						absY,
						STROKE_THICKNESS,
						CELL_HEIGHT + STROKE_THICKNESS
					);
				});

				ctx.fillStyle = COLORS.WHITE;
				const stripeOffset0 = row % 2 === 0 ? LINE_STRIPE_WIDTH : 0;
				const stripeOffset1 = row % 2 === 1 ? LINE_STRIPE_WIDTH : 0;
				const cellEdge = FIRST_CELL_LEFT + CELL_WIDTH;
				const stripes: number[] = [];

				// 一番左
				stripes.push(stripeOffset0);

				// [0] - [1]
				stripes.push(cellEdge + stripeOffset0);
				if (stripeOffset0 === 0) {
					stripes.push(cellEdge + LINE_STRIPE_WIDTH * 2);
				}

				// [1] - [2]
				stripes.push(cellEdge + STEP_X + stripeOffset1);
				if (stripeOffset1 === 0) {
					stripes.push(cellEdge + STEP_X + LINE_STRIPE_WIDTH * 2);
				}

				// [2] - [3], 一番右
				stripes.push(cellEdge + STEP_X * 2 + stripeOffset0);
				if (stripeOffset0 === 0) {
					stripes.push(cellEdge + STEP_X * 2 + LINE_STRIPE_WIDTH * 2);
				} else {
					// 一番右
					stripes.push(cellEdge + STEP_X * 3);
				}

				stripes.forEach((sx) =>
					ctx.fillRect(
						ix + sx,
						lineAbsY + 1,
						LINE_STRIPE_WIDTH,
						LINE_STRIPE_HEIGHT
					)
				);

				ctx.restore();
			},
			[row]
		);

		const colCount = Math.min(
			CELL_COUNT,
			stationNameList.length - stationNameStartIndex
		);
		const handleClick: ClickEventHandler = useCallback(
			(relX, relY) => {
				if (relY < CELL_TOP || CELL_TOP + CELL_HEIGHT < relY) {
					return false;
				}
				for (let i = 0; i < colCount; i++) {
					const cellRelX = FIRST_CELL_LEFT + STEP_X * i;
					if (cellRelX <= relX && relX <= cellRelX + CELL_WIDTH) {
						const stationIndex = stationNameStartIndex + i;
						onClick(stationIndex);
						return true;
					}
				}
				return false;
			},
			[colCount, onClick, stationNameStartIndex]
		);

		const carImageCol = carImageStationIndex - stationNameStartIndex;
		const isCarImageVisible = 0 <= carImageCol && carImageCol < colCount;

		return (
			<CanvasObjectBase
				onRender={onRender}
				relX={0}
				relY={ROW_Y + row * STEP_Y}
				width={WIDTH}
				height={HEIGHT}
				onClick={handleClick}
				isFilled>
				{isCarImageVisible && (
					<CanvasImage
						imagePath={`${import.meta.env.BASE_URL}type313s/location_correction_car.png`}
						relX={FIRST_CELL_LEFT + STEP_X * carImageCol}
						relY={0}
						areaWidth={CELL_WIDTH}
						horizontalAlign="center"
					/>
				)}
				{Array.from({ length: colCount }).map((_, i) => (
					<CanvasText
						// eslint-disable-next-line react/no-array-index-key
						key={`station-name-${i}`}
						text={stationNameList[i + stationNameStartIndex] ?? ""}
						relX={FIRST_CELL_LEFT + STEP_X * i}
						relY={CELL_TOP}
						maxWidthPx={CELL_WIDTH}
						maxHeightPx={CELL_HEIGHT}
						align="center"
						verticalAlign="center"
						fillColor={COLORS.WHITE}
					/>
				))}
			</CanvasObjectBase>
		);
	}
);
