import { Route, Routes } from "react-router-dom"
import Register from "./Register.jsx"
import Login from "./Login"
import AdminLogin from "./AdminLogin"
import NoPage from "@/components/Misc/NoPage.jsx"
import ForgotPassword from "./ForgotPassword/index.jsx"

const Auth = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="admin-login" element={<AdminLogin />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="*" element={<NoPage />} />
    </Routes>
  )
}

export default Auth
