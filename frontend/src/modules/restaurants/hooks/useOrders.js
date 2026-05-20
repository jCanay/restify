import api from "@/modules/core/api/axios"
import { useCallback, useState } from "react"

export const useOrders = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const addOrder = useCallback(async ({ order, restaurantId }) => {
    try {
      setLoading(true)

      const response = await api.post(
        `/restaurants/${restaurantId}/orders`,
        order,
      )

      const newOrder = response.data

      setError(null)

      return newOrder
    } catch (err) {
      console.error(err.response.message || "Error creating order")
      setError(err.response.message || "Error creating order")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { addOrder, loading, error }
}
