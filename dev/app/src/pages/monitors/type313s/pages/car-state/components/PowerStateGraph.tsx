import { memo } from "react";

import {
	CanvasObjectGroup,
	CanvasText,
} from "@web-mon-jrc/canvas-renderer/objects";

import { useAppSelector } from "../../../../../../store/hooks";
import { carCountSelector } from "../../../../../../store/monitors/type313s/type313sSelector";
import { toWide } from "../../../../../../utils/toWide";
import { LEFT as TRAIN_FORMATION_LEFT } from "../../../components/car-image/TrainFormationImage";
import { WIDTH as CAR_IMAGE_WIDTH } from "../../../components/car-image/constants";
import { COLORS } from "../../../constants";

import PowerStateGraphCol from "./PowerStateGraphCol";
import {
	BUS_LABEL_Y,
	GRAPH_REL_Y,
	HB_LABEL_Y,
	LABEL_REL_X,
	LABEL_WIDTH,
	LB1_LABEL_Y,
	LB23_LABEL_Y,
} from "./constants";

const HEIGHT = 176;

export default memo(function ThreePhaseAcLineStateGraph() {
	const carCount = useAppSelector(carCountSelector);

	return (
		<CanvasObjectGroup
			relX={0}
			relY={GRAPH_REL_Y}
			width={TRAIN_FORMATION_LEFT + carCount * CAR_IMAGE_WIDTH}
			height={HEIGHT}
		>
			<CanvasText
				text="高圧母線"
				fillColor={COLORS.WHITE}
				maxWidthPx={LABEL_WIDTH}
				relX={LABEL_REL_X}
				relY={BUS_LABEL_Y}
			/>
			<CanvasText
				text={`(${toWide("BUS")})`}
				fillColor={COLORS.WHITE}
				maxWidthPx={LABEL_WIDTH}
				align="right"
				relX={LABEL_REL_X}
				relY={BUS_LABEL_Y}
			/>
			<CanvasText
				text={toWide("HB")}
				fillColor={COLORS.WHITE}
				maxWidthPx={LABEL_WIDTH}
				align="right"
				relX={LABEL_REL_X}
				relY={HB_LABEL_Y}
			/>
			<CanvasText
				text={toWide("LB1")}
				fillColor={COLORS.WHITE}
				maxWidthPx={LABEL_WIDTH}
				align="right"
				relX={LABEL_REL_X}
				relY={LB1_LABEL_Y}
			/>
			<CanvasText
				text={toWide("LB2/LB3")}
				fillColor={COLORS.WHITE}
				maxWidthPx={LABEL_WIDTH}
				align="right"
				relX={LABEL_REL_X}
				relY={LB23_LABEL_Y}
			/>
			{Array.from({ length: carCount }, (_, i) => (
				<PowerStateGraphCol
					key={`graph-col-${i}`}
					carIndex={i}
				/>
			))}
		</CanvasObjectGroup>
	);
});
