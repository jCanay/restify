import api from "@/modules/core/api/axios";
import { useCallback, useState } from "react";

export const useProducts = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getProducts = useCallback(async (restaurantId) => {
        try {
            setLoading(true);

            const response = await api.get(
                `/restaurants/${restaurantId}/products`,
            );

            const products = response.data;

            setError(null);
            return products;
        } catch (err) {
            console.error(err.response.message || "Error fetching products");
            setError(err.response.message || "Error fetching products");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getProductsByUrl = useCallback(
        async ({ countryCode, city, slug } = {}) => {
            try {
                setLoading(true);

                const response = await api.get(
                    `/restaurants/search?countryCode=${countryCode}&city=${city}&slug=${slug}`,
                );

                const restaurantDetail = response.data;

                setError(null);
                return restaurantDetail;
            } catch (err) {
                console.error(
                    err.response.message || "Error fetching restaurant detail",
                );
                setError(
                    err.response.message || "Error fetching restaurant detail",
                );
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    return { getProducts, getProductsByUrl, loading, error };
};
