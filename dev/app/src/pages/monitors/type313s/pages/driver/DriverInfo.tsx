import { memo } from "react";

import { CanvasLine, CanvasText } from "../../../../../canvas-renderer";
import CanvasObjectGroup from "../../../../../canvas-renderer/objects/CanvasObjectGroup";
import FooterPageFrame from "../../components/FooterPageFrame";
import LocationLabel from "../../components/LocationLabel";
import TrainFormationImage from "../../components/car-image/TrainFormationImage";
import { BOGIE_STATE } from "../../components/car-image/bogieImageCache";
import {
	COLORS,
	DISPLAY_WIDTH,
	FONT_SIZE_1X,
	WITH_FOOTER_CONTENT_HEIGHT,
} from "../../constants";
import { useDriverPageMode } from "../../hooks/usePageMode";

import { FOOTER_MENU } from "./constants";

import type { BaseCarImageInfo } from "../../components/car-image/baseCarImageCache";
import type { CarImageBogieInfo } from "../../components/car-image/bogieImageCache";

const LOWER_BOX_HEIGHT = FONT_SIZE_1X * 3;
const LOWER_BOX_Y = WITH_FOOTER_CONTENT_HEIGHT - LOWER_BOX_HEIGHT;
const LOWER_BOX_SEPARATOR_LEFT = 160;

const INSTRUCTION_LABEL_X = 4;
const INSTRUCTION_LABEL_Y = 180;

const SAMPLE_TRAIN_FORMATION: {
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

export default memo(function DriverInfo() {
	const mode = useDriverPageMode();
	return (
		<FooterPageFrame
			mode={mode}
			footerItems={FOOTER_MENU}>
			<LocationLabel locationKm={0.0} />

			<TrainFormationImage infoList={SAMPLE_TRAIN_FORMATION} />

			<CanvasText
				relX={INSTRUCTION_LABEL_X}
				relY={INSTRUCTION_LABEL_Y}
				text="項目名にタッチ　→　処置表示"
				fillColor={COLORS.WHITE}
			/>

			<CanvasObjectGroup
				relX={0}
				relY={LOWER_BOX_Y}
				width={DISPLAY_WIDTH}
				height={LOWER_BOX_HEIGHT}>
				<CanvasLine
					relX1={0}
					relY1={0}
					relX2={DISPLAY_WIDTH}
					relY2={0}
					color={COLORS.WHITE}
				/>
				<CanvasLine
					relX1={LOWER_BOX_SEPARATOR_LEFT}
					relY1={0}
					relX2={LOWER_BOX_SEPARATOR_LEFT}
					relY2={LOWER_BOX_HEIGHT}
					color={COLORS.WHITE}
				/>
				<CanvasText
					relX={0}
					relY={1}
					maxWidthPx={LOWER_BOX_SEPARATOR_LEFT}
					text="次停車駅"
					fillColor={COLORS.WHITE}
					align="center"
				/>
			</CanvasObjectGroup>
		</FooterPageFrame>
	);
});
