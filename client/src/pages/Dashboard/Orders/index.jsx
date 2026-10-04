import { useState, useEffect } from 'react'
import { Table, Tag, Typography, Select, Button, Empty, Space } from 'antd'
import { ReloadOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import axios from 'axios'

const { Title } = Typography
const { Option } = Select

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchOrders = () => {
    setIsLoading(true)
    const token = localStorage.getItem("jwt")

    axios.get("https://ali-store-r77xam98c-ali-projects12.vercel.app/api/orders/all", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.data && res.data.orders) {
          setOrders(res.data.orders.map(o => ({ ...o, key: o._id || o.orderId })))
        }
      })
      .catch(err => {
        console.error("Fetch all orders error:", err)
        if (window.toastify) window.toastify("Failed to fetch store orders", "error")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleStatusChange = (orderId, newStatus) => {
    const token = localStorage.getItem("jwt")

    axios.patch(`https://ali-store-r77xam98c-ali-projects12.vercel.app/api/orders/${orderId}/status`, { status: newStatus }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.status === 200) {
          setOrders(prev => prev.map(o => (o.orderId === orderId || o._id === orderId) ? { ...o, status: newStatus } : o))
          if (window.toastify) window.toastify(`Order status updated to ${newStatus}`, "success")
        }
      })
      .catch(err => {
        console.error("Update status error:", err)
        if (window.toastify) window.toastify("Failed to update order status", "error")
      })
  }

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      render: (id, record) => <span className="fw-bold text-dark">#{id || record._id?.slice(-6).toUpperCase()}</span>
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      render: (name, record) => (
        <div>
          <span className="fw-semibold text-dark d-block">{name || "Customer"}</span>
          <span className="text-muted small">{record.shippingInfo?.phone || record.customerEmail}</span>
        </div>
      )
    },
    {
      title: 'Delivery Address',
      dataIndex: 'shippingInfo',
      render: info => (
        <span className="text-truncate d-inline-block small" style={{ maxWidth: "200px" }}>
          {info?.address}, {info?.city}
        </span>
      )
    },
    {
      title: 'Items',
      dataIndex: 'products',
      render: items => (
        <span className="small text-secondary">
          {items?.length || 0} product(s)
        </span>
      )
    },
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      render: total => <span className="fw-bold text-primary">${Number(total).toFixed(2)}</span>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status, record) => (
        <Select
          value={status || "Processing"}
          size="small"
          style={{ width: 130 }}
          onChange={val => handleStatusChange(record.orderId || record._id, val)}
          className="rounded-3"
        >
          <Option value="Pending"><Tag color="orange" className="rounded-pill">Pending</Tag></Option>
          <Option value="Processing"><Tag color="blue" className="rounded-pill">Processing</Tag></Option>
          <Option value="Delivered"><Tag color="green" className="rounded-pill">Delivered</Tag></Option>
          <Option value="Cancelled"><Tag color="red" className="rounded-pill">Cancelled</Tag></Option>
        </Select>
      )
    },
    {
      title: 'Date Placed',
      dataIndex: 'createdAt',
      render: d => <span className="text-muted small">{dayjs(d).format("MMM DD, YYYY")}</span>
    }
  ]

  return (
    <div className="admin-orders-page">
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 gap-2">
        <div>
          <Title level={3} className="fw-bold mb-1 text-dark">Customer Orders</Title>
          <p className="text-muted small mb-0">Track and manage store orders and Cash on Delivery fulfillment status</p>
        </div>
        <Button icon={<ReloadOutlined />} onClick={fetchOrders} className="rounded-3">Refresh Orders</Button>
      </div>

      <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden p-2">
        <Table
          columns={columns}
          dataSource={orders}
          loading={isLoading}
          pagination={{ pageSize: 8 }}
          scroll={{ x: 800 }}
          locale={{ emptyText: <Empty description="No customer orders received yet." /> }}
        />
      </div>
    </div>
  )
}

export default AdminOrders
