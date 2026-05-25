import { Route } from "react-router";
import Dashboard from "../pages/Dashboard";
import DashboardPageWrapper from "./DashboardPageWrapper";

export const DashboardRoutes = (
	<Route element={<Dashboard />}>
		<Route
			path="dashboard/:slug?/:tab?"
			element={<DashboardPageWrapper />}
		/>
	</Route>
);
