import { Route } from "react-router";
import OrdersPage from "../pages/OrdersPage";

export const AccountRoutes = (
	<>
		<Route
			path="account/orders"
			element={<OrdersPage />}
		/>
	</>
);