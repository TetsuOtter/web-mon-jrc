import { memo } from "react";

import { CanvasCircle } from "@web-mon-jrc/canvas-renderer";

import FooterPageFrame from "../../components/FooterPageFrame";
import LocationLabel from "../../components/LocationLabel";
import TextButton from "../../components/TextButton";
import { COLORS } from "../../constants";
import { useCorrectionPageMode } from "../../hooks/usePageMode";
import { PAGE_TYPES } from "../pageTypes";
import { usePageNavigationTo } from "../usePageNavigation";

import type { FooterButtonInfo } from "../../footer/FooterArea";

const CIRCLE_RADIUS = 104;
const LEFT_CIRCLE_X = 120;
const RIGHT_CIRCLE_X = 472;
const CIRCLE_Y = 160;

const BUTTON_WIDTH = 96;
const BUTTON_HEIGHT = 52;

const BUTTON_REL_X = CIRCLE_RADIUS - BUTTON_WIDTH / 2;
const BUTTON_REL_Y = CIRCLE_RADIUS - BUTTON_HEIGHT / 2;

export default memo(function CorrectionMenu() {
	const mode = useCorrectionPageMode();
	const handleCorrectionTimeClick = usePageNavigationTo(
		PAGE_TYPES.CORRECTION_TIME,
	);
	const handleCorrectionLoadWeightClick = usePageNavigationTo(
		PAGE_TYPES.CORRECTION_LOAD_WEIGHT,
	);

	return (
		<FooterPageFrame
			mode={mode}
			footerItems={FOOTER_MENU}
		>
			<LocationLabel />

			<CanvasCircle
				centerRelX={LEFT_CIRCLE_X + CIRCLE_RADIUS}
				centerRelY={CIRCLE_Y + CIRCLE_RADIUS}
				radius={CIRCLE_RADIUS}
				fillColor={COLORS.GRAY}
			>
				<TextButton
					relX={BUTTON_REL_X}
					relY={BUTTON_REL_Y}
					width={BUTTON_WIDTH}
					height={BUTTON_HEIGHT}
					text="時刻設定"
					scaleY={2}
					onClick={handleCorrectionTimeClick}
				/>
			</CanvasCircle>
			<CanvasCircle
				centerRelX={RIGHT_CIRCLE_X + CIRCLE_RADIUS}
				centerRelY={CIRCLE_Y + CIRCLE_RADIUS}
				radius={CIRCLE_RADIUS}
				fillColor={COLORS.GRAY}
			>
				<TextButton
					relX={BUTTON_REL_X}
					relY={BUTTON_REL_Y}
					width={BUTTON_WIDTH}
					height={BUTTON_HEIGHT}
					text="乗車率体重"
					scaleY={2}
					onClick={handleCorrectionLoadWeightClick}
				/>
			</CanvasCircle>
		</FooterPageFrame>
	);
});

const FOOTER_MENU = [
	{
		label: "補正ﾒﾆｭｰ",
		navigateTo: PAGE_TYPES.CORRECTION_MENU,
		queryParams: { mode: "CORRECTION" },
	},
	{
		label: "メニュー",
		navigateTo: PAGE_TYPES.MENU,
		queryParams: { mode: "MENU" },
	},
] as const satisfies FooterButtonInfo[];
