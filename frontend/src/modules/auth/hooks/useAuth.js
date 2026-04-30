import { useState } from "react";
import api from "../../core/api/axios";
import { setLoginResponse } from "../contexts/loginStore";
import { useNavigate } from "react-router";

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const login = async (loginRequest) => {
        setLoading(true);
        try {
            const response = await api.post("/auth/login", loginRequest);

            const { user, token } = response.data;
            cookieStore.set("token", token);
            setLoginResponse({ user, token });

            setError(null);
            navigate("/dashboard");
            return response.data;
        } catch (err) {
            setError(err || "Login failed");
            console.error(err || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    const register = async (registerRequest) => {
        setLoading(true);
        try {
            const response = await api.post("/auth/register", registerRequest);

            setError(null);
            navigate("/setup");
            console.log(response.data);
        } catch (err) {
            setError(err.response.data || "Register failed");
            console.error(err.response.data || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return { login, register, loading, error };
};
