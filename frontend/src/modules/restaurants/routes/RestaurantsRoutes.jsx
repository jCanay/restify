import { Route, Routes } from "react-router";
import RestaurantsPageWrapper from "./RestaurantsPageWrapper";
import RestaurantDetailPage from "../pages/RestaurantDetailPage";
import RestaurantProduct from "../components/RestaurantProduct/RestaurantProduct";

export const RestaurantRoutes = (
	<>
		<Route
			path=":countryCode?/:city?"
			element={<RestaurantsPageWrapper />}
		/>
		<Route
			path=":countryCode?/:city?/:slug?"
			element={<RestaurantDetailPage />}
		>
			<Route path=":countryCode?/:city?/:slug?/:productName" element={<RestaurantProduct />} />
		</Route>
	</>
);
