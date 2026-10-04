import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Badge, Button, Dropdown, Space } from "antd"
import {
  ShoppingCartOutlined,
  UserOutlined,
  DashboardOutlined,
  LogoutOutlined,
  ShoppingOutlined,
  LockOutlined,
  ThunderboltOutlined,
  MenuOutlined,
  CloseOutlined
} from "@ant-design/icons"
import { useAuth } from "@/context/Auth"
import { useCart } from "@/context/Cart"

const Navbar = () => {
  const { isAuth, user, isAdmin, handleLogout } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const displayName = user?.name || user?.fullName || user?.email?.split("@")[0] || "User"

  const userMenuItems = [
    {
      key: "orders",
      label: "My Orders",
      icon: <ShoppingOutlined />,
      onClick: () => {
        setMobileMenuOpen(false)
        navigate("/orders")
      }
    },
    ...(isAdmin ? [{
      key: "admin-dash",
      label: "Admin Dashboard",
      icon: <DashboardOutlined />,
      onClick: () => {
        setMobileMenuOpen(false)
        navigate("/admin")
      }
    }] : []),
    {
      type: "divider"
    },
    {
      key: "logout",
      label: "Logout",
      danger: true,
      icon: <LogoutOutlined />,
      onClick: () => {
        setMobileMenuOpen(false)
        handleLogout()
      }
    }
  ]

  const isActive = (path) => location.pathname === path

  const closeMobile = () => setMobileMenuOpen(false)

  return (
    <header className="sticky-top shadow-sm" style={{ zIndex: 1020 }}>
      {/* Top Announcement Bar */}
      <div className="top-announcement-bar py-1 px-3 text-center border-bottom border-dark">
        <div className="container d-flex align-items-center justify-content-between">
          <span className="small text-truncate mx-auto">
            <ThunderboltOutlined className="text-warning me-1" />
            Cash on Delivery Available Nationwide | 100% Quality Assurance
          </span>
          <div className="d-none d-md-block">
            <Link to="/contact" className="text-decoration-none text-light opacity-75 small hover-opacity-100">
              Need Help? Support
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white py-3 border-bottom">
        <div className="container">
          {/* Brand Logo */}
          <Link to="/" className="navbar-brand d-flex align-items-center fw-bold text-primary fs-3" onClick={closeMobile}>
            <span
              className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-3 me-2 shadow-sm"
              style={{ width: "38px", height: "38px", fontSize: "19px" }}
            >
              🛍️
            </span>
            <span>Ali<span className="text-dark">Store</span></span>
          </Link>

          {/* Mobile Right Quick Icons (Cart + Toggle) */}
          <div className="d-flex align-items-center gap-2 d-lg-none">
            <Link
              to="/cart"
              className="btn btn-light position-relative rounded-circle d-flex align-items-center justify-content-center border"
              style={{ width: "40px", height: "40px" }}
              title="Cart"
              onClick={closeMobile}
            >
              <Badge count={cartCount} offset={[4, -4]} size="small" color="#2563eb">
                <ShoppingCartOutlined style={{ fontSize: "19px", color: "#1e293b" }} />
              </Badge>
            </Link>

            <button
              className="btn btn-light border rounded-3 p-2"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
            </button>
          </div>

          {/* Desktop Nav Links */}
          <div className={`collapse navbar-collapse ${mobileMenuOpen ? "show mt-3" : ""}`} id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
              <li className="nav-item">
                <Link
                  to="/"
                  className={`nav-link px-3 fw-medium ${isActive("/") ? "text-primary fw-bold" : "text-secondary"}`}
                  onClick={closeMobile}
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/shop"
                  className={`nav-link px-3 fw-medium ${isActive("/shop") ? "text-primary fw-bold" : "text-secondary"}`}
                  onClick={closeMobile}
                >
                  Shop
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/about"
                  className={`nav-link px-3 fw-medium ${isActive("/about") ? "text-primary fw-bold" : "text-secondary"}`}
                  onClick={closeMobile}
                >
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/contact"
                  className={`nav-link px-3 fw-medium ${isActive("/contact") ? "text-primary fw-bold" : "text-secondary"}`}
                  onClick={closeMobile}
                >
                  Contact
                </Link>
              </li>
            </ul>

            {/* Right Side Icons & Auth */}
            <div className="d-flex flex-wrap align-items-center gap-2 pt-2 pt-lg-0">
              {/* Desktop Cart Icon */}
              <Link
                to="/cart"
                className="btn btn-light position-relative rounded-circle d-none d-lg-flex align-items-center justify-content-center border me-1"
                style={{ width: "42px", height: "42px" }}
                title="View Cart"
              >
                <Badge count={cartCount} offset={[6, -4]} size="small" color="#2563eb">
                  <ShoppingCartOutlined style={{ fontSize: "20px", color: "#1e293b" }} />
                </Badge>
              </Link>

              {/* Admin Dashboard button if admin */}
              {isAuth && isAdmin && (
                <Button
                  type="primary"
                  icon={<DashboardOutlined />}
                  onClick={() => {
                    closeMobile()
                    navigate("/admin")
                  }}
                  className="rounded-pill fw-semibold shadow-sm"
                  style={{ backgroundColor: "#0f172a", borderColor: "#0f172a" }}
                >
                  Admin Panel
                </Button>
              )}

              {/* User authentication controls */}
              {isAuth ? (
                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
                  <Button
                    type="default"
                    className="rounded-pill d-flex align-items-center px-3 py-2 border shadow-sm"
                    style={{ height: "40px" }}
                  >
                    <UserOutlined className="text-primary me-2" />
                    <span className="fw-medium text-dark text-truncate" style={{ maxWidth: "130px" }}>{displayName}</span>
                    {isAdmin && (
                      <span className="badge bg-danger ms-2" style={{ fontSize: "10px" }}>Admin</span>
                    )}
                  </Button>
                </Dropdown>
              ) : (
                <Space wrap>
                  <Button
                    type="text"
                    onClick={() => {
                      closeMobile()
                      navigate("/auth/login")
                    }}
                    className="fw-medium text-secondary"
                  >
                    Login
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      closeMobile()
                      navigate("/auth/register")
                    }}
                    className="rounded-pill fw-medium shadow-sm"
                    style={{ backgroundColor: "#2563eb", borderColor: "#2563eb" }}
                  >
                    Register
                  </Button>
                  <Button
                    type="dashed"
                    icon={<LockOutlined />}
                    onClick={() => {
                      closeMobile()
                      navigate("/admin/login")
                    }}
                    className="rounded-pill text-muted small"
                    title="Administrator Login"
                  >
                    Admin
                  </Button>
                </Space>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar