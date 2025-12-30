import type { ComponentType, LazyExoticComponent } from "react";
import { lazy } from "react";

export type RouterPath = {
	path: string;
	Element: LazyExoticComponent<ComponentType>;
	pathParams?: Record<string, (string | string[])[]>;
	pathParamLabels?: Record<string, Record<string, string>>;
};

export const ROUTES = {
	INDEX: {
		path: "/",
		Element: lazy(() => import("./pages/index/IndexPage")),
	},
	SETTINGS: {
		path: "/setting",
		Element: lazy(() => import("./pages/settings/SettingsPage")),
	},
	CANVAS_DEMO: {
		path: "/canvas-demo",
		Element: lazy(() => import("./pages/canvas-demo/CanvasDemoPage")),
	},

	TYPE313S: {
		path: "/monitors/type313s",
		Element: lazy(() => import("./pages/monitors/type313s/Type313sPage")),
	},
	TYPE313V: {
		path: "/monitors/type313v",
		Element: lazy(() => import("./pages/monitors/type313v/Type313vPage")),
	},
} as const satisfies Record<string, RouterPath>;

export const ROUTES_LIST = Object.values(ROUTES);
