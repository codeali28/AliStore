import { useState } from "react"
import { Route, Routes, Link, useLocation, useNavigate } from "react-router-dom"
import { Button, Drawer } from "antd"
import {
  DashboardOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  LogoutOutlined,
  ShopOutlined,
  UserOutlined,
  MenuOutlined
} from "@ant-design/icons"
import AdminHome from "./Home"
import ProductsIndex from "./Products"
import AdminOrders from "./Orders"
import NoPage from "@/components/Misc/NoPage"
import { useAuth } from "@/context/Auth"

const Dashboard = () => {
  const { user, handleLogout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  const isActive = (path) => {
    if (path === "/admin" && location.pathname === "/admin") return true
    if (path !== "/admin" && location.pathname.startsWith(path)) return true
    return false
  }

  const navContent = (
    <div className="d-flex flex-column h-100 p-3" style={{ backgroundColor: "#0f172a" }}>
      {/* Brand */}
      <div className="d-flex align-items-center mb-4 px-2 pt-2">
        <span
          className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-3 me-2 shadow-sm"
          style={{ width: "36px", height: "36px", fontSize: "18px" }}
        >
          🛍️
        </span>
        <div>
          <h4 className="mb-0 fw-bold text-white">Ali<span className="text-white">Store</span></h4>
          <span className="badge bg-danger small" style={{ fontSize: "11px" }}>Admin Panel</span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="nav flex-column gap-1 mb-auto">
        <Link
          to="/admin"
          onClick={() => setMobileDrawerOpen(false)}
          className={`nav-link d-flex align-items-center px-3 py-2 rounded-3 text-decoration-none transition ${
            isActive("/admin") ? "bg-primary text-white fw-bold shadow-sm" : "text-light opacity-75 hover-opacity-100"
          }`}
        >
          <DashboardOutlined className="me-3 fs-5" />
          Dashboard
        </Link>

        <Link
          to="/admin/products"
          onClick={() => setMobileDrawerOpen(false)}
          className={`nav-link d-flex align-items-center px-3 py-2 rounded-3 text-decoration-none transition ${
            isActive("/admin/products") ? "bg-primary text-white fw-bold shadow-sm" : "text-light opacity-75 hover-opacity-100"
          }`}
        >
          <AppstoreOutlined className="me-3 fs-5" />
          Products
        </Link>

        <Link
          to="/admin/orders"
          onClick={() => setMobileDrawerOpen(false)}
          className={`nav-link d-flex align-items-center px-3 py-2 rounded-3 text-decoration-none transition ${
            isActive("/admin/orders") ? "bg-primary text-white fw-bold shadow-sm" : "text-light opacity-75 hover-opacity-100"
          }`}
        >
          <ShoppingOutlined className="me-3 fs-5" />
          Orders
        </Link>

        <hr className="my-3 border-secondary" />

        <Link
          to="/"
          onClick={() => setMobileDrawerOpen(false)}
          className="nav-link d-flex align-items-center px-3 py-2 rounded-3 text-light opacity-75 text-decoration-none"
        >
          <ShopOutlined className="me-3 fs-5" />
          Go to Store
        </Link>
      </nav>

      {/* Footer / User Profile */}
      <div className="pt-3 border-top border-secondary mt-auto">
        <div className="d-flex align-items-center justify-content-between mb-2 px-2">
          <div className="d-flex align-items-center gap-2 text-truncate">
            <div
              className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white"
              style={{ width: "32px", height: "32px" }}
            >
              <UserOutlined />
            </div>
            <div className="text-truncate">
              <span className="d-block small fw-bold text-white text-truncate" style={{ maxWidth: "120px" }}>
                {user?.name || user?.fullName || "Admin"}
              </span>
              <span className="d-block text-muted" style={{ fontSize: "11px", color:"white" }}>Administrator</span>
            </div>
          </div>

          <Button
            type="text"
            danger
            icon={<LogoutOutlined />}
            onClick={() => {
              setMobileDrawerOpen(false)
              handleLogout()
            }}
            title="Logout"
          />
        </div>
      </div>
    </div>
  )

  return (
    <div className="admin-layout d-flex min-vh-100 flex-column flex-lg-row" style={{ backgroundColor: "#f8fafc" }}>
      {/* Mobile Admin Header */}
      <div className="d-flex d-lg-none align-items-center justify-content-between bg-dark text-white p-3 border-bottom">
        <div className="d-flex align-items-center">
          <span className="me-2 fs-5">🛍️</span>
          <span className="fw-bold">Ali<span className="text-primary">Store</span> Admin</span>
        </div>
        <Button
          type="text"
          className="text-white border-0"
          icon={<MenuOutlined className="fs-5" />}
          onClick={() => setMobileDrawerOpen(true)}
        />
      </div>

      {/* Mobile Drawer */}
      <Drawer
        placement="left"
        closable={false}
        onClose={() => setMobileDrawerOpen(false)}
        open={mobileDrawerOpen}
        styles={{ body: { padding: 0 } }}
        width={260}
      >
        {navContent}
      </Drawer>

      {/* Desktop Sticky Sidebar */}
      <aside
        className="admin-sidebar d-none d-lg-flex flex-column text-white shadow"
        style={{
          width: "260px",
          minWidth: "260px",
          backgroundColor: "#0f1932ff",
          minHeight: "100vh",
          position: "sticky",
          top: 0
        }}
      >
        {navContent}
      </aside>

      {/* Main Content Area */}
      <div className="admin-content flex-grow-1 p-3 p-md-4 p-lg-5 overflow-auto">
        <Routes>
          <Route path="/" element={<AdminHome />} />
          <Route path="products/*" element={<ProductsIndex />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </div>
    </div>
  )
}

export default Dashboard