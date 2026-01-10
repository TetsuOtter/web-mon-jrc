import { memo } from "react";
import { useParams } from "react-router-dom";

import MonitorCanvas from "../../../components/MonitorCanvas";

import CurrentPageContext from "./components/CurrentPageContext";
import { DISPLAY_HEIGHT, DISPLAY_WIDTH } from "./constants";
import { PAGE_COMPONENTS } from "./pages/pageComponents";
import { PAGE_TYPES } from "./pages/pageTypes";

import type { PageType } from "./pages/pageTypes";

export default memo(function Type313sPage() {
	const params = useParams<{ page?: string }>();
	const currentPage = (params.page as PageType) || PAGE_TYPES.MENU;
	const PageComponent = PAGE_COMPONENTS[currentPage] ?? PAGE_COMPONENTS.MENU;

	return (
		<CurrentPageContext page={currentPage}>
			<MonitorCanvas
				width={DISPLAY_WIDTH}
				height={DISPLAY_HEIGHT}>
				<PageComponent />
			</MonitorCanvas>
		</CurrentPageContext>
	);
});
