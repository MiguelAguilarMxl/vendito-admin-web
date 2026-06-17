import { createContext, useContext, useEffect, useState } from 'react'
import apiClient from '../api/axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const logout = () => {
    localStorage.removeItem('vendito_admin_token')
    setUser(null)
  }

  const loadUser = async () => {
    try {
      const response = await apiClient.get('/platform/auth/me')

      setUser(response.data)
    } catch (error) {
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    const response = await apiClient.post('/platform/auth/login', {
      username: email,
      password,
    })

    const token = response.data.token

    localStorage.setItem('vendito_admin_token', token)

    await loadUser()

    return response.data
  }

  useEffect(() => {
    const token = localStorage.getItem('vendito_admin_token')

    if (!token) {
      setLoading(false)
      return
    }

    loadUser()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}