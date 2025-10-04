import { Outlet } from "react-router-dom"

interface UserType {
  allowedRole: 'admin' | 'user'
}

const PrivateRoute = ({ allowedRole }: UserType) => {
  return <Outlet />
}

export default PrivateRoute