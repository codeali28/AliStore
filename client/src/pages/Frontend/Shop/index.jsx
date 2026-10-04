import { useState, useEffect } from 'react'
import { Input, Select, Spin, Empty, Button } from 'antd'
import { SearchOutlined, ClearOutlined, FilterOutlined } from '@ant-design/icons'
import axios from 'axios'
import ProductCard from '@/components/ProductCard/ProductCard'

const categories = ["All", "Electronics", "Fashion", "Home & Living", "Accessories"]

const Shop = () => {
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [sortBy, setSortBy] = useState("default")

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

    // Filter by search query and category
    let filtered = products.filter(product => {
        const matchesCategory = selectedCategory === "All" || product.category?.toLowerCase() === selectedCategory.toLowerCase()
        const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    // Sort products
    if (sortBy === "price-low") {
        filtered.sort((a, b) => Number(a.price) - Number(b.price))
    } else if (sortBy === "price-high") {
        filtered.sort((a, b) => Number(b.price) - Number(a.price))
    } else if (sortBy === "name-asc") {
        filtered.sort((a, b) => a.name.localeCompare(b.name))
    }

    const handleClearFilters = () => {
        setSearchQuery("")
        setSelectedCategory("All")
        setSortBy("default")
    }

    return (
        <main className="shop-page py-4">
            <div className="container">
                {/* Header */}
                <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 gap-2">
                    <div>
                        <h2 className="fw-bold mb-1 text-dark">Shop All Products</h2>
                        <p className="text-muted small mb-0">Browse our complete inventory with live filters and search</p>
                    </div>
                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill fs-6 fw-semibold">
                        {filtered.length} {filtered.length === 1 ? 'Product' : 'Products'} Available
                    </span>
                </div>

                {/* Filter and Search Bar */}
                <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
                    <div className="row g-3 align-items-center">
                        <div className="col-12 col-md-5">
                            <Input
                                size="large"
                                placeholder="Search by product name or keyword..."
                                prefix={<SearchOutlined className="text-muted" />}
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                allowClear
                                className="rounded-3"
                            />
                        </div>

                        <div className="col-6 col-md-3">
                            <Select
                                size="large"
                                value={selectedCategory}
                                onChange={val => setSelectedCategory(val)}
                                className="w-100"
                                options={categories.map(c => ({ value: c, label: c === "All" ? "All Categories" : c }))}
                            />
                        </div>

                        <div className="col-6 col-md-3">
                            <Select
                                size="large"
                                value={sortBy}
                                onChange={val => setSortBy(val)}
                                className="w-100"
                                options={[
                                    { value: "default", label: "Sort: Featured" },
                                    { value: "price-low", label: "Price: Low to High" },
                                    { value: "price-high", label: "Price: High to Low" },
                                    { value: "name-asc", label: "Name: A to Z" }
                                ]}
                            />
                        </div>

                        <div className="col-12 col-md-1 text-md-end">
                            <Button
                                icon={<ClearOutlined />}
                                onClick={handleClearFilters}
                                className="rounded-3 w-100"
                                title="Reset Filters"
                            >
                                Reset
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                {isLoading ? (
                    <div className="text-center py-5">
                        <Spin size="large" />
                        <p className="text-muted mt-3 small">Loading products from catalog...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white my-4">
                        <Empty description="No products match your current search or filter criteria." />
                        <div className="mt-3">
                            <Button type="primary" onClick={handleClearFilters} className="rounded-pill">
                                Clear Filters
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="row g-4">
                        {filtered.map(product => (
                            <ProductCard key={product.id || product._id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}

export default Shop
