import { useState } from "react";
import api from "../../core/api/axios";
import { setLoginResponse } from "../contexts/LoginStore";
import { useNavigate } from "react-router";

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const login = async (loginRequest) => {
        setLoading(true);
        try {
            const response = await api.post("/auth/login", loginRequest);

            const { token } = response.data;
            cookieStore.set("token", token);
            setLoginResponse({ sessionToken: token });

            setError(null);
            navigate("/dashboard");
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { login, loading: loading, error };
};
