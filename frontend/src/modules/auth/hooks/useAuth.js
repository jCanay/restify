import { useCallback, useEffect, useState } from "react";
import api from "../../core/api/axios";
import { useLocation, useNavigate } from "react-router";
import {
    $userStore,
    deleteUserKey,
    setUser,
} from "../../dashboard/contexts/userStore";
import { $authStore, deleteAuthKey, setAuth } from "../contexts/authStore";
import { useStore } from "@nanostores/react";
import { getAuthStatus } from "../utils/authUtils";
import {
    deleteHasAnimatedConfirmationKey,
    deleteSetupDataKey,
} from "../../setup/contexts/setupDataStore";
import { deleteDashboardKey } from "@/modules/dashboard/contexts/dashboardStore";

export const useAuth = () => {
    const { token } = useStore($authStore) || "";
    const { user, account } = useStore($userStore) || {};
    const { authenticated, needsOnboarding } = getAuthStatus(
        token,
        user,
        account,
    );

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const login = useCallback(async (loginRequest) => {
        setLoading(true);

        try {
            // Llamada a la API
            const response = await api.post("/auth/login", loginRequest);
            const { token, user, account, restaurants } = response.data;

            // Establece datos
            cookieStore.set("token", token);
            setAuth({ token });
            setUser({ user, account, restaurants });

            // Acciones posteriores
            if (
                ["ROLE_ADMIN", "ROLE_OWNER"].includes(user?.role?.name) &&
                location.pathname == "/"
            ) {
                navigate("/dashboard");
            }

            setError(null);
        } catch (err) {
            setError(err?.response?.data || "Login failed");
            console.error(err?.response?.data || "Login failed");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const register = useCallback(async (registerRequest) => {
        setLoading(true);

        try {
            await api.post("/auth/register", registerRequest);
            if (
                ["ROLE_ADMIN", "ROLE_OWNER"].includes(
                    registerRequest?.user?.role?.name,
                )
            ) {
                navigate("/setup");
            }

            setError(null);
        } catch (err) {
            setError(err.response.data || "Register failed");
            console.error(err.response.data || "Login failed");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = async () => {
        cookieStore.delete("token");

        // Auth
        deleteAuthKey();

        // Setup
        deleteSetupDataKey();
        deleteHasAnimatedConfirmationKey();

        // User
        deleteUserKey();

        // Dashboard
        deleteDashboardKey();
    };

    return {
        login,
        register,
        logout,
        authenticated,
        needsOnboarding,
        loading,
        error,
    };
};
