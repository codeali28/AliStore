import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Spin, Empty } from 'antd'
import { ThunderboltOutlined, SyncOutlined, SafetyCertificateOutlined } from '@ant-design/icons'
import axios from 'axios'
import ProductCard from '@/components/ProductCard/ProductCard'
import heroShowcaseImg from '@/assets/hero-showcase.png'

const categories = [
  { name: "Electronics", icon: "🎧", count: "Smart Gadgets" },
  { name: "Fashion", icon: "👕", count: "Trendy Wear" },
  { name: "Home & Living", icon: "🛋️", count: "Everyday Decor" },
  { name: "Accessories", icon: "🎒", count: "Bags & Watches" }
]

const Home = () => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const navigate = useNavigate()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = () => {
    setIsLoading(true)
    axios.get("http://localhost:8000/api/products")
      .then(res => {
        if (res.data && res.data.products) {
          setProducts(res.data.products)
        }
      })
      .catch(err => {
        console.error("Error fetching products:", err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const filteredProducts = selectedCategory === "All"
    ? products
    : products.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase())

  return (
    <main className="home-page pb-5">
      {/* Hero Section */}
      <section className="hero-section mb-5">
        <div className="container">
          <div className="row align-items-center g-4 g-lg-5">
            {/* Left Column: Content */}
            <div className="col-12 col-lg-6">
              {/* Small badge */}
              <div className="hero-badge mb-3">
                <span className="hero-badge-icon" aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1d68ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                </span>
                <span className="hero-badge-text">Your Trusted Online Store</span>
              </div>

              {/* Main Heading */}
              <h1 className="hero-title">
  Everything You Need,<br className="d-none d-sm-inline" />
  <span className="hero-title-accent">One Place.</span>
</h1>

              {/* Description */}
              <p className="hero-description mb-4">
                Shop the latest trends in electronics, fashion, home essentials and more. Fast delivery, secure shopping and the best deals — only at <strong className="hero-brand-name">AliStore</strong>.
              </p>

              {/* Action Buttons */}
              <div className="hero-cta-group mb-4 pb-2">
                <Button
                  type="primary"
                  size="large"
                  onClick={() => navigate("/shop")}
                  className="hero-btn-primary"
                >
                  <span>Shop Now &rarr;</span>
                </Button>
                <Button
                  size="large"
                  onClick={() => {
                    const el = document.getElementById("categories-section")
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth" })
                    } else {
                      navigate("/shop")
                    }
                  }}
                  className="hero-btn-secondary"
                >
                  Explore Categories
                </Button>
              </div>

              {/* Trust Features */}
              <div className="hero-trust-container">
                <div className="hero-trust-item">
                  <div className="hero-trust-icon-box" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1d68ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="3" width="15" height="13"></rect>
                      <polygon points="16 8 20 8 23 11 23 16 16 16 8"></polygon>
                      <circle cx="5.5" cy="18.5" r="2.5"></circle>
                      <circle cx="18.5" cy="18.5" r="2.5"></circle>
                    </svg>
                  </div>
                  <div className="hero-trust-text">
                    <span className="hero-trust-title">Cash on Delivery</span>
                    <span className="hero-trust-subtitle">Available Nationwide</span>
                  </div>
                </div>

                <div className="hero-trust-item">
                  <div className="hero-trust-icon-box" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1d68ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      <polyline points="9 12 11 14 15 10"></polyline>
                    </svg>
                  </div>
                  <div className="hero-trust-text">
                    <span className="hero-trust-title">100% Secure</span>
                    <span className="hero-trust-subtitle">Shopping</span>
                  </div>
                </div>

                <div className="hero-trust-item">
                  <div className="hero-trust-icon-box" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1d68ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                      <line x1="12" y1="22.08" x2="12" y2="12"></line>
                    </svg>
                  </div>
                  <div className="hero-trust-text">
                    <span className="hero-trust-title">Free Shipping</span>
                    <span className="hero-trust-subtitle">On Selected Items</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Product Showcase */}
            <div className="col-12 col-lg-6">
              <div className="hero-showcase-container">
                <img
                  src={heroShowcaseImg}
                  alt="AliStore Multi-Category Showcase"
                  className="hero-showcase-img"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Categories Section */}
        <section id="categories-section" className="categories-section mb-5">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div>
              <h4 className="fw-bold mb-0 text-dark">Shop by Category</h4>
              <p className="text-muted small mb-0">Browse top categories in our store</p>
            </div>
            <Button type="link" onClick={() => navigate("/shop")} className="fw-semibold">
              View All &rarr;
            </Button>
          </div>

          <div className="row g-3">
            <div className="col-6 col-md-3">
              <div
                className={`card p-3 text-center border rounded-4 cursor-pointer category-chip transition ${
                  selectedCategory === "All" ? "border-primary bg-primary-subtle shadow-sm" : "bg-white"
                }`}
                onClick={() => setSelectedCategory("All")}
              >
                <span className="fs-3 mb-1">✨</span>
                <span className="fw-bold text-dark d-block">All Items</span>
                <span className="text-muted small">Full Catalog</span>
              </div>
            </div>
            {categories.map(cat => (
              <div className="col-6 col-md-3" key={cat.name}>
                <div
                  className={`card p-3 text-center border rounded-4 cursor-pointer category-chip transition ${
                    selectedCategory === cat.name ? "border-primary bg-primary-subtle shadow-sm" : "bg-white"
                  }`}
                  onClick={() => setSelectedCategory(cat.name)}
                >
                  <span className="fs-3 mb-1">{cat.icon}</span>
                  <span className="fw-bold text-dark d-block">{cat.name}</span>
                  <span className="text-muted small">{cat.count}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Products Section */}
        <section id="featured-products" className="products-section mb-5">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <h3 className="fw-bold text-dark mb-1">Featured Products</h3>
              <p className="text-muted small mb-0">Real products fetched from your MongoDB Atlas database</p>
            </div>
            <Link to="/shop" className="btn btn-outline-primary rounded-pill px-3 btn-sm fw-medium shadow-sm">
              All Products ({products.length})
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-5">
              <Spin size="large" />
              <p className="text-muted mt-3 small">Loading products from catalog...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white my-4">
              <Empty
                description={
                  <span className="text-muted">
                    No products found in this category yet.
                  </span>
                }
              >
                <Button type="primary" onClick={() => setSelectedCategory("All")} className="rounded-pill">
                  View All Products
                </Button>
              </Empty>
            </div>
          ) : (
            <div className="row g-4">
              {filteredProducts.map(product => (
                <ProductCard key={product.id || product._id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* Value Proposition Badges */}
        <section className="features-section py-4 border-top mt-4">
          <div className="row g-4 text-center">
            <div className="col-12 col-md-4">
              <div className="p-4 bg-white rounded-4 border h-100 shadow-sm">
                <ThunderboltOutlined className="text-primary fs-2 mb-2" />
                <h6 className="fw-bold mb-1">Free Nationwide Shipping</h6>
                <p className="text-muted small mb-0">Free doorstep delivery on eligible orders across the country.</p>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="p-4 bg-white rounded-4 border h-100 shadow-sm">
                <SyncOutlined className="text-primary fs-2 mb-2" />
                <h6 className="fw-bold mb-1">7 Days Easy Returns</h6>
                <p className="text-muted small mb-0">Simple, hassle-free returns and exchanges on all items.</p>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="p-4 bg-white rounded-4 border h-100 shadow-sm">
                <SafetyCertificateOutlined className="text-primary fs-2 mb-2" />
                <h6 className="fw-bold mb-1">Cash On Delivery</h6>
                <p className="text-muted small mb-0">Inspect your parcel at arrival and pay cash securely.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Home