import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { router } from "./router";

const rootElement = document.getElementById("root");
if (rootElement == null) {
	alert("Root element not found");
} else {
	ReactDOM.createRoot(rootElement).render(
		<React.StrictMode>
			<Suspense fallback={null}>
				<RouterProvider router={router} />
			</Suspense>
		</React.StrictMode>
	);
}
