import { useState } from "react";
import api from "../../core/api/axios"

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = async (credentials) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.post("http://localhost:8080/auth/login", credentials);
            
            const { token } = response.data;
            localStorage.setItem("token", token);
            
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { login, isLoading, error };
};