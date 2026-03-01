import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { Provider } from "react-redux";

import { router } from "./router";
import {
	setCurrentLocation,
	setTimeMs,
} from "./store/monitors/type313s/type313sSlice";
import { store } from "./store/store";

type BidsStatePayload = {
	time_ms: number;
	location_m: number;
};

// Tauri環境でのみ BIDS連携を有効化
const isTauriApp = typeof window !== "undefined" && "__TAURI__" in window;

if (isTauriApp) {
	const { listen } = await import("@tauri-apps/api/event");

	listen<BidsStatePayload>("bids-state", (event) => {
		store.dispatch(setTimeMs(event.payload.time_ms));
		store.dispatch(setCurrentLocation(event.payload.location_m / 1000));
	}).catch((err: unknown) => {
		console.error("Failed to register BIDS state listener:", err);
	});
}

const rootElement = document.getElementById("root");
if (rootElement == null) {
	alert("Root element not found");
} else {
	ReactDOM.createRoot(rootElement).render(
		<React.StrictMode>
			<Provider store={store}>
				<Suspense fallback={null}>
					<RouterProvider router={router} />
				</Suspense>
			</Provider>
		</React.StrictMode>
	);
}
