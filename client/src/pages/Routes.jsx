import { Navigate, Route, Routes } from 'react-router-dom'
import Frontend from './Frontend'
import Auth from './Auth'
import Login from './Auth/Login'
import Register from './Auth/Register.jsx'
import AdminLogin from './Auth/AdminLogin'
import Dashboard from './Dashboard'
import ProtectedRoute from '../components/Misc/ProtectedRoute'
import { useAuth } from "@/context/Auth"

const Index = () => {
  const { isAuth, isAdmin } = useAuth()

  return (
    <Routes>
      {/* Direct Auth Shortcuts */}
      <Route path="/login" element={!isAuth ? <Login /> : <Navigate to="/" replace />} />
      <Route path="/register" element={!isAuth ? <Register /> : <Navigate to="/" replace />} />
      <Route path="/admin/login" element={!(isAuth && isAdmin) ? <AdminLogin /> : <Navigate to="/admin" replace />} />

      {/* Auth nested router */}
      <Route path="/auth/*" element={!isAuth ? <Auth /> : <Navigate to="/" replace />} />

      {/* Admin Dashboard (Protected with Admin Role) */}
      <Route
        path="/admin/*"
        element={<ProtectedRoute Component={Dashboard} requireAdmin={true} />}
      />

      {/* Backward-compatibility for old /dashboard path */}
      <Route
        path="/dashboard/*"
        element={<ProtectedRoute Component={Dashboard} requireAdmin={true} />}
      />

      {/* Public Storefront */}
      <Route path="/*" element={<Frontend />} />
    </Routes>
  )
}

export default Index