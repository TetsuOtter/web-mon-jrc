import { memo } from "react";

import { CanvasLine, CanvasText } from "../../../../../canvas-renderer";
import CanvasObjectGroup from "../../../../../canvas-renderer/objects/CanvasObjectGroup";
import FooterPageFrame from "../../components/FooterPageFrame";
import LocationLabel from "../../components/LocationLabel";
import TrainFormationImage from "../../components/car-image/TrainFormationImage";
import {
	COLORS,
	DISPLAY_WIDTH,
	FONT_SIZE_1X,
	WITH_FOOTER_CONTENT_HEIGHT,
} from "../../constants";
import { useDriverPageMode } from "../../hooks/usePageMode";

import { FOOTER_MENU } from "./constants";

const LOWER_BOX_HEIGHT = FONT_SIZE_1X * 3;
const LOWER_BOX_Y = WITH_FOOTER_CONTENT_HEIGHT - LOWER_BOX_HEIGHT;
const LOWER_BOX_SEPARATOR_LEFT = 160;

const INSTRUCTION_LABEL_X = 4;
const INSTRUCTION_LABEL_Y = 180;

export default memo(function DriverInfo() {
	const mode = useDriverPageMode();
	return (
		<FooterPageFrame
			mode={mode}
			footerItems={FOOTER_MENU}>
			<LocationLabel locationKm={0.0} />

			<TrainFormationImage />

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
