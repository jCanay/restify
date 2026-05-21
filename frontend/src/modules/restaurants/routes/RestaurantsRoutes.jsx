import { Route, Routes } from "react-router";
import RestaurantsPageWrapper from "./RestaurantsPageWrapper";
import RestaurantDetailPage from "../pages/RestaurantDetailPage";

export const RestaurantRoutes = (
    <>
        <Route
            path=":countryCode?/:city?"
            element={<RestaurantsPageWrapper />}
        />
        <Route
            path=":countryCode?/:city?/:slug?"
            element={<RestaurantDetailPage />}
        />
    </>
);
