import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { Provider } from "react-redux";

import { router } from "./router";
import { store } from "./store/store";

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
