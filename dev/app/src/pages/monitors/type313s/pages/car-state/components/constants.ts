import { LEFT as TRAIN_FORMATION_LEFT } from "../../../components/car-image/TrainFormationImage";
import { WIDTH as CAR_IMAGE_WIDTH } from "../../../components/car-image/constants";
import { FONT_SIZE_1X } from "../../../constants";

import { HEIGHT as SWITCH_HEIGHT } from "./VerticalLineSwitchState";

export const LINE_WIDTH = 2;

export const GRAPH_REL_Y = 161;

export const PAN_LINE_HEIGHT = 10;
export const BUS_LINE_Y = PAN_LINE_HEIGHT;
export const SIV_LINE_STATE_HEIGHT = 154;

export const POWER_LINE_STATE_HEIGHT = 71;

export const VERTICAL_LINE_X = (CAR_IMAGE_WIDTH - LINE_WIDTH) / 2;

export const IVMS_Y = 16;
export const IVHB_Y = 40;
export const IVL_Y = 64;
export const SIV_Y = 83;
export const MK_Y = 128;

export const HB_Y = 16;
export const LB1_Y = 32;
export const LB23_Y = 56;

export const SIV_VERTICAL_LINE_X = (CAR_IMAGE_WIDTH - LINE_WIDTH) / 2;
export const SIV_LINE_Y = BUS_LINE_Y + LINE_WIDTH;
export const SIV_RADIUS = 16;

export const TLK_LINE_Y = SIV_LINE_Y + SIV_LINE_STATE_HEIGHT;

export const POWER_LINE_Y = BUS_LINE_Y + LINE_WIDTH;

export const LABEL_REL_X = 16;
export const LABEL_WIDTH = TRAIN_FORMATION_LEFT - LABEL_REL_X - 26;

export const BUS_LABEL_Y = getLabelY(BUS_LINE_Y, LINE_WIDTH);
export const IVMS_LABEL_Y = getLabelY(IVMS_Y + SIV_LINE_Y, SWITCH_HEIGHT);
export const IVHB_LABEL_Y = getLabelY(IVHB_Y + SIV_LINE_Y, SWITCH_HEIGHT);
export const IVL_LABEL_Y = getLabelY(IVL_Y + SIV_LINE_Y, SWITCH_HEIGHT);
export const SIV_LABEL_Y = getLabelY(SIV_Y + SIV_LINE_Y, SIV_RADIUS * 2);
export const MK_LABEL_Y = getLabelY(MK_Y + SIV_LINE_Y, SWITCH_HEIGHT);
export const TLK_LABEL_Y = getLabelY(TLK_LINE_Y, LINE_WIDTH);

export const HB_LABEL_Y = getLabelY(HB_Y + POWER_LINE_Y, SWITCH_HEIGHT);
export const LB1_LABEL_Y = getLabelY(LB1_Y + POWER_LINE_Y, SWITCH_HEIGHT);
export const LB23_LABEL_Y = getLabelY(LB23_Y + POWER_LINE_Y, SWITCH_HEIGHT);

function getLabelY(stateY: number, stateHeight: number) {
	return stateY + stateHeight / 2 - FONT_SIZE_1X / 2;
}
