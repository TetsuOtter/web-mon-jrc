import type { Dispatch, SetStateAction } from "react";
import { memo, useCallback } from "react";

import FooterArea from "./FooterArea";
import FooterSW from "./FooterSW";

import type { FooterAreaProps } from "./FooterArea";

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
		return (
			<FooterArea buttons={buttons}>
				{hasNextPageButton && (
					<FooterSW
						key="nextPage"
						align="left"
						col={0}
						text="次画面"
						onClick={onClickNextPage}
					/>
				)}
				{hasPrevPageButton && (
					<FooterSW
						key="prevPage"
						align="left"
						col={hasNextPageButton ? 1 : 0}
						text="前画面"
						onClick={onClickPrevPage}
					/>
				)}
			</FooterArea>
		);
	}
);
