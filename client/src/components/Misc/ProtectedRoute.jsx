import { useAuth } from "@/context/Auth"
import { Navigate, useLocation } from "react-router-dom"

const ProtectedRoute = ({ Component, requireAdmin = false }) => {
  const { isAuth, user, isAppLoading } = useAuth()
  const location = useLocation()

  if (isAppLoading) {
    return null
  }

  // If route requires admin
  if (requireAdmin) {
    if (!isAuth) {
      return <Navigate to="/admin/login" replace state={{ from: location }} />
    }
    if (user?.role !== "admin") {
      if (window.toastify) {
        window.toastify("Access Denied: Administrator role required.", "error")
      }
      return <Navigate to="/" replace />
    }
    return <Component />
  }

  // Normal user protected route
  if (!isAuth) {
    return <Navigate to={`/auth/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
  }

  return <Component />
}

export default ProtectedRoute