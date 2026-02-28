import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { listen } from "@tauri-apps/api/event";
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

listen<BidsStatePayload>("bids-state", (event) => {
	store.dispatch(setTimeMs(event.payload.time_ms));
	store.dispatch(setCurrentLocation(event.payload.location_m / 1000));
}).catch((err: unknown) => {
	console.error("Failed to register BIDS state listener:", err);
});

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
