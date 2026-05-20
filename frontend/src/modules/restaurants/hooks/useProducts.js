import api from "@/modules/core/api/axios"
import { useCallback, useState } from "react"

export const useProducts = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getProducts = useCallback(async (restaurantId) => {
    try {
      setLoading(true)

      const response = await api.get(`/restaurants/${restaurantId}/products`)

      const products = response.data

      setError(null)
      return products
    } catch (err) {
      console.error(err.response.message || "Error fetching products")
      setError(err.response.message || "Error fetching products")
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  return { getProducts, loading, error }
}
