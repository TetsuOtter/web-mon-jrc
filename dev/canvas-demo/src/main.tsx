import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import CanvasDemo from "./CanvasDemoPage";

const root = document.getElementById("root");
if (!root) {
	throw new Error("Root element not found");
}

createRoot(root).render(
	<StrictMode>
		<CanvasDemo />
	</StrictMode>
);
