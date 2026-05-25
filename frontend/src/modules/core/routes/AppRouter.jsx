import { Routes, Route } from "react-router";
import { DashboardRoutes } from "../../dashboard/routes/DashboardRoutes";
import { AuthRoutes } from "../../auth/routes/AuthRoutes";
import { SetupRoutes } from "../../setup/routes/SetupRoutes";
import { RestaurantRoutes } from "@/modules/restaurants/routes/RestaurantsRoutes";
import Homepage from "../pages/Homepage";
import { ProtectedRoute } from "./ProtectedRoute";
import { useAuth } from "../../auth/hooks/useAuth";
import { $userStore } from "../../dashboard/contexts/userStore";
import { useStore } from "@nanostores/react";
import { ScrollTop } from "../components/Scroll/ScrollTop";

function AppRouter() {
	const { authenticated, needsOnboarding } = useAuth();
	const { user } = useStore($userStore) || {};

	if (authenticated && !user?.id) return <div>Cargando...</div>;

	return (
		<Routes>
			{/* <Route path="*" element={<h1>Not Found</h1>} /> */}

			<Route path="/" element={<Homepage />} />
			{RestaurantRoutes}
			{AuthRoutes}
			<Route element={<ProtectedRoute isAllowed={authenticated && !needsOnboarding} navigateTo={authenticated ? "/setup" : "/"} />}>
				{DashboardRoutes}
			</Route>
			<Route element={<ProtectedRoute isAllowed={authenticated && needsOnboarding} navigateTo={authenticated ? "/dashboard" : "/"} />}>
				{SetupRoutes}
			</Route>
		</Routes >
	);
}

export default AppRouter;
