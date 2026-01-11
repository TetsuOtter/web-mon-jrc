import { memo, useMemo } from "react";

import { FONT_SIZE_1X } from "../constants";

const HEIGHT = 60;
const WIDTH = 48;

const CAB_Y = 1;
const ROOF_Y = 11;
const SEPARATOR_Y = ROOF_Y + FONT_SIZE_1X;
const SEPARATOR_HEIGHT = 2;
const CAB_WIDTH = 25;
const CAR_BOARDER_ROW_COUNT = ROOF_Y - CAB_Y + 1;
const RIGHT_CAB_CLIFF_COL = WIDTH - CAB_WIDTH;

type BaseCarImageInfo = {
	isLeftCab: boolean;
	isRightCab: boolean;

	hasLeftPantograph: boolean;
	hasRightPantograph: boolean;

	isLeftBogieMotored: boolean;
	isRightBogieMotored: boolean;
};
const BaseCarImageCache = new Map<string, OffscreenCanvas>();

type CarImageProps = {
	relX: number;
	relY: number;

	baseInfo: BaseCarImageInfo;

	roofBackgroundColor?: string;
	roofTextColor?: string;
	bodyBackgroundColor?: string;
	bodyTextColor?: string;
};
export default memo<CarImageProps>(function CarImage({
	relX,
	relY,
	baseInfo,
	roofBackgroundColor,
	roofTextColor,
	bodyBackgroundColor,
	bodyTextColor,
}) {
	const baseCarImageKey = useMemo(
		() => getBaseCarImageInfoKey(baseInfo),
		[baseInfo]
	);
	return <div>Type 313s Car Image Component</div>;
});

function getBaseCarImageInfoKey(info: BaseCarImageInfo): string {
	if (info.isLeftCab && info.isRightCab) {
		throw new Error("A car cannot have both left and right cabs");
	}
	const cabKey = info.isLeftCab ? "L" : info.isRightCab ? "R" : "N";
	return [
		cabKey,
		info.hasLeftPantograph ? "1" : "0",
		info.hasRightPantograph ? "1" : "0",
		info.isLeftBogieMotored ? "1" : "0",
		info.isRightBogieMotored ? "1" : "0",
	].join("");
}

function useBaseCarImage(info: BaseCarImageInfo) {
	const baseCarImageKey = useMemo(() => getBaseCarImageInfoKey(info), [info]);

	return useMemo(() => {
		let canvas = BaseCarImageCache.get(baseCarImageKey);
		if (canvas) {
			return canvas;
		}

		canvas = new OffscreenCanvas(WIDTH, HEIGHT);
		const ctx = canvas.getContext("2d");
		if (!ctx) {
			throw new Error("Failed to get 2D context for base car image");
		}

		// Drawing logic would go here

		BaseCarImageCache.set(baseCarImageKey, canvas);
		return canvas;
	}, [baseCarImageKey]);
}

function drawLeftCab(ctx: OffscreenCanvasRenderingContext2D) {
	// Drawing logic for left cab would go here
}
