import { memo, useCallback, useMemo } from "react";

import CanvasObjectBase from "../../../../../canvas-renderer/objects/CanvasObjectBase";
import { FONT_SIZE_1X } from "../../constants";

import { getBaseCarImage } from "./baseCarImageCache";
import { getBogieImage } from "./bogieImageCache";

import type {
	ClickEventHandler,
	ClickDetector,
	CanvasRenderFunction,
} from "../../../../../canvas-renderer/contexts/CanvasObjectContext";

const HEIGHT = 60;
const WIDTH = 48;

const ROOF_Y = 11;
const SEPARATOR_Y = ROOF_Y + FONT_SIZE_1X;
const CAB_WIDTH = 25;

type BaseCarImageInfo = {
	isLeftCab: boolean;
	isRightCab: boolean;

	hasLeftPantograph: boolean;
	hasRightPantograph: boolean;
};

type CarImageProps = {
	relX: number;
	relY: number;

	baseInfo: BaseCarImageInfo;

	isLeftBogieMotored: boolean;
	isRightBogieMotored: boolean;

	roofBackgroundColor?: string;
	bodyBackgroundColor?: string;

	isLeftBogieMotorWorking: boolean;
	isRightBogieMotorWorking: boolean;

	onClick?: ClickEventHandler;
};

export default memo<CarImageProps>(function CarImage({
	relX,
	relY,
	baseInfo,
	isLeftBogieMotored,
	isRightBogieMotored,
	roofBackgroundColor,
	bodyBackgroundColor,
	isLeftBogieMotorWorking,
	isRightBogieMotorWorking,
	onClick,
}) {
	const baseImage = useMemo(() => getBaseCarImage(baseInfo), [baseInfo]);
	const bogieImage = useMemo(
		() =>
			getBogieImage(
				{
					isLeftBogieMotored,
					isRightBogieMotored,
				},
				{
					isLeftBogieWorking: isLeftBogieMotorWorking,
					isRightBogieWorking: isRightBogieMotorWorking,
				}
			),
		[
			isLeftBogieMotored,
			isRightBogieMotored,
			isLeftBogieMotorWorking,
			isRightBogieMotorWorking,
		]
	);
	const onRender: CanvasRenderFunction = useCallback<CanvasRenderFunction>(
		async (ctx, metadata) => {
			ctx.putImageData(
				baseImage,
				Math.round(metadata.absX),
				Math.round(metadata.absY)
			);

			// ボギーイメージを描画
			ctx.putImageData(
				bogieImage,
				Math.round(metadata.absX),
				Math.round(metadata.absY)
			);

			// 色を反映させる描画
			if (roofBackgroundColor || bodyBackgroundColor) {
				const absX = Math.round(metadata.absX);
				const absY = Math.round(metadata.absY);

				// 屋根部分の色付け
				if (roofBackgroundColor && baseInfo.isLeftCab) {
					ctx.fillStyle = roofBackgroundColor;
					ctx.fillRect(
						absX + CAB_WIDTH - 1,
						absY + ROOF_Y,
						WIDTH - CAB_WIDTH,
						FONT_SIZE_1X
					);
				} else if (roofBackgroundColor && baseInfo.isRightCab) {
					ctx.fillStyle = roofBackgroundColor;
					ctx.fillRect(absX, absY + ROOF_Y, WIDTH - CAB_WIDTH, FONT_SIZE_1X);
				} else if (roofBackgroundColor) {
					ctx.fillStyle = roofBackgroundColor;
					ctx.fillRect(absX, absY + ROOF_Y, WIDTH, FONT_SIZE_1X);
				}

				// キャブ内部の色付け
				if (bodyBackgroundColor) {
					ctx.fillStyle = bodyBackgroundColor;
					const cabStartRow = ROOF_Y + 1;
					const cabEndRow = SEPARATOR_Y;
					const cabHeight = cabEndRow - cabStartRow;
					if (baseInfo.isLeftCab) {
						ctx.fillRect(
							absX + 1,
							absY + cabStartRow,
							CAB_WIDTH - 2,
							cabHeight
						);
					} else if (baseInfo.isRightCab) {
						ctx.fillRect(
							absX + WIDTH - CAB_WIDTH + 1,
							absY + cabStartRow,
							CAB_WIDTH - 2,
							cabHeight
						);
					}
				}
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

	return (
		<CanvasObjectBase
			onRender={onRender}
			onClick={onClick}
			isClickDetector={isClickDetector}
			relX={relX}
			relY={relY}
			width={WIDTH}
			height={HEIGHT}
			isFilled>
			{/* TODO: 文字描画を実装する */}
		</CanvasObjectBase>
	);
});
