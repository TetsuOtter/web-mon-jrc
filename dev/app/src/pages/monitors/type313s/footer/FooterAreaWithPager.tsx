import type { Dispatch, SetStateAction } from "react";
import { memo, useCallback, useMemo } from "react";

import FooterArea from "./FooterArea";

import type { FooterAreaProps, FooterButtonInfo } from "./FooterArea";

export type FooterAreaWithPagerProps = {
	readonly currentPageIndex: number;
	readonly maxPageIndex: number;
	readonly setPageIndex: Dispatch<SetStateAction<number>>;
};
export default memo<FooterAreaProps & FooterAreaWithPagerProps>(
	function FooterAreaWithPager({
		buttons,
		currentPageIndex,
		maxPageIndex,
		setPageIndex,
	}) {
		const hasNextPageButton = currentPageIndex < maxPageIndex;
		const hasPrevPageButton = 0 < currentPageIndex;
		const onClickPrevPage = useCallback(() => {
			setPageIndex((prevIndex) => Math.max(0, prevIndex - 1));
		}, [setPageIndex]);
		const onClickNextPage = useCallback(() => {
			setPageIndex((prevIndex) => Math.min(maxPageIndex, prevIndex + 1));
		}, [setPageIndex, maxPageIndex]);
		const leftButtons = useMemo((): FooterButtonInfo[] => {
			const items: FooterButtonInfo[] = [];
			if (hasNextPageButton) {
				items.push({
					label: "次画面",
					isSelected: false,
					handleClick: onClickNextPage,
				});
			}
			if (hasPrevPageButton) {
				items.push({
					label: "前画面",
					isSelected: false,
					handleClick: onClickPrevPage,
				});
			}
			return items;
		}, [
			hasNextPageButton,
			hasPrevPageButton,
			onClickNextPage,
			onClickPrevPage,
		]);
		return (
			<FooterArea
				buttons={buttons}
				leftButtons={leftButtons}
			/>
		);
	}
);
