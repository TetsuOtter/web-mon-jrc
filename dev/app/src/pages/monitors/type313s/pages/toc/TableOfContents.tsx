import { memo, useMemo } from "react";

import FooterPageFrame from "../../components/FooterPageFrame";
import { WITH_FOOTER_CONTENT_HEIGHT } from "../../constants";
import { useFooterAreaWithPagerProps } from "../../footer/FooterAreaWithPagerPropsHook";
import { useTableOfContentsPageMode } from "../../hooks/usePageMode";

import PageGroup, { BASE_WIDTH, getPageGroupHeight } from "./PageGroup";
import {
	CAR_STATE_PAGE_GROUP,
	CONDUCTOR_PAGE_GROUP,
	CORRECTION_PAGE_GROUP,
	DRIVER_PAGE_GROUP,
	FOOTER_MENU,
	OCCUPANCY_RATE_PAGE_GROUP,
	WORK_SETTING_PAGE_GROUP,
} from "./constants";

import type { PageGroupProps } from "./PageGroup";
import type { PageGroupInfo } from "./constants";

const FIRST_GROUP_TOP = 20;
const FIRST_GROUP_LEFT = 40;
const SPACING_X = 48;
const SPACING_Y = 20;

const GROUPS_PER_PAGE = 3;

export default memo(function TableOfContents() {
	const mode = useTableOfContentsPageMode();
	const pagerProps = useFooterAreaWithPagerProps(
		Math.ceil(PAGE_GROUPS.length / GROUPS_PER_PAGE) - 1,
	);
	const pageGroupsToDisplay = useMemo(() => {
		const startIndex = pagerProps.currentPageIndex * GROUPS_PER_PAGE;
		return PAGE_GROUPS.slice(startIndex, startIndex + GROUPS_PER_PAGE);
	}, [pagerProps.currentPageIndex]);
	return (
		<FooterPageFrame
			mode={mode}
			footerItems={FOOTER_MENU}
			pagerProps={pagerProps}
		>
			{pageGroupsToDisplay
				.map((groupPropsList, index) =>
					groupPropsList.map((groupProps) => (
						<PageGroup
							// eslint-disable-next-line react/no-array-index-key
							key={`group-${pagerProps.currentPageIndex}-${index}-${groupProps.title}`}
							relX={FIRST_GROUP_LEFT + index * (BASE_WIDTH + SPACING_X)}
							relY={groupProps.relY}
							title={groupProps.title}
							infoList={groupProps.infoList}
						/>
					)),
				)
				.flat()}
		</FooterPageFrame>
	);
});

const PAGE_GROUPS = createPageGroups(
	DRIVER_PAGE_GROUP,
	WORK_SETTING_PAGE_GROUP,
	CONDUCTOR_PAGE_GROUP,
	CORRECTION_PAGE_GROUP,
	CAR_STATE_PAGE_GROUP,
	OCCUPANCY_RATE_PAGE_GROUP,
);

type PageGroupPropsWithoutRelX = Omit<PageGroupProps, "relX">;
function createPageGroups(
	...groupInfoList: PageGroupInfo[]
): PageGroupPropsWithoutRelX[][] {
	let currentTop = FIRST_GROUP_TOP;

	const result: PageGroupPropsWithoutRelX[][] = [[]];
	for (const groupInfo of groupInfoList) {
		const groupHeight =
			getPageGroupHeight(groupInfo.infoList.length) + SPACING_Y;
		const currentBottom = currentTop + groupHeight;
		if (WITH_FOOTER_CONTENT_HEIGHT < currentBottom) {
			if (currentTop === FIRST_GROUP_TOP) {
				console.error("表示が収まりきりません", {
					groupInfo,
					groupHeight,
					currentTop,
					currentBottom,
				});
				throw new Error("表示が収まりきりません");
			}
			currentTop = FIRST_GROUP_TOP;
			result.push([]);
		}

		const groupProps: PageGroupPropsWithoutRelX = {
			relY: currentTop,
			title: groupInfo.title,
			infoList: groupInfo.infoList,
		};

		result[result.length - 1].push(groupProps);

		currentTop += groupHeight;
	}

	return result;
}
