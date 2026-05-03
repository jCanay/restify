import { useCallback, useState } from "react"
import api from "../../core/api/axios"
import {
  $dashboardStore,
  setDashboard,
  setDashboardUsers,
} from "../contexts/dashboardStore"
import { useStore } from "@nanostores/react"
import dashboard from "../../../assets/widgets.json"

export const useDashboard = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const store = useStore($dashboardStore)

  const loadDashboard = useCallback(async (restaurantId) => {
    try {
      setLoading(true)

      const response = dashboard

      setDashboard(response)
      setError(null)
    } catch (err) {
      setError(err)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  const getUsers = useCallback(async () => {
    try {
      setLoading(true)

      const response = await api.get("/users")
      const users = response.data

      setDashboardUsers({ users })
    } catch (err) {
      setError(err)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  return { loadDashboard, getUsers, loading, error }
}
