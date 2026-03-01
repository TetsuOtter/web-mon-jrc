import { memo, useCallback, useMemo } from "react";

import { CanvasText } from "../../../../../canvas-renderer";
import CanvasObjectBase from "../../../../../canvas-renderer/objects/CanvasObjectBase";
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
	CanvasRenderFunction,
} from "../../../../../canvas-renderer/contexts/CanvasObjectContext";

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
	const onRender: CanvasRenderFunction = useCallback<CanvasRenderFunction>(
		async (ctx, metadata) => {
			const absX = Math.round(metadata.absX);
			const absY = Math.round(metadata.absY);

			ctx.imageSmoothingEnabled = false;
			ctx.drawImage(baseImage, absX, absY);
			ctx.drawImage(bogieImage, absX, absY);

			if (roofBackgroundColor) {
				ctx.fillStyle = roofBackgroundColor;
				if (baseInfo.isLeftCab) {
					for (let row = 0; row < LEFT_CAB_PATTERN.length; row++) {
						const patternRow = LEFT_CAB_PATTERN[row];
						const startCol = patternRow.findIndex((cell) => cell === CAB_INNER);
						if (0 <= startCol) {
							ctx.fillRect(
								absX + startCol,
								absY + CAB_Y + row,
								CAB_WIDTH - startCol - CAB_BORDER,
								1
							);
						}
					}
				} else if (baseInfo.isRightCab) {
					for (let row = 0; row < RIGHT_CAB_PATTERN.length; row++) {
						const patternRow = RIGHT_CAB_PATTERN[row];
						const endCol =
							patternRow.length -
							[...patternRow].reverse().findIndex((cell) => cell === CAB_INNER);
						if (0 <= endCol && endCol < patternRow.length) {
							ctx.fillRect(
								absX + RIGHT_CAB_CLIFF_COL + CAB_BORDER,
								absY + CAB_Y + row,
								endCol - CAB_BORDER,
								1
							);
						}
					}
				}
				ctx.fillRect(
					absX + CAB_BORDER,
					absY + ROOF_Y + CAB_BORDER,
					WIDTH - CAB_BORDER * 2,
					ROOF_HEIGHT - 1
				);
			}
			if (bodyBackgroundColor) {
				ctx.fillStyle = bodyBackgroundColor;
				ctx.fillRect(
					absX + CAB_BORDER,
					absY + SEPARATOR_Y + CAB_INNER,
					WIDTH - CAB_BORDER * 2,
					FLOOR_Y - SEPARATOR_Y - CAB_INNER - CAB_BORDER
				);
			}
		},
		[
			baseImage,
			bogieImage,
			roofBackgroundColor,
			bodyBackgroundColor,
			baseInfo.isLeftCab,
			baseInfo.isRightCab,
		]
	);

	const isClickDetector: ClickDetector = useCallback(
		(clickX: number, clickY: number) => {
			return clickX >= 0 && clickX < WIDTH && clickY >= 0 && clickY < HEIGHT;
		},
		[]
	);
	const carNumberStr = useMemo(() => {
		if (10 <= carNumber) {
			return carNumber.toString();
		} else {
			return toWide(carNumber.toString());
		}
	}, [carNumber]);

	return (
		<CanvasObjectBase
			onRender={onRender}
			onClick={onClick}
			isClickDetector={isClickDetector}
			relX={relX}
			relY={relY}
			width={WIDTH}
			height={HEIGHT + CAR_NUMBER_HEIGHT}
			isFilled>
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
		</CanvasObjectBase>
	);
});
