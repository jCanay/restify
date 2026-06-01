import api from "@/modules/core/api/axios"
import { useCallback, useState } from "react"

export const useOrders = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const addOrder = useCallback(async ({ order, restaurantId, addressId }) => {
    try {
      setLoading(true)

      const response = await api.post(
        `/restaurants/${restaurantId}/orders?addressId=${addressId}`,
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

  const getAllOrdersByRestaurantId = useCallback(
    async (restaurantId, { page, size, sort, search } = {}) => {
      try {
        setLoading(true)

        const response = await api.get(
          `/restaurants/${restaurantId}/orders?page=${page || 0}&size=${size || 20}&sort=${sort || ""}`,
        )
        const orders = response.data

        setError(null)
        return orders
      } catch (err) {
        console.log(err.response.message || "Error fetching orders")
        setError(err.response.message || "Error fetching orders")
        throw err
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  return { addOrder, getAllOrdersByRestaurantId, loading, error }
}
