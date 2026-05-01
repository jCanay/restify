import { useState } from "react"
import api from "../../core/api/axios"
import { setLoginResponse } from "../contexts/loginStore"
import { useNavigate } from "react-router"
import { setUser } from "../../dashboard/contexts/userStore"

export const useAuth = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const login = async (loginRequest) => {
    setLoading(true)
    try {
      // Llamada a la API
      const response = await api.post("/auth/login", loginRequest)
      const { token, user, account } = response.data

      // Establece datos
      cookieStore.set("token", token)
      setLoginResponse({ token })
      setUser({ user, account })

      // Acciones posteriores
      navigate("/dashboard")
      setError(null)
    } catch (err) {
      setError(err || "Login failed")
      console.error(err || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  const register = async (registerRequest) => {
    setLoading(true)
    try {
      const response = await api.post("/auth/register", registerRequest)

      setError(null)
      navigate("/setup")
    } catch (err) {
      setError(err.response.data || "Register failed")
      console.error(err.response.data || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return { login, register, loading, error }
}
