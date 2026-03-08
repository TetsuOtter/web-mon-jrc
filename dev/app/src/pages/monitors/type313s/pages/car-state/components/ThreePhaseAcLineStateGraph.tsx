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
import { COLORS, FONT_SIZE_1X } from "../../../constants";

import { IVMS_Y, IVHB_Y, IVL_Y, SIV_Y, SIV_RADIUS, MK_Y } from "./SIVLineState";
import ThreePhaseAcLineStateGraphCol, {
	BUS_LINE_Y,
	LINE_WIDTH,
	SIV_LINE_Y,
	TLK_LINE_Y,
} from "./ThreePhaseAcLineStateGraphCol";
import { HEIGHT as SWITCH_HEIGHT } from "./VerticalLineSwitchState";

const REL_Y = 161;
const HEIGHT = 176;

const LABEL_REL_X = 16;
const LABEL_WIDTH = TRAIN_FORMATION_LEFT - LABEL_REL_X - 26;

export default memo(function ThreePhaseAcLineStateGraph() {
	const carCount = useAppSelector(carCountSelector);

	return (
		<CanvasObjectGroup
			relX={0}
			relY={REL_Y}
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
				text={toWide("IvMS")}
				fillColor={COLORS.WHITE}
				maxWidthPx={LABEL_WIDTH}
				align="right"
				relX={LABEL_REL_X}
				relY={IVMS_LABEL_Y}
			/>
			<CanvasText
				text={toWide("IvHB")}
				fillColor={COLORS.WHITE}
				maxWidthPx={LABEL_WIDTH}
				align="right"
				relX={LABEL_REL_X}
				relY={IVHB_LABEL_Y}
			/>
			<CanvasText
				text={toWide("IvL")}
				fillColor={COLORS.WHITE}
				maxWidthPx={LABEL_WIDTH}
				align="right"
				relX={LABEL_REL_X}
				relY={IVL_LABEL_Y}
			/>
			<CanvasText
				text={toWide("SIV")}
				fillColor={COLORS.WHITE}
				maxWidthPx={LABEL_WIDTH}
				align="right"
				relX={LABEL_REL_X}
				relY={SIV_LABEL_Y}
			/>
			<CanvasText
				text={toWide("3phMK")}
				fillColor={COLORS.WHITE}
				maxWidthPx={LABEL_WIDTH}
				align="right"
				relX={LABEL_REL_X}
				relY={MK_LABEL_Y}
			/>
			<CanvasText
				text={toWide("TLK")}
				fillColor={COLORS.WHITE}
				maxWidthPx={LABEL_WIDTH}
				align="right"
				relX={LABEL_REL_X}
				relY={TLK_LABEL_Y}
			/>
			{Array.from({ length: carCount }, (_, i) => (
				<ThreePhaseAcLineStateGraphCol
					key={`graph-col-${i}`}
					carIndex={i}
				/>
			))}
		</CanvasObjectGroup>
	);
});

const BUS_LABEL_Y = getLabelY(BUS_LINE_Y, LINE_WIDTH);
const IVMS_LABEL_Y = getLabelY(IVMS_Y + SIV_LINE_Y, SWITCH_HEIGHT);
const IVHB_LABEL_Y = getLabelY(IVHB_Y + SIV_LINE_Y, SWITCH_HEIGHT);
const IVL_LABEL_Y = getLabelY(IVL_Y + SIV_LINE_Y, SWITCH_HEIGHT);
const SIV_LABEL_Y = getLabelY(SIV_Y + SIV_LINE_Y, SIV_RADIUS * 2);
const MK_LABEL_Y = getLabelY(MK_Y + SIV_LINE_Y, SWITCH_HEIGHT);
const TLK_LABEL_Y = getLabelY(TLK_LINE_Y, LINE_WIDTH);
function getLabelY(stateY: number, stateHeight: number) {
	return stateY + stateHeight / 2 - FONT_SIZE_1X / 2;
}
