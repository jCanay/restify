import api from "../../core/api/axios";
import dashboard from "../../../assets/widgets.json";

export const getDashboard = async (user_id) => {
    try {
        //const response = await api.get(`dashboard/${user_id}`);
        // await new Promise((r) => setTimeout(r, 2000));
        return dashboard;
    } catch (error) {
        throw new Error(error);
    }
};
