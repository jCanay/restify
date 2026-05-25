import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.jsx";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "react-day-picker/dist/style.css";
import { TooltipProvider } from "@/components/ui/tooltip.js";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localizedFormat from "dayjs/plugin/localizedFormat.js";
import dayjs from "dayjs";
import { SkeletonProvider } from "react-skeletonify";

dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<BrowserRouter>
			<SkeletonProvider
				config={{
					animation: "animation-1",
					borderRadius: "8px",
					animationSpeed: 2,
					background: "#e0e0e0",
					exceptTags: ["button", "input"]
				}}
			>
				<TooltipProvider>
					<App />
				</TooltipProvider>
			</SkeletonProvider>
		</BrowserRouter>
	</StrictMode>,
);
