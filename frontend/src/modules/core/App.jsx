import "./css/app.css";
import AppRouter from "./routes/AppRouter";
import { TooltipProvider } from "@/components/ui/tooltip";

function App() {
	return (
		<TooltipProvider>
			<AppRouter />
		</TooltipProvider>
	);
}

export default App;
