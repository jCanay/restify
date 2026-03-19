import { addDashboard, setLoading } from "../contexts/DashboardStore";
import { getDashboard } from "../services/getDashboard";

export const useAddDashboard = async () => {
    try {
        setLoading(true);
        const response = await getDashboard(1);
        addDashboard(response);
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
};
