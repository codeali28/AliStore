import { Form, Input, Typography, Button } from "antd"
import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { LockOutlined, MailOutlined, SafetyOutlined } from "@ant-design/icons"
import { useAuth } from "@/context/Auth"
import axios from "axios"

const { Title, Paragraph } = Typography
const { Item } = Form

const initialState = { email: "", password: "" }

const Login = () => {
  const { readProfile, handleLoginSuccess } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectUrl = searchParams.get("redirect") || "/"

  const [state, setState] = useState(initialState)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

  const handleLogin = (e) => {
    if (e && e.preventDefault) e.preventDefault()
    let { email, password } = state

    email = (email || "").trim()
    if (!email || !password) {
      return window.toastify ? window.toastify("Please enter both email and password", "error") : alert("Enter email and password")
    }

    setIsProcessing(true)

    axios.post(`${import.meta.env.VITE_API_URL}/api/login`, { email, password })
      .then((res) => {
        const { status, data } = res
        if (status === 200) {
          localStorage.setItem("jwt", data.token)
          if (handleLoginSuccess) {
            handleLoginSuccess(data.token, data.user)
          } else {
            readProfile(data.token)
          }

          if (window.toastify) {
            window.toastify("Login successful! Welcome back.", "success")
          }

          navigate(redirectUrl)
        } else {
          if (window.toastify) window.toastify(data.message, "error")
        }
      })
      .catch(error => {
        console.error("Login error:", error)
        const errMsg = error?.response?.data?.message || "Invalid email or password. Please try again."
        if (window.toastify) window.toastify(errMsg, "error")
      })
      .finally(() => {
        setIsProcessing(false)
      })
  }

  return (
    <main className="auth flex-center py-5" style={{ minHeight: "80vh", backgroundColor: "#f8fafc" }}>
      <div className="container">
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 mx-auto bg-white" style={{ maxWidth: "440px" }}>
          <div className="text-center mb-4">
            <span
              className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-3 mb-3 shadow-sm"
              style={{ width: "48px", height: "48px", fontSize: "22px" }}
            >
              🛍️
            </span>
            <Title level={3} className="fw-bold mb-1 text-dark">Welcome Back</Title>
            <Paragraph className="text-muted small">Sign in to your AliStore account</Paragraph>
          </div>

          <Form layout="vertical" onFinish={handleLogin}>
            <Item label={<span className="fw-medium small">Email Address</span>} required>
              <Input
                type="email"
                size="large"
                prefix={<MailOutlined className="text-muted" />}
                placeholder="name@example.com"
                name="email"
                value={state.email}
                onChange={handleChange}
                className="rounded-3"
              />
            </Item>

            <Item label={<span className="fw-medium small">Password</span>} required>
              <Input.Password
                size="large"
                prefix={<LockOutlined className="text-muted" />}
                placeholder="Enter your password"
                name="password"
                value={state.password}
                onChange={handleChange}
                className="rounded-3"
              />
            </Item>

            <Button
              type="primary"
              size="large"
              block
              htmlType="submit"
              loading={isProcessing}
              className="rounded-pill fw-semibold mt-2 shadow-sm"
              style={{ backgroundColor: "#2563eb", borderColor: "#2563eb", height: "44px" }}
            >
              Sign In
            </Button>
          </Form>

          <div className="text-center mt-4 pt-3 border-top">
            <Paragraph className="mb-2 text-muted small">
              Don't have an account? <Link to="/auth/register" className="fw-bold text-primary">Register here</Link>
            </Paragraph>
            <div className="mt-3">
              <Link to="/admin/login" className="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1 text-decoration-none small">
                <SafetyOutlined className="me-1" /> Administrator Portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Login