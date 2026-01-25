import { memo, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";

import MonitorCanvas from "../../../components/MonitorCanvas";

import CurrentPageContext, {
	useCurrentPageType,
} from "./components/CurrentPageContext";
import NavigationHistoryProvider from "./components/NavigationHistoryContext";
import { DISPLAY_HEIGHT, DISPLAY_WIDTH } from "./constants";
import { PAGE_COMPONENTS } from "./pages/pageComponents";
import { isValidPageType, PAGE_TYPES } from "./pages/pageTypes";
import { usePageNavigationTo } from "./pages/usePageNavigation";

export default memo(function Type313sPage() {
	const page = (useParams<{ page?: string }>()?.page ?? "").toUpperCase();
	const currentPage = useMemo(() => {
		return isValidPageType(page) ? page : PAGE_TYPES.MENU;
	}, [page]);

	return (
		<NavigationHistoryProvider>
			<CurrentPageContext page={currentPage}>
				<Type313sPageImpl page={page} />
			</CurrentPageContext>
		</NavigationHistoryProvider>
	);
});

type Type313sPageImplProps = {
	page: string;
};
// eslint-disable-next-line react/no-multi-comp
const Type313sPageImpl = memo<Type313sPageImplProps>(function Type313sPageImpl({
	page,
}) {
	const navigateToMenu = usePageNavigationTo(PAGE_TYPES.MENU);
	useEffect(() => {
		if (!isValidPageType(page)) {
			navigateToMenu();
		}
	}, [navigateToMenu, page]);

	const currentPage = useCurrentPageType();
	const PageComponent = PAGE_COMPONENTS[currentPage];
	return (
		<MonitorCanvas
			width={DISPLAY_WIDTH}
			height={DISPLAY_HEIGHT}>
			<PageComponent />
		</MonitorCanvas>
	);
});
