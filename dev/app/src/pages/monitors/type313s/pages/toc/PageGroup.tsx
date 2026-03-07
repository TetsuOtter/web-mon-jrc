import { memo, useMemo } from "react";

import {
	CanvasObjectGroup,
	CanvasRoundedRect,
	CanvasText,
} from "@web-mon-jrc/canvas-renderer/objects";

import { SHADOW_WIDTH } from "../../components/Button";
import TextButton from "../../components/TextButton";
import { COLORS } from "../../constants";
import {
	usePageNavigationTo,
	type NavigationQueryParams,
} from "../usePageNavigation";

import type { PageType } from "../pageTypes";

const TITLE_HEIGHT = 24;
const TITLE_WIDTH = 96;

const BUTTON_MARGIN_TOP_FROM_TITLE = 20;
const BUTTON_MARGIN_FROM_BASE_TOP =
	BUTTON_MARGIN_TOP_FROM_TITLE + TITLE_HEIGHT / 2;
const BUTTON_HEIGHT = 32;
const BUTTON_WIDTH = 128;
const BUTTON_LEFT = 64;

const BUTTON_SPACING_Y = 8;
const BUTTON_MARGIN_BOTTOM = 16;

const BASE_TOP = TITLE_HEIGHT / 2;
export const BASE_WIDTH = 208;

const TITLE_LEFT = (BASE_WIDTH - TITLE_WIDTH) / 2;

export type PageInfo = {
	title: string;
	pageType: PageType;
	params?: NavigationQueryParams;
};

export type PageGroupProps = {
	relX: number;
	relY: number;
	title: string;
	infoList: PageInfo[];
};
export default memo<PageGroupProps>(function PageGroup({
	relX,
	relY,
	title,
	infoList,
}) {
	const baseHeight = useMemo(
		() => getPageGroupHeight(infoList.length),
		[infoList.length],
	);
	return (
		<CanvasObjectGroup
			relX={relX}
			relY={relY}
			width={BASE_WIDTH}
			height={baseHeight}
		>
			<CanvasRoundedRect
				relX={0}
				relY={BASE_TOP}
				width={BASE_WIDTH}
				height={baseHeight - BASE_TOP}
				radius={8}
				fillColor={COLORS.GRAY}
			>
				{infoList.map((info, index) => (
					<PageButtonRow
						key={info.title}
						info={info}
						rowIndex={index}
					/>
				))}
			</CanvasRoundedRect>
			<CanvasRoundedRect
				relX={TITLE_LEFT}
				relY={0}
				width={TITLE_WIDTH}
				height={TITLE_HEIGHT}
				radius={TITLE_HEIGHT / 2}
				fillColor={COLORS.BLUE}
			>
				<CanvasText
					text={title}
					relX={0}
					relY={0}
					align="center"
					verticalAlign="center"
					fillColor={COLORS.WHITE}
				/>
			</CanvasRoundedRect>
		</CanvasObjectGroup>
	);
});

type PageItemProps = {
	info: PageInfo;
	rowIndex: number;
};
// eslint-disable-next-line react/no-multi-comp
const PageButtonRow = memo<PageItemProps>(function PageButtonRow({
	info,
	rowIndex,
}) {
	const handleClick = usePageNavigationTo(info.pageType, info.params);
	const relY =
		BUTTON_MARGIN_FROM_BASE_TOP + rowIndex * (BUTTON_HEIGHT + BUTTON_SPACING_Y);
	return (
		<>
			<CanvasText
				text={`${rowIndex + 1}.`}
				relX={0}
				relY={relY}
				maxHeightPx={BUTTON_HEIGHT}
				maxWidthPx={BUTTON_LEFT}
				align="right"
				fillColor={COLORS.BLACK}
				scaleX={2}
				scaleY={2}
			/>
			<TextButton
				text={info.title}
				width={BUTTON_WIDTH}
				height={BUTTON_HEIGHT}
				relX={BUTTON_LEFT}
				relY={relY}
				onClick={handleClick}
				shadowWidth={SHADOW_WIDTH.EXTRA_SMALL}
			/>
		</>
	);
});

export function getPageGroupHeight(itemCount: number) {
	return (
		TITLE_HEIGHT +
		BUTTON_MARGIN_TOP_FROM_TITLE +
		itemCount * BUTTON_HEIGHT +
		(itemCount - 1) * BUTTON_SPACING_Y +
		BUTTON_MARGIN_BOTTOM
	);
}
