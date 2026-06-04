import api from "@/modules/core/api/axios"
import { useCallback, useState } from "react"

export const useAddress = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getAllAddressByUser = useCallback(async () => {
    try {
      setLoading(true)

      const response = await api.get(`/accounts/addresses`)
      const addresses = response.data

      setError(null)
      return addresses
    } catch (err) {
      console.log(err.response.message || "Error fetching addresses")
      setError(err.response.message || "Error fetching addresses")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { getAllAddressByUser, loading, error }
}
