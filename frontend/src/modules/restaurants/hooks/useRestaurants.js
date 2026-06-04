import api from "@/modules/core/api/axios"
import { useCallback, useState } from "react"

export const useRestaurants = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getRestaurants = useCallback(
    async (countryCode, city, { page, size, sort } = {}) => {
      try {
        setLoading(true)

        const response = await api.get(
          `/restaurants?countryCode=${countryCode || ""}&city=${city || ""}&page=${page || 0}&size=${size || 20}&sort=${sort || ""}`,
        )

        const restaurants = response.data

        setError(null)
        return restaurants
      } catch (err) {
        console.error(err.response.message || "Error fetching restaurants")
        setError(err.response.message || "Error fetching restaurants")
        throw err
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  const getRestaurant = useCallback(async (id) => {
    try {
      setLoading(true)

      const response = await api.get(`/restaurants/${id}`)

      const restaurants = response.data

      setError(null)
      return restaurants
    } catch (err) {
      console.error(err.response.message || "Error fetching restaurant")
      setError(err.response.message || "Error fetching restaurant")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { getRestaurants, getRestaurant, loading, error }
}
