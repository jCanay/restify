import { useState } from "react";
import api from "../../core/api/axios";
import { $userStore, setUser } from "../../dashboard/contexts/userStore";
import { useStore } from "@nanostores/react";
import { useNavigate } from "react-router";
import { deleteSetupDataKey } from "../contexts/setupDataStore";

export const useSetup = () => {
    const userStore = useStore($userStore);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const completeOnboarding = async () => {
        try {
            setLoading(true);

            const response = await api.post("/accounts/onboarding/complete");
            const account = response.data;

            const currentStore = $userStore.get();
            setUser({ ...currentStore, account });

            navigate("/dashboard");
            deleteSetupDataKey();
            setError(null);
        } catch (err) {
            setError(err);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const addRestaurant = async (newRestaurant) => {
        try {
            setLoading(true);

            const response = await api.post("/restaurants", newRestaurant);
            const restaurant = response.data;
            console.log("RESTAURANTE: ", restaurant);

            const currentStore = $userStore.get();
            setUser({
                ...currentStore,
                restaurants: [...userStore.restaurants, restaurant],
            });
            setError(null);
        } catch (err) {
            setError(err);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return { addRestaurant, completeOnboarding, loading, error };
};
