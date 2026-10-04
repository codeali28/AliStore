import { useState, useEffect } from 'react'
import { Card, Typography, Button, Spin, Row, Col } from 'antd'
import {
  AppstoreOutlined,
  ShoppingOutlined,
  PlusOutlined,
  EyeOutlined,
  DollarOutlined,
  CheckCircleOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '@/context/Auth'

const { Title, Paragraph } = Typography

const AdminHome = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [stats, setStats] = useState({
    productsCount: 0,
    ordersCount: 0,
    totalRevenue: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("jwt")
    setIsLoading(true)

    Promise.all([
      axios.get("http://localhost:8000/api/products"),
      axios.get("http://localhost:8000/api/orders/all", {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => ({ data: { orders: [] } }))
    ])
      .then(([prodRes, ordRes]) => {
        const products = prodRes.data?.products || []
        const orders = ordRes.data?.orders || []
        const revenue = orders.reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0)

        setStats({
          productsCount: products.length,
          ordersCount: orders.length,
          totalRevenue: revenue
        })
      })
      .catch(err => {
        console.error("Dashboard stats error:", err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  return (
    <div className="admin-home-dashboard">
      <div className="mb-4">
        <Title level={2} className="fw-bold mb-1 text-dark">
          Store Dashboard
        </Title>
        <Paragraph className="text-muted">
          Welcome back, <span className="fw-semibold text-dark">{user?.name || user?.fullName || "Administrator"}</span>. Monitor catalog status and customer orders.
        </Paragraph>
      </div>

      {/* KPI Cards */}
      <Row gutter={[20, 20]} className="mb-4">
        <Col xs={24} sm={12} lg={8}>
          <Card className="border-0 shadow-sm rounded-4 bg-white h-100">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small fw-medium text-uppercase" style={{ letterSpacing: "0.04em" }}>Total Products</span>
                <h3 className="fw-bold text-dark mt-2 mb-0 display-6" style={{ fontSize: "28px" }}>
                  {isLoading ? <Spin size="small" /> : stats.productsCount}
                </h3>
                <span className="badge bg-primary-subtle text-primary rounded-pill small mt-2">Active in Catalog</span>
              </div>
              <div
                className="d-flex align-items-center justify-content-center rounded-3 shadow-sm"
                style={{ width: "52px", height: "52px", backgroundColor: "#eff6ff", color: "#2563eb", fontSize: "24px" }}
              >
                <AppstoreOutlined />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card className="border-0 shadow-sm rounded-4 bg-white h-100">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small fw-medium text-uppercase" style={{ letterSpacing: "0.04em" }}>Customer Orders</span>
                <h3 className="fw-bold text-dark mt-2 mb-0 display-6" style={{ fontSize: "28px" }}>
                  {isLoading ? <Spin size="small" /> : stats.ordersCount}
                </h3>
                <span className="badge bg-success-subtle text-success rounded-pill small mt-2">Cash on Delivery</span>
              </div>
              <div
                className="d-flex align-items-center justify-content-center rounded-3 shadow-sm"
                style={{ width: "52px", height: "52px", backgroundColor: "#f0fdf4", color: "#16a34a", fontSize: "24px" }}
              >
                <ShoppingOutlined />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card className="border-0 shadow-sm rounded-4 bg-white h-100">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small fw-medium text-uppercase" style={{ letterSpacing: "0.04em" }}>Total Order Volume</span>
                <h3 className="fw-bold text-primary mt-2 mb-0 display-6" style={{ fontSize: "28px" }}>
                  {isLoading ? <Spin size="small" /> : `$${stats.totalRevenue.toFixed(2)}`}
                </h3>
                <span className="badge bg-warning-subtle text-warning-emphasis rounded-pill small mt-2">Total Gross</span>
              </div>
              <div
                className="d-flex align-items-center justify-content-center rounded-3 shadow-sm"
                style={{ width: "52px", height: "52px", backgroundColor: "#fef3c7", color: "#d97706", fontSize: "24px" }}
              >
                <DollarOutlined />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions Card */}
      <Card className="border-0 shadow-sm rounded-4 bg-white p-3 mb-4">
        <h5 className="fw-bold mb-3 text-dark">Management Shortcuts</h5>
        <div className="d-flex flex-wrap gap-3">
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => navigate("/admin/products/add")}
            className="rounded-pill fw-semibold shadow-sm"
            style={{ backgroundColor: "#2563eb", borderColor: "#2563eb" }}
          >
            Add New Product
          </Button>

          <Button
            size="large"
            icon={<AppstoreOutlined />}
            onClick={() => navigate("/admin/products")}
            className="rounded-pill fw-medium"
          >
            Manage Products
          </Button>

          <Button
            size="large"
            icon={<ShoppingOutlined />}
            onClick={() => navigate("/admin/orders")}
            className="rounded-pill fw-medium"
          >
            View Customer Orders
          </Button>

          <Button
            size="large"
            icon={<EyeOutlined />}
            onClick={() => navigate("/")}
            className="rounded-pill fw-medium"
          >
            Preview Customer Store
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default AdminHome