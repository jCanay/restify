import { Route, Routes } from "react-router";
import RestaurantsPageWrapper from "./RestaurantsPageWrapper";
import RestaurantDetailPage from "../pages/RestaurantDetailPage";
import RestaurantProduct from "../components/RestaurantProduct/RestaurantProduct";
import RestaurantCheckoutPage from "../pages/RestaurantCheckoutPage";

export const RestaurantRoutes = (
    <>
        <Route
            path=":countryCode/:city/:slug/checkout"
            element={<RestaurantCheckoutPage />}
        />
        <Route
            path=":countryCode?/:city?/:slug?"
            element={<RestaurantDetailPage />}
        >
            <Route path=":productName" element={<RestaurantProduct />} />
        </Route>
        <Route
            path=":countryCode?/:city?"
            element={<RestaurantsPageWrapper />}
        />
    </>
);
