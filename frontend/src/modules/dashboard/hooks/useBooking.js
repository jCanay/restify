import api from "@/modules/core/api/axios"
import { useCallback, useState } from "react"

export const useBookings = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const addBooking = useCallback(async (booking, restaurantId) => {
    try {
      setLoading(true)

      const response = await api.post(
        `/restaurants/${restaurantId}/bookings`,
        booking,
      )
      const newBooking = response.data

      setError(null)
      return newBooking
    } catch (err) {
      console.log(err.response.message || "Error creating booking")
      setError(err.response.message || "Error creating booking")
      return {}
    } finally {
      setLoading(false)
    }
  }, [])

  const getAllBookingsByRestaurantId = useCallback(
    async (restaurantId, { page, size, sort, search } = {}) => {
      try {
        setLoading(true)

        const response = await api.get(
          `/restaurants/${restaurantId}/bookings?page=${page || 0}&size=${size || 20}&sort=${sort || ""}`,
        )
        const bookings = response.data

        setError(null)
        return bookings
      } catch (err) {
        console.log(err.response.message || "Error fetching bookings")
        setError(err.response.message || "Error fetching bookings")
        return []
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  return {
    addBooking,
    getAllBookingsByRestaurantId,
    loading,
    error,
  }
}
