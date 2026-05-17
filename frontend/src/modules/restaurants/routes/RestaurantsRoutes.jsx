import { Route } from "react-router";
import RestaurantsPageWrapper from "./RestaurantsPageWrapper";

export const RestaurantRoutes = (
	<Route
		path=":countryCode?/:city?"
		element={<RestaurantsPageWrapper />}
	/>
);