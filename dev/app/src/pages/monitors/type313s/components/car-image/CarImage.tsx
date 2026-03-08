import { memo, useCallback, useEffect, useMemo } from "react";

import { CanvasText } from "@web-mon-jrc/canvas-renderer";
import CanvasObjectContext from "@web-mon-jrc/canvas-renderer/contexts/CanvasObjectContext";
import {
	usePixiObject,
	clearContainer,
} from "@web-mon-jrc/canvas-renderer/hooks/usePixiObject";
import { Graphics, Sprite, Texture } from "pixi.js";

import { toWide } from "../../../../../utils/toWide";
import { COLORS, FONT_SIZE_1X } from "../../constants";

import { getBaseCarImage } from "./baseCarImageCache";
import { getBogieImage } from "./bogieImageCache";
import {
	CAB_BORDER,
	CAB_INNER,
	CAB_WIDTH,
	CAB_Y,
	FLOOR_Y,
	HEIGHT,
	LEFT_CAB_PATTERN,
	RIGHT_CAB_CLIFF_COL,
	RIGHT_CAB_PATTERN,
	ROOF_HEIGHT,
	ROOF_Y,
	SEPARATOR_Y,
	WIDTH,
} from "./constants";

import type { CarImageBogieInfo, BaseCarImageInfo } from "./types";
import type {
	ClickEventHandler,
	ClickDetector,
} from "@web-mon-jrc/canvas-renderer/contexts/CanvasObjectContext";

const CAR_NUMBER_HEIGHT = FONT_SIZE_1X + 2;

type CarImageProps = {
	relX: number;
	relY: number;

	baseInfo: BaseCarImageInfo;
	bogieInfo: CarImageBogieInfo;

	roofBackgroundColor?: string;
	bodyBackgroundColor?: string;
	carType?: string;
	carNumber: number;

	onClick?: ClickEventHandler;
};

export default memo<CarImageProps>(function CarImage({
	relX,
	relY,
	baseInfo,
	bogieInfo,
	roofBackgroundColor,
	bodyBackgroundColor,
	carType,
	carNumber,
	onClick,
}) {
	const baseImage = useMemo(() => getBaseCarImage(baseInfo), [baseInfo]);
	const bogieImage = useMemo(() => getBogieImage(bogieInfo), [bogieInfo]);

	const isClickDetector: ClickDetector = useCallback(
		(clickX: number, clickY: number) => {
			return clickX >= 0 && clickX < WIDTH && clickY >= 0 && clickY < HEIGHT;
		},
		[],
	);

	const { container, graphicsContainer, metadata } = usePixiObject({
		relX,
		relY,
		width: WIDTH,
		height: HEIGHT + CAR_NUMBER_HEIGHT,
		onClick,
		isClickDetector,
	});

	useEffect(() => {
		if (graphicsContainer.destroyed) return;
		clearContainer(graphicsContainer);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const baseSprite = new Sprite(Texture.from(baseImage as any));
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const bogieSprite = new Sprite(Texture.from(bogieImage as any));
		graphicsContainer.addChild(baseSprite);
		graphicsContainer.addChild(bogieSprite);

		if (roofBackgroundColor) {
			const g = new Graphics();
			if (baseInfo.isLeftCab) {
				for (let row = 0; row < LEFT_CAB_PATTERN.length; row++) {
					const patternRow = LEFT_CAB_PATTERN[row];
					const startCol = patternRow.findIndex((cell) => cell === CAB_INNER);
					if (0 <= startCol) {
						g.rect(startCol, CAB_Y + row, CAB_WIDTH - startCol - CAB_BORDER, 1);
					}
				}
			} else if (baseInfo.isRightCab) {
				for (let row = 0; row < RIGHT_CAB_PATTERN.length; row++) {
					const patternRow = RIGHT_CAB_PATTERN[row];
					const endCol =
						patternRow.length -
						[...patternRow].reverse().findIndex((cell) => cell === CAB_INNER);
					if (0 <= endCol && endCol < patternRow.length) {
						g.rect(
							RIGHT_CAB_CLIFF_COL + CAB_BORDER,
							CAB_Y + row,
							endCol - CAB_BORDER,
							1,
						);
					}
				}
			}
			g.rect(
				CAB_BORDER,
				ROOF_Y + CAB_BORDER,
				WIDTH - CAB_BORDER * 2,
				ROOF_HEIGHT - 1,
			).fill(roofBackgroundColor);
			graphicsContainer.addChild(g);
		}

		if (bodyBackgroundColor) {
			const g = new Graphics();
			g.rect(
				CAB_BORDER,
				SEPARATOR_Y + CAB_INNER,
				WIDTH - CAB_BORDER * 2,
				FLOOR_Y - SEPARATOR_Y - CAB_INNER - CAB_BORDER,
			).fill(bodyBackgroundColor);
			graphicsContainer.addChild(g);
		}
	}, [
		graphicsContainer,
		baseImage,
		bogieImage,
		roofBackgroundColor,
		bodyBackgroundColor,
		baseInfo.isLeftCab,
		baseInfo.isRightCab,
	]);

	const carNumberStr = useMemo(() => {
		if (10 <= carNumber) {
			return carNumber.toString();
		} else {
			return toWide(carNumber.toString());
		}
	}, [carNumber]);

	return (
		<CanvasObjectContext
			pixiContainer={container}
			metadata={metadata}
		>
			{carType != null && (
				<CanvasText
					key="carType"
					relX={0}
					relY={ROOF_Y + CAB_BORDER}
					align="center"
					fillColor={COLORS.WHITE}
					text={carType}
				/>
			)}
			<CanvasText
				key="carNumber"
				relX={0}
				relY={0}
				align="center"
				verticalAlign="bottom"
				fillColor={COLORS.WHITE}
				text={carNumberStr}
			/>
		</CanvasObjectContext>
	);
});
