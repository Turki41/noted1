import { useEffect, useState, type ReactNode } from "react"
import axiosInstance from "../utils/axiosInstance"
import { API_PATHS } from "../utils/apiPaths"
import { UserContext, type User } from "./userContext"


interface UserProviderProps {
  children: ReactNode
}

const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const clearUser = () => {
    setUser(null)
    localStorage.removeItem('token')
  }

  const updateUser = (userData: User) => {
    setUser(userData)
    if (userData.token) {
      localStorage.setItem('token', userData.token)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (user) return

    const accessToken = localStorage.getItem('token')
    if (!accessToken) {
      setLoading(false)
      return
    }

    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get<User>(API_PATHS.AUTH.GET_PROFILE)
        setUser(response.data)
      } catch (error) {
        console.log('User not authenticated', error)
        clearUser()
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return (
    <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider
