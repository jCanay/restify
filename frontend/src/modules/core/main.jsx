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

dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <TooltipProvider>
                <App />
            </TooltipProvider>
        </BrowserRouter>
    </StrictMode>,
);
