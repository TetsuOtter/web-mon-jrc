import { memo, useCallback, useMemo, useState } from "react";

import { CanvasRect, CanvasText } from "@web-mon-jrc/canvas-renderer";

import { useAppDispatch } from "../../../../../store/hooks";
import { setDestination } from "../../../../../store/monitors/type313s/type313sSlice";
import { SHADOW_WIDTH } from "../../components/Button";
import FooterPageFrame from "../../components/FooterPageFrame";
import TextButton from "../../components/TextButton";
import { COLORS, DISPLAY_WIDTH } from "../../constants";
import { useFooterAreaWithPagerProps } from "../../footer/FooterAreaWithPagerPropsHook";
import { useWorkSettingPageMode } from "../../hooks/usePageMode";
import { ICONS } from "../../icons";
import { PAGE_TYPES } from "../pageTypes";

import DestinationCell, {
	ELEM_LIST as DEST_ELEM_LIST,
} from "./components/DestinationCell";
import SelectionGrid, {
	CELL_COUNT as GRID_CELL_COUNT,
} from "./components/SelectionGrid";
import { PAGE_NAME_MAP } from "./constants";

import type { FooterButtonInfo } from "../../footer/FooterArea";

const TOP_BG_HEIGHT = 88;

const CURRENT_TYPE_AREA_BG_X = 128;
const CURRENT_TYPE_AREA_BG_Y = 12;
const CURRENT_TYPE_AREA_BG_WIDTH = 384;
const CURRENT_TYPE_AREA_BG_HEIGHT = 64;

const CURRENT_TYPE_LABEL_X = 16;
const CURRENT_TYPE_LABEL_Y = 16;

const CURRENT_TYPE_BOX_X = 112;
const CURRENT_TYPE_BOX_Y = 6;
const CURRENT_TYPE_BOX_WIDTH = 240;
const CURRENT_TYPE_BOX_HEIGHT = 52;

const CURRENT_TYPE_DISPLAY_TEXT_X = 16;

const CONFIRM_BUTTON_X = 590;
const CONFIRM_BUTTON_Y = 29;
const CONFIRM_BUTTON_WIDTH = 90;
const CONFIRM_BUTTON_HEIGHT = 30;

const GUIDE_TEXT_X = 10;
const GUIDE_TEXT_Y = 472;

export default memo(function WorkSettingDestination() {
	const dispatch = useAppDispatch();
	const mode = useWorkSettingPageMode();
	const pagerProps = useFooterAreaWithPagerProps(
		Math.ceil(DEST_ELEM_LIST.length / GRID_CELL_COUNT) - 1,
	);
	const [selectedDestinationIndex, setSelectedDestinationIndex] =
		useState<number>();
	const selectedTypeDisplayText = useMemo(() => {
		if (selectedDestinationIndex == null) {
			return "";
		}
		const destinationName = DEST_ELEM_LIST[selectedDestinationIndex];
		if (!destinationName) {
			return "";
		}
		return `${selectedDestinationIndex + 1}.${destinationName.replace("\n", " ")}`;
	}, [selectedDestinationIndex]);
	const onClickCell = useCallback((index: number) => {
		setSelectedDestinationIndex(index);
	}, []);
	const onClickConfirm = useCallback(() => {
		if (selectedDestinationIndex != null) {
			const typeName = DEST_ELEM_LIST[selectedDestinationIndex] ?? "";
			dispatch(setDestination(typeName.replace("\n", " ")));
		}
		return true;
	}, [dispatch, selectedDestinationIndex]);
	return (
		<FooterPageFrame
			mode={mode}
			pageIcon={ICONS.WORK_SETTING_1}
			pageName={PAGE_NAME_MAP[mode]}
			footerItems={FOOTER_MENU}
			pagerProps={pagerProps}
		>
			<CanvasRect
				relX={0}
				relY={0}
				width={DISPLAY_WIDTH}
				height={TOP_BG_HEIGHT}
				fillColor={COLORS.GRAY}
			>
				<CanvasRect
					relX={CURRENT_TYPE_AREA_BG_X}
					relY={CURRENT_TYPE_AREA_BG_Y}
					width={CURRENT_TYPE_AREA_BG_WIDTH}
					height={CURRENT_TYPE_AREA_BG_HEIGHT}
					fillColor={COLORS.CYAN}
				>
					<CanvasText
						relX={CURRENT_TYPE_LABEL_X}
						relY={CURRENT_TYPE_LABEL_Y}
						text="行先表示器"
						scaleY={2}
						fillColor={COLORS.WHITE}
					/>
					<TextButton
						text={selectedTypeDisplayText}
						relX={CURRENT_TYPE_BOX_X}
						relY={CURRENT_TYPE_BOX_Y}
						width={CURRENT_TYPE_BOX_WIDTH}
						height={CURRENT_TYPE_BOX_HEIGHT}
						fillColor={COLORS.BLACK}
						textRelX={CURRENT_TYPE_DISPLAY_TEXT_X}
						textHorizontalAlign="left"
						scaleY={2}
					/>
				</CanvasRect>
				<TextButton
					text="確　認"
					relX={CONFIRM_BUTTON_X}
					relY={CONFIRM_BUTTON_Y}
					width={CONFIRM_BUTTON_WIDTH}
					height={CONFIRM_BUTTON_HEIGHT}
					shadowWidth={SHADOW_WIDTH.EXTRA_SMALL}
					onClick={onClickConfirm}
				/>
			</CanvasRect>
			<SelectionGrid
				pageIndex={pagerProps.currentPageIndex}
				onClickCell={onClickCell}
				CellComponent={DestinationCell}
			/>
			<CanvasText
				relX={GUIDE_TEXT_X}
				relY={GUIDE_TEXT_Y}
				text="行先名をタッチして選択し「確認」キーを押して下さい。（　）内は２１１系正面表示。"
				fillColor={COLORS.WHITE}
			/>
		</FooterPageFrame>
	);
});

const FOOTER_MENU = [
	{
		label: "行先設定",
		navigateTo: PAGE_TYPES.WORK_SETTING_DESTINATION,
	},
	{
		label: "戻る",
		navigateTo: PAGE_TYPES.WORK_SETTING_TOP,
	},
] as const satisfies FooterButtonInfo[];
