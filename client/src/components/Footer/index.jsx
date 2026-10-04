import { Link } from 'react-router-dom'
import {
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  FacebookFilled,
  InstagramOutlined,
  LinkedinFilled,
  WhatsAppOutlined,
  CheckCircleFilled
} from '@ant-design/icons'
import Copyright from './Copyright'

const Footer = () => {
  return (
    <footer className="footer-section mt-auto">
      {/* --- Main 4-Column Footer Content --- */}
      <div className="container py-5">
        <div className="row g-4 g-lg-5 justify-content-between">
          {/* Column 1: Brand Info */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="d-flex align-items-center mb-3">
              <span
                className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-3 me-2 shadow-sm"
                style={{ width: "40px", height: "40px", fontSize: "20px" }}
              >
                🛍️
              </span>
              <span className="fs-3 fw-bold text-white tracking-tight">
                Ali<span style={{ color: "#3b82f6" }}>Store</span>
              </span>
            </div>

            <p className="footer-desc mb-3">
              Your premier Pakistani e-commerce destination for authentic electronics, trendy fashion, and home lifestyle essentials. Quality products, seamless ordering, and reliable Cash on Delivery.
            </p>

            <div className="mb-4">
              <div className="footer-trust-pill">
                <CheckCircleFilled style={{ color: "#22c55e" }} />
                <span>100% Genuine & Verified Products</span>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <span className="d-block text-white small fw-bold text-uppercase mb-2" style={{ letterSpacing: "0.05em", fontSize: "11.5px" }}>
                Connect With Us
              </span>
              <div className="d-flex align-items-center gap-2">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn"
                  title="Facebook"
                  aria-label="Facebook"
                >
                  <FacebookFilled />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn"
                  title="Instagram"
                  aria-label="Instagram"
                >
                  <InstagramOutlined />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn"
                  title="LinkedIn"
                  aria-label="LinkedIn"
                >
                  <LinkedinFilled />
                </a>
                <a
                  href="https://wa.me/923457743550"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn"
                  title="WhatsApp"
                  aria-label="WhatsApp"
                >
                  <WhatsAppOutlined />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Shop */}
          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="footer-heading">Shop</h6>
            <ul className="footer-links">
              <li>
                <Link to="/shop" className="footer-link">All Products</Link>
              </li>
              <li>
                <Link to="/shop?category=Electronics" className="footer-link">Electronics</Link>
              </li>
              <li>
                <Link to="/shop?category=Fashion" className="footer-link">Fashion Wear</Link>
              </li>
              <li>
                <Link to="/shop?category=Home" className="footer-link">Home & Living</Link>
              </li>
              <li>
                <Link to="/cart" className="footer-link">Shopping Cart</Link>
              </li>
              <li>
                <Link to="/orders" className="footer-link">Track Orders</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Company */}
          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="footer-heading">Customer Care</h6>
            <ul className="footer-links">
              <li>
                <Link to="/about" className="footer-link">About AliStore</Link>
              </li>
              <li>
                <Link to="/contact" className="footer-link">Contact & Help</Link>
              </li>
              <li>
                <Link to="/orders" className="footer-link">Order Status</Link>
              </li>
              <li>
                <Link to="/about" className="footer-link">Shipping Policy</Link>
              </li>
              <li>
                <Link to="/about" className="footer-link">Easy 7-Day Returns</Link>
              </li>
              <li>
                <Link to="/admin/login" className="footer-link" style={{ opacity: 0.75 }}>
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Support */}
          <div className="col-12 col-md-6 col-lg-4">
            <h6 className="footer-heading">Get in Touch</h6>
            <ul className="footer-contact-list">
              <li className="footer-contact-item">
                <div className="footer-contact-icon">
                  <EnvironmentOutlined />
                </div>
                <div>
                  <strong className="text-white d-block">Commerce Center</strong>
                  <span> Faisalabad, Punjab, Pakistan</span>
                </div>
              </li>

              <li className="footer-contact-item">
                <div className="footer-contact-icon">
                  <MailOutlined />
                </div>
                <div>
                  <strong className="text-white d-block">Email Support</strong>
                  <a href="mailto:support@alistore.com">support@alistore.com</a>
                </div>
              </li>

              <li className="footer-contact-item">
                <div className="footer-contact-icon">
                  <PhoneOutlined />
                </div>
                <div>
                  <strong className="text-white d-block">Phone / WhatsApp</strong>
                  <a href="tel:+923457743550">+92 345 7743550</a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* --- Copyright Sub-strip --- */}
      <Copyright />
    </footer>
  )
}

export default Footer