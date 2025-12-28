import React from "react";
import ReactDOM from "react-dom/client";

import { CanvasDemo } from "./CanvasDemo";

const rootElement = document.getElementById("root");
if (rootElement == null) {
	alert("Root element not found");
} else {
	ReactDOM.createRoot(rootElement).render(
		<React.StrictMode>
			<CanvasDemo />
		</React.StrictMode>
	);
}
