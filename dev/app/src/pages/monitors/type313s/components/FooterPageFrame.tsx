import type { PropsWithChildren } from "react";
import { memo } from "react";

import CanvasObjectGroup from "../../../../canvas-renderer/objects/CanvasObjectGroup";
import {
	DISPLAY_HEIGHT,
	DISPLAY_WIDTH,
	FOOTER_HEIGHT,
	HEADER_HEIGHT,
} from "../constants";
import FooterArea from "../footer/FooterArea";

import type { FooterButtonInfo } from "../footer/FooterArea";

type FooterPageFrameProps = {
	readonly footerItems: FooterButtonInfo[];
};

export default memo<PropsWithChildren<FooterPageFrameProps>>(
	function FooterPageFrame({ footerItems, children }) {
		return (
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
				<FooterArea buttons={footerItems} />
			</CanvasObjectGroup>
		);
	}
);
