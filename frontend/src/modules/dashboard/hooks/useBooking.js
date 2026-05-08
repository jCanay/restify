import api from "@/modules/core/api/axios";
import { useState } from "react";

export const useBookings = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const addBooking = async (booking, restaurantId) => {
        try {
            setLoading(true);

            const response = await api.post(
                `/restaurants/${restaurantId}/bookings`,
                booking,
            );
            const newBooking = response.data;

            console.log(newBooking);
            setError(null);
        } catch (err) {
            console.log(err.response.message || "Error creating booking");
            setError(err.response.message || "Error creating booking");
        } finally {
            setLoading(false);
        }
    };

    const getAllBookings = async () => {
        try {
            setLoading(true);

            const response = await api.get("/bookings");
            const bookings = response.data;

            console.log(bookings);
            setError(null);
        } catch (err) {
            console.log(err.response.message || "Error fetching bookings");
            setError(err.response.message || "Error fetching bookings");
        } finally {
            setLoading(false);
        }
    };

    return { addBooking, getAllBookings, loading, error };
};
