import { Link, useNavigate } from 'react-router-dom'
import { Button, Typography, Empty, Popconfirm } from 'antd'
import {
  DeleteOutlined,
  ShoppingCartOutlined,
  ArrowRightOutlined,
  ShoppingOutlined,
  ClearOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons'
import { useCart } from '@/context/Cart'

const { Title } = Typography

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, cartCount, cartTotal } = useCart()
  const navigate = useNavigate()

  if (cart.length === 0) {
    return (
      <main className="cart-page py-5">
        <div className="container py-5 text-center">
          <div className="card border-0 shadow-sm rounded-4 p-5 mx-auto bg-white" style={{ maxWidth: "480px" }}>
            <div className="mb-3 text-primary" style={{ fontSize: "52px" }}>
              <ShoppingCartOutlined />
            </div>
            <Title level={3} className="fw-bold mb-2">Your Cart is Empty</Title>
            <p className="text-muted mb-4 small">
              Looks like you haven't added anything to your cart yet. Explore our featured items and shop today!
            </p>
            <Button
              type="primary"
              size="large"
              icon={<ShoppingOutlined />}
              onClick={() => navigate("/shop")}
              className="rounded-pill px-4 fw-semibold shadow-sm"
              style={{ backgroundColor: "#2563eb", borderColor: "#2563eb" }}
            >
              Start Shopping
            </Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="cart-page py-4">
      <div className="container">
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h2 className="fw-bold mb-1 text-dark">Your Cart</h2>
            <p className="text-muted small mb-0">{cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart</p>
          </div>

          <Popconfirm
            title="Clear Cart"
            description="Are you sure you want to remove all items from your cart?"
            onConfirm={clearCart}
            okText="Yes, Clear"
            cancelText="Cancel"
          >
            <Button danger icon={<ClearOutlined />} className="rounded-pill">
              Clear Cart
            </Button>
          </Popconfirm>
        </div>

        {/* Cart Contents */}
        <div className="row g-4">
          {/* Left Column: Cart Items List */}
          <div className="col-12 col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden mb-3">
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th scope="col" className="ps-4 py-3">Product</th>
                      <th scope="col" className="py-3">Price</th>
                      <th scope="col" className="py-3">Quantity</th>
                      <th scope="col" className="py-3">Subtotal</th>
                      <th scope="col" className="pe-4 py-3 text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map(item => {
                      const itemTotal = (Number(item.price) * Number(item.quantity)).toFixed(2)
                      return (
                        <tr key={item.id}>
                          {/* Product Image & Title */}
                          <td className="ps-4 py-3">
                            <div className="d-flex align-items-center gap-3">
                              <img
                                src={item.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120"}
                                alt={item.name}
                                className="rounded-3 border"
                                style={{ width: "64px", height: "64px", objectFit: "contain", backgroundColor: "#f8fafc" }}
                              />
                              <div>
                                <Link
                                  to={`/product/${item.id}`}
                                  className="fw-semibold text-dark text-decoration-none d-block text-truncate"
                                  style={{ maxWidth: "240px", fontSize: "15px" }}
                                >
                                  {item.name}
                                </Link>
                                {item.category && (
                                  <span className="badge bg-light text-secondary border small mt-1">
                                    {item.category}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Unit Price */}
                          <td className="py-3 fw-medium text-secondary">
                            ${Number(item.price).toFixed(2)}
                          </td>

                          {/* Quantity Controls */}
                          <td className="py-3">
                            <div className="d-inline-flex align-items-center border rounded-pill bg-light p-1">
                              <button
                                type="button"
                                className="btn btn-sm btn-link text-dark text-decoration-none px-2 fw-bold"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                -
                              </button>
                              <span className="px-2 fw-bold small">{item.quantity}</span>
                              <button
                                type="button"
                                className="btn btn-sm btn-link text-dark text-decoration-none px-2 fw-bold"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                +
                              </button>
                            </div>
                          </td>

                          {/* Item Subtotal */}
                          <td className="py-3 fw-bold text-primary">
                            ${itemTotal}
                          </td>

                          {/* Remove Button */}
                          <td className="pe-4 py-3 text-end">
                            <Button
                              type="text"
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => removeFromCart(item.id)}
                              title="Remove item"
                            />
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <Button
                type="link"
                onClick={() => navigate("/shop")}
                className="ps-0 fw-semibold"
              >
                &larr; Continue Shopping
              </Button>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white sticky-top" style={{ top: "90px" }}>
              <h5 className="fw-bold mb-3 text-dark">Order Summary</h5>

              <div className="d-flex justify-content-between mb-2 text-secondary">
                <span>Subtotal</span>
                <span className="fw-semibold text-dark">${cartTotal.toFixed(2)}</span>
              </div>

              <div className="d-flex justify-content-between mb-2 text-secondary">
                <span>Shipping</span>
                <span className="text-success fw-semibold">FREE</span>
              </div>

              <div className="d-flex justify-content-between mb-3 text-secondary">
                <span>Payment</span>
                <span className="badge bg-secondary-subtle text-secondary">Cash on Delivery</span>
              </div>

              <hr className="my-3" />

              <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="fs-5 fw-bold text-dark">Total</span>
                <span className="fs-3 fw-bold text-primary">${cartTotal.toFixed(2)}</span>
              </div>

              <Button
                type="primary"
                size="large"
                block
                icon={<ArrowRightOutlined />}
                iconPlacement="end"
                onClick={() => navigate("/checkout")}

                className="rounded-pill fw-semibold py-2 shadow-sm d-flex align-items-center justify-content-center"
                style={{ backgroundColor: "#2563eb", borderColor: "#2563eb", height: "46px" }}
              >
                Proceed to Checkout
              </Button>

              <div className="text-center mt-3 text-muted small d-flex align-items-center justify-content-center gap-1">
                <SafetyCertificateOutlined className="text-success" />
                <span>Cash on Delivery Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Cart
