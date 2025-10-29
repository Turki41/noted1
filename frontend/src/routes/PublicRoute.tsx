import React, { useContext } from 'react'
import { UserContext } from '../context/userContext'
import { Outlet, useNavigate } from 'react-router-dom'

interface PublicRouteProps {
    children?: React.ReactNode
}

const PublicRoute = ({children}: PublicRouteProps) => {
    const userContext = useContext(UserContext)
    const {user, loading} = userContext!
    
    const navigate = useNavigate()

    if(loading) return

    if(user) {
        navigate('/user/dashboard', {replace: true})
    }

  return (
    children ? <>{children}</> : <Outlet />
  )
}

export default PublicRoute