import { useEffect, useState } from 'react'
import { Button, Typography, Table, Image, Popconfirm, Tag, Space, Input } from 'antd'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined
} from '@ant-design/icons'
import axios from 'axios'

const { Title, Text } = Typography

const AllProducts = () => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [search, setSearch] = useState("")
  const navigate = useNavigate()

  const fetchProducts = () => {
    setIsLoading(true)
    axios.get("https://ali-store-r77xam98c-ali-projects12.vercel.app/api/products")
      .then((res) => {
        const { status, data } = res
        if (status === 200 && data.products) {
          setProducts(data.products.map((p, idx) => ({ ...p, key: p.id || p._id, index: idx + 1 })))
        }
      })
      .catch(error => {
        console.error("Fetch products error:", error)
        if (window.toastify) {
          window.toastify("Failed to fetch products from database", "error")
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDelete = (product) => {
    const prodId = product.id || product._id
    const token = localStorage.getItem("jwt")

    axios.delete(`https://ali-store-r77xam98c-ali-projects12.vercel.app/api/products/${prodId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        if (res.status === 200) {
          setProducts(prev => prev.filter(item => (item.id || item._id) !== prodId))
          if (window.toastify) {
            window.toastify(`"${product.name}" deleted successfully`, "success")
          }
        }
      })
      .catch(error => {
        console.error("Delete product error:", error)
        const msg = error.response?.data?.message || "Failed to delete product"
        if (window.toastify) {
          window.toastify(msg, "error")
        }
      })
  }

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  )

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      width: 50,
      render: (_, __, idx) => <span className="text-muted small">{idx + 1}</span>
    },
    {
      title: 'Image',
      dataIndex: 'image',
      width: 90,
      render: (img, record) => (
        <Image
          src={img || record.imageURL || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100"}
          className="rounded-3 border"
          width={52}
          height={52}
          style={{ objectFit: "contain", backgroundColor: "#f8fafc" }}
          fallback="https://via.placeholder.com/60"
        />
      )
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
      render: (name, record) => (
        <div>
          <span className="fw-semibold text-dark d-block" style={{ fontSize: "14px" }}>{name}</span>
          <span className="text-muted small text-truncate d-inline-block" style={{ maxWidth: "260px" }}>
            {record.description}
          </span>
        </div>
      )
    },
    {
      title: 'Category',
      dataIndex: 'category',
      render: cat => <Tag color="blue" className="rounded-pill px-2">{cat || "General"}</Tag>
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render: price => <span className="fw-bold text-primary">${Number(price).toFixed(2)}</span>
    },
    {
      title: 'Date Added',
      dataIndex: 'createdAt',
      render: date => <Text className="small text-muted">{dayjs(date).format("MMM DD, YYYY")}</Text>
    },
    {
      title: 'Actions',
      width: 160,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/products/edit/${record.id || record._id}`)}
            className="rounded-pill"
            style={{ backgroundColor: "#2563eb", borderColor: "#2563eb" }}
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete Product"
            description={`Are you sure you want to delete "${record.name}"?`}
            onConfirm={() => handleDelete(record)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
              className="rounded-pill"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <div className="admin-products-page">
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 gap-3">
        <div>
          <Title level={3} className="fw-bold mb-1 text-dark">Products Management</Title>
          <p className="text-muted small mb-0">View, create, edit, and remove products from the store</p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <Button icon={<ReloadOutlined />} onClick={fetchProducts} title="Refresh catalog" className="rounded-3" />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => navigate("/admin/products/add")}
            className="rounded-pill fw-semibold shadow-sm"
            style={{ backgroundColor: "#2563eb", borderColor: "#2563eb" }}
          >
            Add Product
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-6">
            <Input
              placeholder="Search products by title or category..."
              prefix={<SearchOutlined className="text-muted" />}
              value={search}
              onChange={e => setSearch(e.target.value)}
              allowClear
              className="rounded-3"
            />
          </div>
          <div className="col-12 col-md-6 text-md-end text-muted small">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden p-2">
        <Table
          columns={columns}
          dataSource={filteredProducts}
          loading={isLoading}
          pagination={{ pageSize: 8, showTotal: total => `Total ${total} items` }}
          scroll={{ x: 700 }}
        />
      </div>
    </div>
  )
}

export default AllProducts
