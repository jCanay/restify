import { useEffect } from "react";
import { addDashboard, dashboardStore, setError, setLoading } from "../contexts/DashboardStore";
import { getDashboard } from "../services/getDashboard";
import { useStore } from "@nanostores/react";

export const useDashboard = restaurantId => {
	const store = useStore(dashboardStore);

	useEffect(() => {
		const loadData = async () => {
			if (!restaurantId) return;

			try {
				setLoading(true);
				const response = await getDashboard(restaurantId);
				addDashboard(response);
			} catch (error) {
				console.error(`Error loading the dashboard for restaurant ${restaurantId}`, error);
				setError(error);
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, [restaurantId]);

	return {
		data: store.data,
		loading: store.loading,
		error: store.error
	};
};
