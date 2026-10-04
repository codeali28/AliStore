import { useState } from "react"
import { Form, Input, Typography, Button, Select, Divider } from "antd"
import { useNavigate } from "react-router-dom"
import {
  ArrowLeftOutlined,
  CheckOutlined,
  PictureOutlined,
  CloudUploadOutlined
} from "@ant-design/icons"
import axios from "axios"

const { Title } = Typography
const { Item } = Form
const { Option } = Select

const initialState = {
  name: "",
  price: "",
  category: "Electronics",
  description: "",
  imageUrl: ""
}

const AddProduct = () => {
  const [state, setState] = useState(initialState)
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const navigate = useNavigate()

  const handleChange = e => {
    const { name, value } = e.target
    setState(s => ({ ...s, [name]: value }))

    if (name === "imageUrl" && value && !imageFile) {
      setPreviewUrl(value)
    }
  }

  const handleImageFileChange = e => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault()
    let { name, price, category, description, imageUrl } = state

    name = name.trim()
    if (!name) {
      return window.toastify ? window.toastify("Please enter product name", "error") : alert("Enter name")
    }
    if (!price || isNaN(price) || Number(price) <= 0) {
      return window.toastify ? window.toastify("Please enter a valid price greater than 0", "error") : alert("Enter price")
    }
    if (!imageFile && !imageUrl) {
      return window.toastify ? window.toastify("Please provide a product image (file upload or URL)", "error") : alert("Provide image")
    }

    const formData = new FormData()
    formData.append("name", name)
    formData.append("price", price)
    formData.append("category", category)
    formData.append("description", description)

    if (imageFile) {
      formData.append("image", imageFile)
    } else if (imageUrl) {
      formData.append("imageUrl", imageUrl)
    }

    setIsProcessing(true)
    const token = localStorage.getItem("jwt")

    axios.post("http://localhost:8000/api/products", formData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status === 201) {
          if (window.toastify) {
            window.toastify("Product created and saved to store successfully!", "success")
          }
          navigate("/admin/products")
        }
      })
      .catch(err => {
        console.error("Create product error:", err)
        const errMsg = err.response?.data?.message || "Failed to create product"
        if (window.toastify) {
          window.toastify(errMsg, "error")
        }
      })
      .finally(() => {
        setIsProcessing(false)
      })
  }

  return (
    <div className="add-product-page">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/admin/products")}
            className="ps-0 mb-1 text-secondary"
          >
            Back to Products
          </Button>
          <Title level={3} className="fw-bold mb-0 text-dark">Add New Product</Title>
        </div>
      </div>

      <div className="row g-4">
        {/* Form Column */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <Form layout="vertical" onFinish={handleSubmit}>
              <Item label={<span className="fw-medium small">Product Name</span>} required>
                <Input
                  size="large"
                  placeholder="e.g. Wireless Noise-Cancelling Headphones"
                  name="name"
                  value={state.name}
                  onChange={handleChange}
                  className="rounded-3"
                />
              </Item>

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <Item label={<span className="fw-medium small">Price ($)</span>} required>
                    <Input
                      type="number"
                      step="0.01"
                      size="large"
                      placeholder="e.g. 59.99"
                      name="price"
                      value={state.price}
                      onChange={handleChange}
                      className="rounded-3"
                    />
                  </Item>
                </div>

                <div className="col-12 col-md-6">
                  <Item label={<span className="fw-medium small">Category</span>}>
                    <Select
                      size="large"
                      value={state.category}
                      onChange={val => setState(s => ({ ...s, category: val }))}
                      className="w-100"
                    >
                      <Option value="Electronics">Electronics</Option>
                      <Option value="Fashion">Fashion</Option>
                      <Option value="Home & Living">Home & Living</Option>
                      <Option value="Accessories">Accessories</Option>
                      <Option value="General">General</Option>
                    </Select>
                  </Item>
                </div>
              </div>

              <Item label={<span className="fw-medium small">Description</span>}>
                <Input.TextArea
                  rows={4}
                  placeholder="Enter a comprehensive description of product features, specifications, and details..."
                  name="description"
                  value={state.description}
                  onChange={handleChange}
                  className="rounded-3"
                />
              </Item>

              <Divider className="my-3" />

              <div className="mb-3">
                <label className="form-label fw-medium small mb-1">Upload Product Image (Cloudinary)</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control form-control-lg rounded-3"
                  onChange={handleImageFileChange}
                />
                <span className="text-muted small">Select an image file to upload securely to Cloudinary storage.</span>
              </div>

              <Item label={<span className="fw-medium small">Or Enter Direct Image URL</span>}>
                <Input
                  size="large"
                  placeholder="https://images.unsplash.com/..."
                  name="imageUrl"
                  value={state.imageUrl}
                  onChange={handleChange}
                  className="rounded-3"
                  disabled={!!imageFile}
                />
              </Item>

              <div className="d-flex gap-3 mt-4">
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  loading={isProcessing}
                  icon={<CheckOutlined />}
                  className="rounded-pill px-5 fw-semibold shadow-sm"
                  style={{ backgroundColor: "#2563eb", borderColor: "#2563eb", height: "46px" }}
                >
                  Save Product
                </Button>
                <Button
                  size="large"
                  onClick={() => navigate("/admin/products")}
                  className="rounded-pill px-4"
                  style={{ height: "46px" }}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </div>
        </div>

        {/* Live Preview Column */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white sticky-top" style={{ top: "90px" }}>
            <h6 className="fw-bold text-muted mb-3 d-flex align-items-center">
              <PictureOutlined className="me-2" /> Live Image Preview
            </h6>

            <div
              className="rounded-4 p-3 d-flex align-items-center justify-content-center border"
              style={{
                height: "240px",
                backgroundColor: "#f8fafc"
              }}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Product Preview"
                  style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                />
              ) : (
                <div className="text-center text-muted">
                  <CloudUploadOutlined style={{ fontSize: "40px", opacity: 0.4 }} />
                  <p className="small mt-2 mb-0">No image chosen yet</p>
                </div>
              )}
            </div>

            <div className="mt-3">
              <span className="badge bg-primary-subtle text-primary rounded-pill small mb-1">
                {state.category}
              </span>
              <h6 className="fw-bold mb-1 text-truncate text-dark">
                {state.name || "Product Name"}
              </h6>
              <span className="text-primary fw-bold fs-5">
                ${state.price ? Number(state.price).toFixed(2) : "0.00"}
              </span>
              <p className="text-muted small mt-2 text-truncate">
                {state.description || "Product description will preview here."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddProduct
