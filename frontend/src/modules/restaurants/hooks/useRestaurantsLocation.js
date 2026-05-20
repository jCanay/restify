import api from "@/modules/core/api/axios";
import { useCallback, useState } from "react";

export const useRestaurantsLocation = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const checkLocationStatus = useCallback(
        async ({ countryCode, city } = {}) => {
            try {
                setLoading(true);

                const response = await api.get(
                    `/locations/${countryCode || ""}/status?city=${city || ""}`,
                );

                const locationStatus = response.data;

                setError(null);
                return locationStatus;
            } catch (err) {
                console.log(
                    err.response.message || "Error checking location status",
                );
                setError(
                    err.response.message || "Error checking location status",
                );
                return {};
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    const checkLocationStatusByCoordinates = useCallback(
        async ({ latitude = 0, longitude = 0 } = {}) => {
            try {
                setLoading(true);

                const response = await api.get(
                    `/locations/status?latitude=${latitude}&longitude=${longitude}`,
                );

                const locationStatus = response.data;

                setError(null);
                return locationStatus;
            } catch (err) {
                console.log(
                    err.response.message || "Error checking location status",
                );
                setError(
                    err.response.message || "Error checking location status",
                );
                return {};
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    const findNearbyRestaurants = useCallback(
        async ({ latitude = 0, longitude = 0 } = {}) => {
            try {
                setLoading(true);
                const response = await api.get(
                    `/restaurants/nearby?latitude=${latitude}&longitude=${longitude}`,
                );

                const restaurants = response.data;

                setError(null);
                return restaurants;
            } catch (err) {
                setError(
                    err.response.message || "Error fetching nearby restaurants",
                );
                console.error(
                    err.response.message || "Error fetching nearby restaurants",
                );
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    return {
        checkLocationStatus,
        checkLocationStatusByCoordinates,
        findNearbyRestaurants,
        loading,
        error,
    };
};
