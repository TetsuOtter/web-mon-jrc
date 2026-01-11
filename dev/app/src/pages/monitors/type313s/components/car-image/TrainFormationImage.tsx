import { memo } from "react";

import CanvasObjectGroup from "../../../../../canvas-renderer/objects/CanvasObjectGroup";

import CarImage, {
	WIDTH as CAR_IMAGE_WIDTH,
	HEIGHT as CAR_IMAGE_HEIGHT,
} from "./CarImage";

import type { BaseCarImageInfo } from "./baseCarImageCache";
import type { CarImageBogieInfo } from "./bogieImageCache";

const TOP = 50;
const LEFT = 194;

type TrainFormationImageProps = {
	infoList: {
		key: string;
		baseInfo: BaseCarImageInfo;
		bogieInfo: CarImageBogieInfo;
		roofBackgroundColor?: string;
		bodyBackgroundColor?: string;
	}[];
};
export default memo<TrainFormationImageProps>(function TrainFormationImage({
	infoList,
}) {
	return (
		<CanvasObjectGroup
			relX={LEFT}
			relY={TOP}
			width={CAR_IMAGE_WIDTH * infoList.length}
			height={CAR_IMAGE_HEIGHT}>
			{infoList.map((info, index) => (
				<CarImage
					key={info.key}
					relX={CAR_IMAGE_WIDTH * index}
					relY={0}
					baseInfo={info.baseInfo}
					bogieInfo={info.bogieInfo}
					roofBackgroundColor={info.roofBackgroundColor}
					bodyBackgroundColor={info.bodyBackgroundColor}
				/>
			))}
		</CanvasObjectGroup>
	);
});
