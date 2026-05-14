import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.jsx";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { TooltipProvider } from "@/components/ui/tooltip.js";


createRoot(document.getElementById("root")).render(
	<StrictMode>
		<BrowserRouter>
			<TooltipProvider>
				<App />
			</TooltipProvider>
		</BrowserRouter>
	</StrictMode>,
);
