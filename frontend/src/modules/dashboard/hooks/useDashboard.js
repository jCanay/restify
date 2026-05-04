import { useCallback, useState } from "react";
import api from "../../core/api/axios";
import { $dashboardStore, setDashboard } from "../contexts/dashboardStore";

export const useDashboard = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadDashboard = useCallback(async (restaurantId) => {
        try {
            setLoading(true);

            const response = await api.get(
                `/restaurants/${restaurantId}/dashboards`,
            );
            const dashboard = response.data;

            const dashboardStore = $dashboardStore.get();
            setDashboard({ ...dashboardStore, dashboard });
            setError(null);
        } catch (err) {
            setError(err);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getUsers = useCallback(async () => {
        try {
            setLoading(true);

            const response = await api.get("/users");
            const users = response.data;

            const dashboardStore = $dashboardStore.get();
            setDashboard({ ...dashboardStore, users });
            setError(null);
        } catch (err) {
            setError(err);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    return { loadDashboard, getUsers, loading, error };
};
