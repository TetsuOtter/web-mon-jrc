import type { FC } from "react";
import { memo } from "react";

import CanvasObjectGroup from "@web-mon-jrc/canvas-renderer/objects/CanvasObjectGroup";
import {
	useAppSelector,
	useAppSelectorWithParams,
	useAppSelectorWithParamsAndEqualityFn,
} from "../../../../../store/hooks";
import {
	carCountSelector,
	createCarStateByCarIndexSelector,
} from "../../../../../store/monitors/type313s/type313sSelector";
import { COLORS } from "../../constants";

import CarImage from "./CarImage";
import {
	WIDTH as CAR_IMAGE_WIDTH,
	HEIGHT as CAR_IMAGE_HEIGHT,
} from "./constants";
import {
	BOGIE_STATE,
	isBaseCarImageEqual,
	isCarImageBogieInfoEqual,
} from "./types";

import type { CarImageBogieInfo, BaseCarImageInfo } from "./types";
import type { ColorValue } from "../../constants";

const TOP = 50;
export const LEFT = 194;

export default memo(function TrainFormationImage() {
	const carCount = useAppSelector(carCountSelector);

	return (
		<CanvasObjectGroup
			relX={LEFT}
			relY={TOP}
			width={CAR_IMAGE_WIDTH * carCount}
			height={CAR_IMAGE_HEIGHT}>
			{Array.from({ length: carCount }, (_, index) => (
				<CarImageByCarIndex
					key={index}
					carIndex={index}
				/>
			))}
		</CanvasObjectGroup>
	);
});

type CarImageByCarIndexProps = {
	readonly carIndex: number;
};
// eslint-disable-next-line react/no-multi-comp
const CarImageByCarIndex: FC<CarImageByCarIndexProps> = ({ carIndex }) => {
	const baseInfo = useAppSelectorWithParamsAndEqualityFn(
		baseInfoSelector,
		isBaseCarImageEqual,
		carIndex
	);
	const bogieInfo = useAppSelectorWithParamsAndEqualityFn(
		bogieInfoSelector,
		isCarImageBogieInfoEqual,
		carIndex
	);
	const roofBackgroundColor = useAppSelectorWithParams(
		roofBackgroundColorSelector,
		carIndex
	);
	const carType = useAppSelectorWithParams(carTypeSelector, carIndex);
	const carNumber = useAppSelectorWithParams(carNumberSelector, carIndex);
	return (
		<CarImage
			relX={CAR_IMAGE_WIDTH * carIndex}
			relY={0}
			baseInfo={baseInfo}
			bogieInfo={bogieInfo}
			roofBackgroundColor={roofBackgroundColor}
			carType={carType}
			carNumber={carNumber}
		/>
	);
};

const baseInfoSelector = createCarStateByCarIndexSelector<BaseCarImageInfo>(
	(carState) => ({
		isLeftCab: carState.cabState?.side === "left",
		isRightCab: carState.cabState?.side === "right",
		hasLeftPantograph: carState.hasLeftPantograph ?? false,
		hasRightPantograph: carState.hasRightPantograph ?? false,
	})
);
const bogieInfoSelector = createCarStateByCarIndexSelector<CarImageBogieInfo>(
	(carState) => ({
		left:
			carState.bogieState?.left != null
				? BOGIE_STATE.MOTORED
				: BOGIE_STATE.NONE,
		right:
			carState.bogieState?.right != null
				? BOGIE_STATE.MOTORED
				: BOGIE_STATE.NONE,
	})
);
const roofBackgroundColorSelector = createCarStateByCarIndexSelector<
	ColorValue | undefined
>((carState) => {
	if (carState.cabState?.orderedNotchCommand != null) {
		return COLORS.BLUE;
	}
	return undefined;
});
const carTypeSelector = createCarStateByCarIndexSelector(
	(carState) => carState.carType
);
const carNumberSelector = createCarStateByCarIndexSelector(
	(carState) => carState.carNumber
);
