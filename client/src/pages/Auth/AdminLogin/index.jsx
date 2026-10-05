import { useState } from "react"
import { Form, Input, Typography, Button, Alert } from "antd"
import { LockOutlined, MailOutlined, SafetyCertificateOutlined, ArrowLeftOutlined } from "@ant-design/icons"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/Auth"
import axios from "axios"

const { Title, Paragraph } = Typography
const { Item } = Form

const AdminLogin = () => {
    const { handleLoginSuccess, readProfile } = useAuth()
    const navigate = useNavigate()

    const [state, setState] = useState({ email: "", password: "" })
    const [isProcessing, setIsProcessing] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const handleChange = e => {
        setErrorMessage("")
        setState(s => ({ ...s, [e.target.name]: e.target.value }))
    }

    const handleAdminLogin = (e) => {
        if (e && e.preventDefault) e.preventDefault()
        let { email, password } = state

        email = (email || "").trim()
        if (!email || !password) {
            setErrorMessage("Please provide both administrator email and password.")
            return
        }

        setIsProcessing(true)
        setErrorMessage("")

        // Post login with isAdminLogin: true flag
        axios.post(`${import.meta.env.VITE_API_URL}/api/login`, { email, password, isAdminLogin: true })
            .then(res => {
                const { status, data } = res
                if (status === 200) {
                    if (data.user?.role !== "admin") {
                        setErrorMessage("Access Denied: This account does not possess administrator privileges.")
                        return
                    }

                    localStorage.setItem("jwt", data.token)
                    if (handleLoginSuccess) {
                        handleLoginSuccess(data.token, data.user)
                    } else {
                        readProfile(data.token)
                    }

                    if (window.toastify) {
                        window.toastify("Welcome to Admin Dashboard!", "success")
                    }

                    navigate("/admin")
                }
            })
            .catch(err => {
                console.error("Admin login error:", err)
                const msg = err.response?.data?.message || "Invalid credentials or unauthorized access."
                setErrorMessage(msg)
            })
            .finally(() => {
                setIsProcessing(false)
            })
    }

    return (
        <main
            className="admin-login-page py-5 d-flex align-items-center justify-content-center"
            style={{
                minHeight: "88vh",
                backgroundColor: "#0b1120",
                backgroundImage: "radial-gradient(ellipse at 50% 0%, rgba(37, 99, 235, 0.15) 0%, transparent 70%)"
            }}
        >
            <style>{`
                .admin-login-card .ant-input-affix-wrapper,
                .admin-login-card .ant-input {
                    background-color: #0f172a !important;
                    border-color: #334155 !important;
                    color: #f8fafc !important;
                }
                .admin-login-card .ant-input-affix-wrapper input {
                    background-color: transparent !important;
                    color: #f8fafc !important;
                }
                .admin-login-card .ant-input-affix-wrapper input::placeholder,
                .admin-login-card .ant-input::placeholder {
                    color: #64748b !important;
                }
                .admin-login-card .ant-input-affix-wrapper:hover,
                .admin-login-card .ant-input:hover {
                    border-color: #475569 !important;
                }
                .admin-login-card .ant-input-affix-wrapper-focused,
                .admin-login-card .ant-input:focus {
                    border-color: #2563eb !important;
                    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.25) !important;
                }
                .admin-login-card .ant-input-password-icon {
                    color: #94a3b8 !important;
                    transition: color 0.2s ease;
                }
                .admin-login-card .ant-input-password-icon:hover {
                    color: #60a5fa !important;
                }
                .admin-login-card .return-link {
                    color: #94a3b8;
                    transition: color 0.2s ease;
                }
                .admin-login-card .return-link:hover {
                    color: #60a5fa;
                }
            `}</style>

            <div className="container px-3">
                <div
                    className="card admin-login-card border-0 shadow-lg rounded-4 p-4 p-md-5 mx-auto text-light"
                    style={{
                        maxWidth: "450px",
                        backgroundColor: "#1e293b",
                        border: "1px solid rgba(51, 65, 85, 0.8)",
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                    }}
                >
                    {/* Header Branding */}
                    <div className="text-center mb-4">
                        <div
                            className="d-inline-flex align-items-center justify-content-center rounded-4 mb-3 shadow"
                            style={{
                                width: "56px",
                                height: "56px",
                                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                                color: "#ffffff",
                                fontSize: "26px",
                                boxShadow: "0 8px 16px rgba(37, 99, 235, 0.35)"
                            }}
                        >
                            <SafetyCertificateOutlined />
                        </div>
                        <Title level={3} style={{ color: "#ffffff", marginBottom: "6px", fontWeight: 700, letterSpacing: "-0.5px" }}>
                            AliStore Admin Portal
                        </Title>
                        <Paragraph style={{ color: "#94a3b8", fontSize: "13.5px", marginBottom: 0 }}>
                            Secure store management & catalog administration
                        </Paragraph>
                    </div>

                    {/* Error Feedback */}
                    {errorMessage && (
                        <Alert
                            message={errorMessage}
                            type="error"
                            showIcon
                            className="mb-4 rounded-3"
                            style={{
                                backgroundColor: "rgba(239, 68, 68, 0.1)",
                                border: "1px solid rgba(239, 68, 68, 0.3)",
                                color: "#fca5a5"
                            }}
                        />
                    )}

                    {/* Admin Login Form */}
                    <Form layout="vertical" onFinish={handleAdminLogin} requiredMark={false}>
                        <Item
                            label={<span style={{ color: "#cbd5e1" }} className="small fw-medium">Administrator Email</span>}
                            className="mb-3"
                        >
                            <Input
                                type="email"
                                size="large"
                                prefix={<MailOutlined style={{ color: "#64748b", marginRight: "6px" }} />}
                                placeholder="admin@shophub.com"
                                name="email"
                                value={state.email}
                                onChange={handleChange}
                                className="rounded-3"
                                style={{ height: "46px" }}
                            />
                        </Item>

                        <Item
                            label={<span style={{ color: "#cbd5e1" }} className="small fw-medium">Password</span>}
                            className="mb-4"
                        >
                            <Input.Password
                                size="large"
                                prefix={<LockOutlined style={{ color: "#64748b", marginRight: "6px" }} />}
                                placeholder="Enter admin password"
                                name="password"
                                value={state.password}
                                onChange={handleChange}
                                className="rounded-3"
                                style={{ height: "46px" }}
                            />
                        </Item>

                        <Button
                            type="primary"
                            size="large"
                            block
                            htmlType="submit"
                            loading={isProcessing}
                            className="rounded-pill fw-semibold mt-2 shadow-sm d-flex align-items-center justify-content-center"
                            style={{
                                backgroundColor: "#2563eb",
                                borderColor: "#2563eb",
                                height: "46px",
                                fontSize: "15px",
                                boxShadow: "0 4px 14px rgba(37, 99, 235, 0.4)"
                            }}
                        >
                            Log In to Dashboard
                        </Button>
                    </Form>

                    {/* Navigation Footer */}
                    <div className="mt-4 pt-3 border-top text-center" style={{ borderColor: "#334155" }}>
                        <Link to="/" className="text-decoration-none small return-link d-inline-flex align-items-center gap-1">
                            <ArrowLeftOutlined /> Return to Customer Store
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default AdminLogin
