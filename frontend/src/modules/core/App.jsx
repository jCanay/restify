import "./css/app.css";
import AppRouter from "./routes/AppRouter";
import { AuthProvider } from "../auth/contexts/AuthProvider";
import { TooltipProvider } from "@/components/ui/tooltip";

function App() {
	return (
		<AuthProvider>
			<TooltipProvider>
				<AppRouter />
			</TooltipProvider>
		</AuthProvider>
	);
}

export default App;
