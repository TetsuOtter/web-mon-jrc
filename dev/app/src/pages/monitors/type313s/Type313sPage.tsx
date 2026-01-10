import { memo, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";

import MonitorCanvas from "../../../components/MonitorCanvas";

import CurrentPageContext from "./components/CurrentPageContext";
import { DISPLAY_HEIGHT, DISPLAY_WIDTH } from "./constants";
import { PAGE_COMPONENTS } from "./pages/pageComponents";
import { isValidPageType, PAGE_TYPES } from "./pages/pageTypes";
import { usePageNavigationTo } from "./pages/usePageNavigation";

export default memo(function Type313sPage() {
	const page = (useParams<{ page?: string }>()?.page ?? "").toUpperCase();
	const navigateToMenu = usePageNavigationTo(PAGE_TYPES.MENU);
	useEffect(() => {
		if (!isValidPageType(page)) {
			navigateToMenu();
		}
	}, [navigateToMenu, page]);

	const currentPage = useMemo(() => {
		return isValidPageType(page) ? page : PAGE_TYPES.MENU;
	}, [page]);
	const PageComponent = PAGE_COMPONENTS[currentPage];
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
