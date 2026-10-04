import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Typography, Tag, Button, Spin, Empty, Modal } from 'antd'
import {
  ShoppingOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import axios from 'axios'
import { useAuth } from '@/context/Auth'

const { Title, Text } = Typography

const Orders = () => {
  const { isAuth } = useAuth()
  const navigate = useNavigate()

  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (!isAuth) {
      navigate("/auth/login?redirect=/orders")
      return
    }

    const token = localStorage.getItem("jwt")
    setIsLoading(true)

    axios.get("https://ali-store-r77xam98c-ali-projects12.vercel.app/api/orders/my-orders", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.data && res.data.orders) {
          setOrders(res.data.orders)
        }
      })
      .catch(err => {
        console.error("Error fetching orders:", err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [isAuth, navigate])

  const getStatusBadge = (status) => {
    const s = status || "Processing"
    if (s.toLowerCase() === "delivered") {
      return <Tag color="green" icon={<CheckCircleOutlined />} className="rounded-pill px-2">Delivered</Tag>
    } else if (s.toLowerCase() === "processing") {
      return <Tag color="blue" icon={<ClockCircleOutlined />} className="rounded-pill px-2">Processing</Tag>
    } else if (s.toLowerCase() === "cancelled") {
      return <Tag color="red" icon={<CloseCircleOutlined />} className="rounded-pill px-2">Cancelled</Tag>
    }
    return <Tag color="orange" className="rounded-pill px-2">{s}</Tag>
  }

  const handleOpenDetails = (order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  return (
    <main className="orders-page py-4">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 gap-2">
          <div>
            <h2 className="fw-bold mb-1 text-dark">My Orders</h2>
            <p className="text-muted small mb-0">Track and review your past Cash on Delivery purchases</p>
          </div>
          <Button type="primary" onClick={() => navigate("/shop")} className="rounded-pill shadow-sm">
            Continue Shopping
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-5">
            <Spin size="large" />
            <p className="text-muted mt-3 small">Loading your order history...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white my-4">
            <Empty
              description="You haven't placed any orders yet."
            >
              <Button
                type="primary"
                icon={<ShoppingOutlined />}
                onClick={() => navigate("/shop")}
                className="rounded-pill shadow-sm"
                style={{ backgroundColor: "#2563eb", borderColor: "#2563eb" }}
              >
                Start Shopping Now
              </Button>
            </Empty>
          </div>
        ) : (
          <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="ps-4 py-3">Order ID</th>
                    <th scope="col" className="py-3">Date</th>
                    <th scope="col" className="py-3">Status</th>
                    <th scope="col" className="py-3">Items</th>
                    <th scope="col" className="py-3">Total Amount</th>
                    <th scope="col" className="pe-4 py-3 text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => {
                    const totalItems = order.products?.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0) || 0
                    return (
                      <tr key={order._id || order.orderId}>
                        <td className="ps-4 py-3 fw-bold text-dark">
                          #{order.orderId || order._id?.slice(-6).toUpperCase()}
                        </td>
                        <td className="py-3 text-muted small">
                          {dayjs(order.createdAt).format("MMM DD, YYYY")}
                        </td>
                        <td className="py-3">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="py-3 small text-secondary">
                          {totalItems} {totalItems === 1 ? 'item' : 'items'}
                        </td>
                        <td className="py-3 fw-bold text-primary">
                          ${Number(order.totalPrice).toFixed(2)}
                        </td>
                        <td className="pe-4 py-3 text-end">
                          <Button
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={() => handleOpenDetails(order)}
                            className="rounded-pill"
                          >
                            View Details
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        <Modal
          title={`Order Details #${selectedOrder?.orderId || selectedOrder?._id?.slice(-6).toUpperCase()}`}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={[
            <Button key="close" type="primary" onClick={() => setIsModalOpen(false)} className="rounded-pill">
              Close
            </Button>
          ]}
          width={650}
        >
          {selectedOrder && (
            <div className="py-2">
              <div className="row g-3 mb-3 pb-3 border-bottom">
                <div className="col-6">
                  <span className="text-muted small d-block">Order Date:</span>
                  <span className="fw-medium text-dark">{dayjs(selectedOrder.createdAt).format("MMMM DD, YYYY, hh:mm A")}</span>
                </div>
                <div className="col-6">
                  <span className="text-muted small d-block">Status:</span>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <div className="col-6">
                  <span className="text-muted small d-block">Payment Method:</span>
                  <span className="fw-medium text-dark">{selectedOrder.paymentMethod || "Cash on Delivery"}</span>
                </div>
                <div className="col-6">
                  <span className="text-muted small d-block">Delivery Address:</span>
                  <span className="fw-medium text-dark">
                    {selectedOrder.shippingInfo?.address}, {selectedOrder.shippingInfo?.city}
                  </span>
                </div>
              </div>

              <h6 className="fw-bold mb-3 text-dark">Purchased Items</h6>
              <div className="list-group list-group-flush mb-3">
                {selectedOrder.products?.map((item, idx) => (
                  <div key={idx} className="list-group-item d-flex align-items-center justify-content-between px-0">
                    <div className="d-flex align-items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="rounded-2 border"
                          style={{ width: "48px", height: "48px", objectFit: "contain", backgroundColor: "#f8fafc" }}
                        />
                      )}
                      <div>
                        <h6 className="mb-0 fw-semibold text-dark">{item.name}</h6>
                        <span className="text-muted small">${Number(item.price).toFixed(2)} × {item.quantity}</span>
                      </div>
                    </div>
                    <span className="fw-bold text-dark">
                      ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                <span className="fw-bold fs-6 text-dark">Total Amount:</span>
                <span className="fw-bold fs-5 text-primary">
                  ${Number(selectedOrder.totalPrice).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </main>
  )
}

export default Orders
