import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Button, Spin, Tag, Typography, Breadcrumb, Divider } from 'antd'
import {
    ShoppingCartOutlined,
    ArrowLeftOutlined,
    SafetyCertificateOutlined,
    ThunderboltOutlined,
    SyncOutlined,
    CheckCircleFilled
} from '@ant-design/icons'
import axios from 'axios'
import { useCart } from '@/context/Cart'

const { Title, Paragraph } = Typography

const ProductDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { addToCart } = useCart()

    const [product, setProduct] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        setIsLoading(true)
        axios.get(`${import.meta.env.VITE_API_URL}/api/products/${id}`)
            .then(res => {
                if (res.data && res.data.product) {
                    setProduct(res.data.product)
                } else {
                    setError("Product not found")
                }
            })
            .catch(err => {
                console.error("Error fetching product details:", err)
                setError("Unable to load product details.")
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [id])

    const handleIncrement = () => setQuantity(q => q + 1)
    const handleDecrement = () => setQuantity(q => (q > 1 ? q - 1 : 1))

    const handleAddToCart = () => {
        if (!product) return
        addToCart(product, quantity)
    }

    if (isLoading) {
        return (
            <main className="product-details-page py-5 text-center">
                <div className="container py-5">
                    <Spin size="large" />
                    <p className="text-muted mt-3 small">Loading product details...</p>
                </div>
            </main>
        )
    }

    if (error || !product) {
        return (
            <main className="product-details-page py-5">
                <div className="container text-center py-5">
                    <div className="card p-5 border-0 shadow-sm rounded-4 mx-auto bg-white" style={{ maxWidth: "480px" }}>
                        <Title level={4} className="text-danger mb-2">Product Not Found</Title>
                        <Paragraph className="text-muted mb-4">
                            The item you are looking for might have been removed or is temporarily unavailable.
                        </Paragraph>
                        <Button type="primary" onClick={() => navigate("/shop")} className="rounded-pill">
                            Return to Shop
                        </Button>
                    </div>
                </div>
            </main>
        )
    }

    const imageUrl = product.image || product.imageURL || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"

    return (
        <main className="product-details-page py-4">
            <div className="container">
                {/* Navigation & Breadcrumbs */}
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <Button
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate(-1)}
                        className="fw-medium text-secondary ps-0"
                    >
                        Back
                    </Button>

                    <Breadcrumb
                        items={[
                            { title: <Link to="/">Home</Link> },
                            { title: <Link to="/shop">Shop</Link> },
                            { title: product.category || "General" },
                            { title: <span className="text-truncate d-inline-block" style={{ maxWidth: "180px" }}>{product.name}</span> }
                        ]}
                    />
                </div>

                {/* Main Product Card */}
                <div className="card border-0 shadow-sm rounded-4 p-4 p-lg-5 bg-white mb-5">
                    <div className="row g-5 align-items-center">
                        {/* Left: Product Image */}
                        <div className="col-12 col-md-6 text-center">
                            <div
                                className="product-img-wrapper rounded-4 p-4 d-flex align-items-center justify-content-center border"
                                style={{ backgroundColor: "#f8fafc", minHeight: "360px" }}
                            >
                                <img
                                    src={imageUrl}
                                    alt={product.name}
                                    className="img-fluid rounded-3"
                                    style={{ maxHeight: "340px", maxWidth: "100%", objectFit: "contain" }}
                                />
                            </div>
                        </div>

                        {/* Right: Product Information */}
                        <div className="col-12 col-md-6">
                            <div className="product-info-wrapper">
                                {product.category && (
                                    <Tag color="blue" className="rounded-pill px-3 py-1 mb-2 fw-semibold">
                                        {product.category}
                                    </Tag>
                                )}

                                <h2 className="fw-bold text-dark mb-2" style={{ fontSize: "28px", lineHeight: "1.25" }}>
                                    {product.name}
                                </h2>

                                <div className="d-flex align-items-center gap-2 mb-3">
                                    <span className="text-success small fw-semibold d-flex align-items-center">
                                        <CheckCircleFilled className="me-1" /> In Stock & Ready for Cash on Delivery
                                    </span>
                                </div>

                                <div className="product-price mb-3">
                                    <span className="display-6 fw-bold text-primary">
                                        ${Number(product.price).toFixed(2)}
                                    </span>
                                </div>

                                <Paragraph className="text-secondary fs-6 mb-4" style={{ lineHeight: "1.7" }}>
                                    {product.description || "High quality product crafted with attention to detail. Designed for comfort, durability and performance."}
                                </Paragraph>

                                <Divider className="my-4" />

                                {/* Quantity Selector & Add to Cart */}
                                <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
                                    <div className="d-flex align-items-center border rounded-pill p-1 bg-light">
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-link text-dark text-decoration-none px-3 fw-bold"
                                            onClick={handleDecrement}
                                            disabled={quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <span className="px-3 fw-bold fs-6">{quantity}</span>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-link text-dark text-decoration-none px-3 fw-bold"
                                            onClick={handleIncrement}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <Button
                                        type="primary"
                                        size="large"
                                        icon={<ShoppingCartOutlined style={{ fontSize: "20px" }} />}
                                        onClick={handleAddToCart}
                                        className="rounded-pill px-5 fw-semibold shadow-sm d-flex align-items-center"
                                        style={{ backgroundColor: "#2563eb", borderColor: "#2563eb", height: "46px" }}
                                    >
                                        Add to Cart
                                    </Button>
                                </div>

                                {/* Trust Badges */}
                                <div className="row g-2 pt-3 border-top">
                                    <div className="col-4 text-center">
                                        <ThunderboltOutlined className="text-primary fs-5 mb-1" />
                                        <p className="small text-muted mb-0" style={{ fontSize: "11px" }}>Free Shipping</p>
                                    </div>
                                    <div className="col-4 text-center">
                                        <SyncOutlined className="text-primary fs-5 mb-1" />
                                        <p className="small text-muted mb-0" style={{ fontSize: "11px" }}>7 Days Return</p>
                                    </div>
                                    <div className="col-4 text-center">
                                        <SafetyCertificateOutlined className="text-primary fs-5 mb-1" />
                                        <p className="small text-muted mb-0" style={{ fontSize: "11px" }}>Cash on Delivery</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default ProductDetails
