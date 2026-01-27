import type { PropsWithChildren } from "react";
import { memo } from "react";

import { useCanvasObjectContext } from "../../../../canvas-renderer/contexts/CanvasObjectContext";
import CanvasObjectGroup from "../../../../canvas-renderer/objects/CanvasObjectGroup";
import {
	DISPLAY_HEIGHT,
	DISPLAY_WIDTH,
	FOOTER_HEIGHT,
	HEADER_HEIGHT,
} from "../constants";
import FooterArea from "../footer/FooterArea";
import FooterAreaWithPager from "../footer/FooterAreaWithPager";
import HeaderArea from "../header/HeaderArea";

import { useCurrentPageType } from "./CurrentPageContext";
import { ICON_MAP_BY_MODE, PAGE_NAME_MAP } from "./constants";

import type { FooterButtonInfo } from "../footer/FooterArea";
import type { FooterAreaWithPagerProps } from "../footer/FooterAreaWithPager";
import type { PageMode } from "../pages/pageTypes";

type FooterPageFrameProps = {
	readonly mode: PageMode;
	readonly footerItems: FooterButtonInfo[];
	// leftFooterItemsはpagerと同時には使用できない
	readonly leftFooterItems?: FooterButtonInfo[];
	readonly pagerProps?: FooterAreaWithPagerProps;
};

export default memo<PropsWithChildren<FooterPageFrameProps>>(
	function FooterPageFrame({
		mode,
		footerItems,
		leftFooterItems,
		pagerProps,
		children,
	}) {
		const pageType = useCurrentPageType();
		const parentObjectContext = useCanvasObjectContext();
		return (
			<CanvasObjectGroup
				relX={0}
				relY={0}
				width={parentObjectContext.metadata.width}
				height={parentObjectContext.metadata.height}>
				<HeaderArea
					icon={ICON_MAP_BY_MODE[mode]}
					pageName={PAGE_NAME_MAP[pageType]}
					trainNumber="1234"
					trainType="普通"
					trainDestination="大垣"
					timeMinutes={5}
				/>
				<CanvasObjectGroup
					relX={0}
					relY={HEADER_HEIGHT}
					width={DISPLAY_WIDTH}
					height={DISPLAY_HEIGHT - HEADER_HEIGHT}>
					<CanvasObjectGroup
						relX={0}
						relY={0}
						width={DISPLAY_WIDTH}
						height={DISPLAY_HEIGHT - HEADER_HEIGHT - FOOTER_HEIGHT}>
						{children}
					</CanvasObjectGroup>
					{pagerProps ? (
						<FooterAreaWithPager
							{...pagerProps}
							buttons={footerItems}
						/>
					) : (
						<FooterArea
							buttons={footerItems}
							leftButtons={leftFooterItems}
						/>
					)}
				</CanvasObjectGroup>
			</CanvasObjectGroup>
		);
	}
);
