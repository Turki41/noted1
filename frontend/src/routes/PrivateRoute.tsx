import { useContext } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { UserContext } from "../context/userContext"

interface PrivateRouteProps {
  children?: React.ReactNode
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const userContext = useContext(UserContext)
  if (!userContext) return null
  const { user, loading } = userContext

  if (loading) return 


  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    children ? <>{children}</> : <Outlet />
  )
}

export default PrivateRoute