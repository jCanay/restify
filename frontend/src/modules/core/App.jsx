import "./css/app.css";
import AppRouter from "./routes/AppRouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import "react-day-picker/dist/style.css";

function App() {
    return (
        <TooltipProvider>
            <AppRouter />
        </TooltipProvider>
    );
}

export default App;
