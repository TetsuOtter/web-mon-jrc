import { memo } from "react";

import CanvasObjectGroup from "../../../../../canvas-renderer/objects/CanvasObjectGroup";

import CarImage, {
	WIDTH as CAR_IMAGE_WIDTH,
	HEIGHT as CAR_IMAGE_HEIGHT,
} from "./CarImage";
import { BOGIE_STATE } from "./bogieImageCache";

import type { BaseCarImageInfo } from "./baseCarImageCache";
import type { CarImageBogieInfo } from "./bogieImageCache";

const TOP = 50;
const LEFT = 194;

export const SAMPLE_TRAIN_FORMATION: {
	key: string;
	baseInfo: BaseCarImageInfo;
	bogieInfo: CarImageBogieInfo;
}[] = [
	{
		key: "car1",
		baseInfo: {
			isLeftCab: true,
			isRightCab: false,
			hasLeftPantograph: false,
			hasRightPantograph: true,
		},
		bogieInfo: { left: BOGIE_STATE.MOTORED, right: BOGIE_STATE.MOTORED },
	},
	{
		key: "car2",
		baseInfo: {
			isLeftCab: false,
			isRightCab: false,
			hasLeftPantograph: false,
			hasRightPantograph: false,
		},
		bogieInfo: { left: BOGIE_STATE.NONE, right: BOGIE_STATE.NONE },
	},
	{
		key: "car3",
		baseInfo: {
			isLeftCab: false,
			isRightCab: false,
			hasLeftPantograph: true,
			hasRightPantograph: false,
		},
		bogieInfo: { left: BOGIE_STATE.MOTORED, right: BOGIE_STATE.MOTORED },
	},
	{
		key: "car4",
		baseInfo: {
			isLeftCab: false,
			isRightCab: true,
			hasLeftPantograph: false,
			hasRightPantograph: false,
		},
		bogieInfo: { left: BOGIE_STATE.NONE, right: BOGIE_STATE.NONE },
	},
];

export default memo(function TrainFormationImage() {
	return (
		<CanvasObjectGroup
			relX={LEFT}
			relY={TOP}
			width={CAR_IMAGE_WIDTH * SAMPLE_TRAIN_FORMATION.length}
			height={CAR_IMAGE_HEIGHT}>
			{SAMPLE_TRAIN_FORMATION.map((info, index) => (
				<CarImage
					key={info.key}
					relX={CAR_IMAGE_WIDTH * index}
					relY={0}
					baseInfo={info.baseInfo}
					bogieInfo={info.bogieInfo}
					// roofBackgroundColor={info.roofBackgroundColor}
					// bodyBackgroundColor={info.bodyBackgroundColor}
				/>
			))}
		</CanvasObjectGroup>
	);
});
