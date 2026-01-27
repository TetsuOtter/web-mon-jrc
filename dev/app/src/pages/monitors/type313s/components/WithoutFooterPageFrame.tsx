import type { PropsWithChildren } from "react";
import { memo } from "react";

import { useCanvasObjectContext } from "../../../../canvas-renderer/contexts/CanvasObjectContext";
import CanvasObjectGroup from "../../../../canvas-renderer/objects/CanvasObjectGroup";
import { DISPLAY_HEIGHT, DISPLAY_WIDTH, HEADER_HEIGHT } from "../constants";
import HeaderArea from "../header/HeaderArea";

import { useCurrentPageType } from "./CurrentPageContext";
import { ICON_MAP_BY_MODE, PAGE_NAME_MAP } from "./constants";

import type { PageMode } from "../pages/pageTypes";

type WithoutFooterPageFrameProps = {
	readonly mode: PageMode;
};

export default memo<PropsWithChildren<WithoutFooterPageFrameProps>>(
	function WithoutFooterPageFrame({ mode, children }) {
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
					{children}
				</CanvasObjectGroup>
			</CanvasObjectGroup>
		);
	}
);
