import { memo, useCallback, useEffect } from "react";

import { CanvasImage, CanvasText } from "@web-mon-jrc/canvas-renderer";
import { CanvasObjectContext } from "@web-mon-jrc/canvas-renderer/contexts";
import {
	usePixiObject,
	clearContainer,
} from "@web-mon-jrc/canvas-renderer/hooks";
import { Graphics } from "pixi.js";

import { COLORS, DISPLAY_WIDTH } from "../../../constants";

import type { ClickEventHandler } from "@web-mon-jrc/canvas-renderer/contexts";

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
		const colCount = Math.min(
			CELL_COUNT,
			stationNameList.length - stationNameStartIndex,
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
			[colCount, onClick, stationNameStartIndex],
		);

		const carImageCol = carImageStationIndex - stationNameStartIndex;
		const isCarImageVisible = 0 <= carImageCol && carImageCol < colCount;

		const { container, graphicsContainer, metadata } = usePixiObject({
			relX: 0,
			relY: ROW_Y + row * STEP_Y,
			width: WIDTH,
			height: HEIGHT,
			onClick: handleClick,
		});

		useEffect(() => {
			if (graphicsContainer.destroyed) return;
			clearContainer(graphicsContainer);
			const iw = Math.round(WIDTH);
			const g = new Graphics();

			// 外枠ボーダー（WHITE）
			g.rect(0, LINE_TOP, iw, STROKE_THICKNESS)
				.rect(
					0,
					LINE_TOP + LINE_HEIGHT - STROKE_THICKNESS,
					iw,
					STROKE_THICKNESS,
				)
				.rect(0, LINE_TOP, STROKE_THICKNESS, LINE_HEIGHT)
				.rect(iw - STROKE_THICKNESS, LINE_TOP, STROKE_THICKNESS, LINE_HEIGHT)
				.fill(COLORS.WHITE);

			// セル背景（BLACK）
			Array.from({ length: CELL_COUNT }).forEach((_, i) => {
				g.rect(FIRST_CELL_LEFT + STEP_X * i, CELL_TOP, CELL_WIDTH, CELL_HEIGHT);
			});
			g.fill(COLORS.BLACK);

			// セルボーダー（WHITE）
			Array.from({ length: CELL_COUNT }).forEach((_, i) => {
				const cx = FIRST_CELL_LEFT + STEP_X * i;
				g.rect(cx, CELL_TOP, CELL_WIDTH, STROKE_THICKNESS)
					.rect(cx, CELL_TOP + CELL_HEIGHT, CELL_WIDTH, STROKE_THICKNESS)
					.rect(cx, CELL_TOP, STROKE_THICKNESS, CELL_HEIGHT)
					.rect(
						cx + CELL_WIDTH - STROKE_THICKNESS,
						CELL_TOP,
						STROKE_THICKNESS,
						CELL_HEIGHT + STROKE_THICKNESS,
					);
			});

			// ストライプ（WHITE）
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
				g.rect(sx, LINE_TOP + 1, LINE_STRIPE_WIDTH, LINE_STRIPE_HEIGHT),
			);
			g.fill(COLORS.WHITE);

			graphicsContainer.addChild(g);
		}, [graphicsContainer, row]);

		return (
			<CanvasObjectContext
				pixiContainer={container}
				metadata={metadata}
			>
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
			</CanvasObjectContext>
		);
	},
);
