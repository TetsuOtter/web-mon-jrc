import { createBrowserRouter } from "react-router-dom";

import ErrorPage from "./pages/error/ErrorPage";
import { ROUTES_LIST } from "./router-paths";

export const router = createBrowserRouter(
	ROUTES_LIST.map(({ path, Element }) => ({
		path,
		element: <Element />,
		errorElement: path === "/" ? <ErrorPage /> : undefined,
	}))
);
