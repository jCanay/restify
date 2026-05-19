import { useCallback, useState } from "react"
import api from "../api/axios"

export const useMapLocation = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getLocationByCoordinates = useCallback(
    async ({ latitude, longitude } = {}) => {
      try {
        setLoading(true)

        const response = await api.get(
          `/location/search?latitude=${latitude}&longitude=${longitude}`,
        )

        const location = response.data

        setError(null)

        return location
      } catch (err) {
        setError(err.response.message || "Error fetching location")
        console.error(err.response.message || "Error fetching location")
        throw err
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  return { getLocationByCoordinates, loading, error }
}
