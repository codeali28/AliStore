import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Form, Input, Button, Typography } from 'antd'
import {
  SafetyCertificateOutlined,
  DollarCircleOutlined,
  CheckCircleFilled,
  LockOutlined
} from '@ant-design/icons'
import axios from 'axios'
import { useAuth } from '@/context/Auth'
import { useCart } from '@/context/Cart'

const { Title } = Typography

const Checkout = () => {
  const { isAuth, user } = useAuth()
  const { cart, cartTotal, clearCart } = useCart()
  const navigate = useNavigate()

  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || user?.fullName || "",
    address: "",
    city: "",
    phone: ""
  })
  const [isProcessing, setIsProcessing] = useState(false)

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      navigate("/cart")
    }
  }, [cart, navigate])

  // Update fullName if user loads
  useEffect(() => {
    if (user && !shippingInfo.fullName) {
      setShippingInfo(s => ({ ...s, fullName: user.name || user.fullName || "" }))
    }
  }, [user])

  const handleChange = (e) => {
    setShippingInfo(s => ({ ...s, [e.target.name]: e.target.value }))
  }

  const handlePlaceOrder = () => {
    if (!isAuth) {
      if (window.toastify) window.toastify("Please log in to place your order", "warning")
      navigate("/auth/login?redirect=/checkout")
      return
    }

    const { fullName, address, city, phone } = shippingInfo

    if (!fullName.trim()) {
      return window.toastify ? window.toastify("Please enter your full name", "error") : alert("Enter name")
    }
    if (!address.trim()) {
      return window.toastify ? window.toastify("Please enter your delivery address", "error") : alert("Enter address")
    }
    if (!city.trim()) {
      return window.toastify ? window.toastify("Please enter your city", "error") : alert("Enter city")
    }
    if (!phone.trim()) {
      return window.toastify ? window.toastify("Please enter your contact phone number", "error") : alert("Enter phone")
    }

    setIsProcessing(true)
    const token = localStorage.getItem("jwt")

    const orderPayload = {
      shippingInfo: {
        fullName: fullName.trim(),
        address: address.trim(),
        city: city.trim(),
        phone: phone.trim()
      },
      products: cart.map(item => ({
        productId: item.id || item.productId,
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity),
        image: item.image || ""
      })),
      totalPrice: cartTotal
    }

    axios.post(`${import.meta.env.VITE_API_URL}/api/orders`, orderPayload, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const { status, data } = res
        if (status === 201) {
          if (window.toastify) {
            window.toastify(data.message || "Order placed successfully! Cash on Delivery confirmed.", "success")
          }
          // Clear cart only after successful order creation
          clearCart()
          // Redirect to orders page
          navigate("/orders")
        }
      })
      .catch(err => {
        console.error("Order creation error:", err)
        const errMsg = err.response?.data?.message || "Something went wrong while placing your order."
        if (window.toastify) {
          window.toastify(errMsg, "error")
        }
      })
      .finally(() => {
        setIsProcessing(false)
      })
  }

  if (!isAuth) {
    return (
      <main className="checkout-page py-5">
        <div className="container py-4 text-center">
          <div className="card border-0 shadow-sm rounded-4 p-5 mx-auto bg-white" style={{ maxWidth: "460px" }}>
            <SafetyCertificateOutlined className="text-primary fs-1 mb-3" />
            <Title level={3} className="fw-bold mb-2">Account Required</Title>
            <p className="text-muted mb-4 small">
              Please sign in or create an account to proceed with Cash on Delivery checkout.
            </p>
            <div className="d-grid gap-2">
              <Button
                type="primary"
                size="large"
                onClick={() => navigate("/auth/login?redirect=/checkout")}
                className="rounded-pill fw-semibold shadow-sm"
                style={{ backgroundColor: "#2563eb", borderColor: "#2563eb" }}
              >
                Sign In to Continue
              </Button>
              <Button
                size="large"
                onClick={() => navigate("/auth/register")}
                className="rounded-pill"
              >
                Create an Account
              </Button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="checkout-page py-4">
      <div className="container">
        <div className="mb-4">
          <h2 className="fw-bold mb-1 text-dark">Checkout</h2>
          <p className="text-muted small mb-0">Confirm your delivery details and place your order</p>
        </div>

        <div className="row g-4">
          {/* Left Column: Shipping Form & Payment */}
          <div className="col-12 col-lg-7">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
              <h5 className="fw-bold mb-3 d-flex align-items-center text-dark">
                <span
                  className="badge bg-primary rounded-circle me-2 d-inline-flex align-items-center justify-content-center"
                  style={{ width: "24px", height: "24px", fontSize: "12px" }}
                >
                  1
                </span>
                Shipping Information
              </h5>

              <Form layout="vertical">
                <Form.Item label="Full Name" required>
                  <Input
                    size="large"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={shippingInfo.fullName}
                    onChange={handleChange}
                    className="rounded-3"
                  />
                </Form.Item>

                <Form.Item label="Delivery Address" required>
                  <Input.TextArea
                    rows={2}
                    name="address"
                    placeholder="Street address, apartment, building, etc."
                    value={shippingInfo.address}
                    onChange={handleChange}
                    className="rounded-3"
                  />
                </Form.Item>

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <Form.Item label="City" required>
                      <Input
                        size="large"
                        name="city"
                        placeholder="e.g. Karachi, Lahore, Islamabad"
                        value={shippingInfo.city}
                        onChange={handleChange}
                        className="rounded-3"
                      />
                    </Form.Item>
                  </div>
                  <div className="col-12 col-md-6">
                    <Form.Item label="Contact Phone" required>
                      <Input
                        size="large"
                        name="phone"
                        placeholder="e.g. 03001234567"
                        value={shippingInfo.phone}
                        onChange={handleChange}
                        className="rounded-3"
                      />
                    </Form.Item>
                  </div>
                </div>
              </Form>
            </div>

            {/* Payment Method */}
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <h5 className="fw-bold mb-3 d-flex align-items-center text-dark">
                <span
                  className="badge bg-primary rounded-circle me-2 d-inline-flex align-items-center justify-content-center"
                  style={{ width: "24px", height: "24px", fontSize: "12px" }}
                >
                  2
                </span>
                Payment Method
              </h5>

              <div
                className="border border-2 border-primary rounded-4 p-3 d-flex align-items-center justify-content-between"
                style={{ backgroundColor: "#eff6ff" }}
              >
                <div className="d-flex align-items-center gap-3">
                  <DollarCircleOutlined className="text-primary fs-3" />
                  <div>
                    <h6 className="fw-bold mb-0 text-dark">Cash on Delivery (COD)</h6>
                    <span className="text-muted small">Pay in cash directly to delivery courier upon parcel arrival</span>
                  </div>
                </div>
                <span className="badge bg-primary px-3 py-2 rounded-pill small">Selected</span>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="col-12 col-lg-5">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white sticky-top" style={{ top: "90px" }}>
              <h5 className="fw-bold mb-3 text-dark">Order Summary</h5>

              {/* Items List */}
              <div className="cart-items-list mb-3" style={{ maxHeight: "240px", overflowY: "auto" }}>
                {cart.map(item => (
                  <div key={item.id} className="d-flex align-items-center justify-content-between py-2 border-bottom">
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={item.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80"}
                        alt={item.name}
                        className="rounded-2 border"
                        style={{ width: "42px", height: "42px", objectFit: "contain", backgroundColor: "#f8fafc" }}
                      />
                      <div>
                        <span className="fw-medium small d-block text-truncate" style={{ maxWidth: "180px" }}>
                          {item.name}
                        </span>
                        <span className="text-muted small">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="fw-semibold text-dark">
                      ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="d-flex justify-content-between mb-2 text-secondary">
                <span>Subtotal</span>
                <span className="fw-semibold text-dark">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2 text-secondary">
                <span>Doorstep Delivery</span>
                <span className="text-success fw-semibold">FREE</span>
              </div>

              <hr className="my-3" />

              <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="fs-5 fw-bold text-dark">Total Amount</span>
                <span className="fs-3 fw-bold text-primary">${cartTotal.toFixed(2)}</span>
              </div>

              <Button
                type="primary"
                size="large"
                block
                loading={isProcessing}
                onClick={handlePlaceOrder}
                className="rounded-pill fw-semibold py-2 shadow-sm d-flex align-items-center justify-content-center"
                style={{ backgroundColor: "#16a34a", borderColor: "#16a34a", height: "48px", fontSize: "16px" }}
              >
                Place Order (COD)
              </Button>

              <div className="text-center mt-3 text-muted small d-flex align-items-center justify-content-center gap-1">
                <LockOutlined className="text-muted" />
                <span>Zero prepayment required. 100% Cash on Delivery.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Checkout
