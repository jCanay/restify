import api from "@/modules/core/api/axios"
import { useCallback, useState } from "react"

export const useRestaurantsLocation = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const checkLocationStatus = useCallback(
    async ({ countryCode, city } = {}) => {
      try {
        setLoading(true)

        const response = await api.get(
          `/restaurants/locations/${countryCode || ""}/status?city=${city || ""}`,
        )

        const locationStatus = response.data

        setError(null)
        return locationStatus
      } catch (err) {
        console.log(err.response.message || "Error checking location status")
        setError(err.response.message || "Error checking location status")
        return {}
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  return { checkLocationStatus, loading, error }
}
