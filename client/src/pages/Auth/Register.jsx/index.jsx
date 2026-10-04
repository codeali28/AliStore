import { Form, Input, Typography, Button } from "antd"
import axios from "axios"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons"

const { Title, Paragraph } = Typography
const { Item } = Form

const initialState = { name: "", email: "", password: "", confirmPassword: "" }

const Register = () => {
  const [state, setState] = useState(initialState)
  const [isProcessing, setIsProcessing] = useState(false)
  const navigate = useNavigate()

  const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

  const handleRegister = (e) => {
    if (e && e.preventDefault) e.preventDefault()
    let { name, email, password, confirmPassword } = state

    const fullName = (name || "").trim()
    const userEmail = (email || "").trim()

    if (fullName.length < 3) {
      return window.toastify ? window.toastify("Please enter your full name (minimum 3 characters)", "error") : alert("Enter name")
    }
    if (!window.isValidEmail(userEmail)) {
      return window.toastify ? window.toastify("Please enter a valid email address", "error") : alert("Enter valid email")
    }
    if (password.length < 6) {
      return window.toastify ? window.toastify("Password must be at least 6 characters", "error") : alert("Password too short")
    }
    if (confirmPassword !== password) {
      return window.toastify ? window.toastify("Passwords do not match", "error") : alert("Passwords do not match")
    }

    const userPayload = { name: fullName, fullName, email: userEmail, password }

    setIsProcessing(true)

    axios.post("http://localhost:8000/api/register", userPayload)
      .then((res) => {
        const { status, data } = res
        if (status === 201) {
          if (window.toastify) {
            window.toastify(data.message || "Account created successfully! Please sign in.", "success")
          }
          navigate("/auth/login")
        }
      })
      .catch(error => {
        console.error("Register error:", error)
        const errMsg = error?.response?.data?.message || "Something went wrong during registration."
        if (window.toastify) window.toastify(errMsg, "error")
      })
      .finally(() => {
        setIsProcessing(false)
      })
  }

  return (
    <main className="auth flex-center py-5" style={{ minHeight: "80vh", backgroundColor: "#f8fafc" }}>
      <div className="container">
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 mx-auto bg-white" style={{ maxWidth: "460px" }}>
          <div className="text-center mb-4">
            <span
              className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle mb-3"
              style={{ width: "48px", height: "48px", fontSize: "22px" }}
            >
              🛍️
            </span>
            <Title level={2} className="fw-bold mb-1">Create Account</Title>
            <Paragraph className="text-muted">Join AliStore today to start shopping</Paragraph>
          </div>

          <Form layout="vertical" onFinish={handleRegister}>
            <Item label="Full Name" required>
              <Input
                type="text"
                size="large"
                prefix={<UserOutlined className="text-muted" />}
                placeholder="Enter your full name"
                name="name"
                value={state.name}
                onChange={handleChange}
                className="rounded-3"
              />
            </Item>

            <Item label="Email Address" required>
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

            <Item label="Password" required>
              <Input.Password
                size="large"
                prefix={<LockOutlined className="text-muted" />}
                placeholder="At least 6 characters"
                name="password"
                value={state.password}
                onChange={handleChange}
                className="rounded-3"
              />
            </Item>

            <Item label="Confirm Password" required>
              <Input.Password
                size="large"
                prefix={<LockOutlined className="text-muted" />}
                placeholder="Re-enter password"
                name="confirmPassword"
                value={state.confirmPassword}
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
              className="rounded-pill fw-semibold mt-2"
              style={{ backgroundColor: "#2563eb", borderColor: "#2563eb", height: "44px" }}
            >
              Register Account
            </Button>
          </Form>

          <div className="text-center mt-4 pt-3 border-top">
            <Paragraph className="mb-0 text-muted small">
              Already have an account? <Link to="/auth/login" className="fw-bold text-primary">Login here</Link>
            </Paragraph>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Register