import { createHashRouter, createBrowserRouter } from "react-router-dom";

import ErrorPage from "./pages/error/ErrorPage";
import { ROUTES_LIST } from "./router-paths";

// GitHub PagesではハッシュベースルーティングXを使用
// VITE_USE_HASH_ROUTER=true の場合はハッシュベース、それ以外はパスベース
const useHashRouter = import.meta.env.VITE_USE_HASH_ROUTER === "true";

const routeConfig = ROUTES_LIST.map(({ path, Element }) => ({
	path,
	element: <Element />,
	errorElement: path === "/" ? <ErrorPage /> : undefined,
}));

export const router = useHashRouter
	? createHashRouter(routeConfig)
	: createBrowserRouter(routeConfig, { basename: import.meta.env.BASE_URL });
