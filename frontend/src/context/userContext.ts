import { createContext } from "react"

export interface User {
  _id?: string
  name?: string
  email?: string
  role?: string
  profileImageUrl?: string
  token?: string
}

export interface UserContextType {
  user: User | null
  loading: boolean
  updateUser: (userData: User) => void
  clearUser: () => void
}

// Create the context
export const UserContext = createContext<UserContextType | null>(null)
