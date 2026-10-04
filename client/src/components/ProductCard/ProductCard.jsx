import { Button, Typography } from "antd"
import { ShoppingCartOutlined, EyeOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import { useCart } from "@/context/Cart"

const ProductCard = ({ product }) => {
    const navigate = useNavigate()
    const { addToCart } = useCart()

    const productId = product.id || product._id
    const imageUrl = product.image || product.imageURL || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"

    const handleCardClick = () => {
        navigate(`/product/${productId}`)
    }

    const handleAddToCart = (e) => {
        e.stopPropagation()
        addToCart(product, 1)
    }

    return (
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
            <div
                className="card product-card h-100 rounded-4 overflow-hidden position-relative"
                style={{
                    cursor: "pointer",
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0"
                }}
                onClick={handleCardClick}
            >
                {/* Product Image Area */}
                <div
                    className="product-image-container d-flex align-items-center justify-content-center p-3 position-relative overflow-hidden"
                    style={{
                        height: "210px",
                        backgroundColor: "#f8fafc",
                        borderBottom: "1px solid #f1f5f9"
                    }}
                >
                    {product.category && (
                        <span
                            className="badge position-absolute top-0 start-0 m-3 px-2 py-1 rounded-pill shadow-sm"
                            style={{
                                backgroundColor: "#ffffff",
                                color: "#2563eb",
                                fontSize: "11px",
                                fontWeight: 600,
                                border: "1px solid #dbeafe",
                                zIndex: 2
                            }}
                        >
                            {product.category}
                        </span>
                    )}

                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="product-img img-fluid"
                        style={{
                            maxHeight: "100%",
                            maxWidth: "100%",
                            objectFit: "contain"
                        }}
                        loading="lazy"
                    />
                </div>

                {/* Card Body */}
                <div className="card-body d-flex flex-column p-3">
                    <h6
                        className="fw-semibold text-dark mb-1 line-clamp-2"
                        title={product.name}
                        style={{ fontSize: "15px", minHeight: "40px" }}
                    >
                        {product.name}
                    </h6>

                    {product.description && (
                        <p
                            className="text-muted small mb-2 text-truncate"
                            style={{ fontSize: "12px" }}
                        >
                            {product.description}
                        </p>
                    )}

                    {/* Price and Stock Indicator */}
                    <div className="mt-auto pt-2 d-flex align-items-center justify-content-between">
                        <div>
                            <span className="fs-5 fw-bold text-primary">
                                ${Number(product.price).toFixed(2)}
                            </span>
                        </div>
                        <span className="badge bg-success-subtle text-success small fw-medium" style={{ fontSize: "10px" }}>
                            In Stock
                        </span>
                    </div>

                    {/* Add to Cart CTA */}
                    <div className="d-grid mt-3">
                        <Button
                            type="primary"
                            icon={<ShoppingCartOutlined style={{ fontSize: "16px" }} />}
                            onClick={handleAddToCart}
                            className="rounded-pill fw-medium shadow-sm d-flex align-items-center justify-content-center"
                            style={{
                                backgroundColor: "#2563eb",
                                borderColor: "#2563eb",
                                height: "38px",
                                fontSize: "14px"
                            }}
                        >
                            Add to Cart
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductCard
