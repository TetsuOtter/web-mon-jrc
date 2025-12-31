import type { PropsWithChildren } from "react";
import { memo } from "react";

import CanvasObjectGroup from "../../../../canvas-renderer/objects/CanvasObjectGroup";
import { DISPLAY_HEIGHT, DISPLAY_WIDTH, HEADER_HEIGHT } from "../constants";

export default memo<PropsWithChildren>(function WithoutFooterPageFrame({
	children,
}) {
	return (
		<CanvasObjectGroup
			relX={0}
			relY={HEADER_HEIGHT}
			width={DISPLAY_WIDTH}
			height={DISPLAY_HEIGHT - HEADER_HEIGHT}>
			{children}
		</CanvasObjectGroup>
	);
});
