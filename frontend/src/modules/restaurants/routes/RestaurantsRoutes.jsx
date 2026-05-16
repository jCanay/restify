import { Route } from "react-router";
import RestaurantsPageWrapper from "./RestaurantsPageWrapper";

export const RestaurantRoutes = (
	<Route
		path=":country?/:city?"
		element={<RestaurantsPageWrapper />}
	/>
);