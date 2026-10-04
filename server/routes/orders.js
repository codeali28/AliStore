const express = require("express")
const Orders = require("../models/Order")
const { verifyToken, verifyAdmin } = require("../middleware/auth")

const router = express.Router()

// POST create order (AUTHENTICATED USER)
router.post("/", verifyToken, async (req, res) => {
    try {
        const { products, shippingInfo, totalPrice } = req.body
        const user = req.user

        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "Order must contain at least one product", isError: true })
        }

        const calculatedTotal = products.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity || 1)), 0)
        const finalTotal = totalPrice ? Number(totalPrice) : calculatedTotal

        const newOrder = new Orders({
            userId: user.uid,
            customerName: (shippingInfo && shippingInfo.fullName) ? shippingInfo.fullName : (user.name || user.fullName),
            customerEmail: user.email,
            shippingInfo: {
                fullName: shippingInfo?.fullName || user.name || user.fullName || "",
                address: shippingInfo?.address || "",
                city: shippingInfo?.city || "",
                phone: shippingInfo?.phone || ""
            },
            products: products.map(item => ({
                productId: item.productId || item.id || item._id,
                name: item.name,
                price: Number(item.price),
                quantity: Number(item.quantity) || 1,
                image: item.image || item.imageURL || ""
            })),
            totalPrice: finalTotal,
            paymentMethod: "Cash on Delivery",
            status: "Processing"
        })

        await newOrder.save()

        res.status(201).json({
            message: "Order placed successfully! Cash on Delivery confirmed.",
            order: newOrder
        })
    } catch (error) {
        console.error("Create order error:", error)
        res.status(500).json({ message: "Internal server error", isError: true })
    }
})

// GET user orders (AUTHENTICATED USER)
router.get("/my-orders", verifyToken, async (req, res) => {
    try {
        const orders = await Orders.find({ userId: req.uid }).sort({ createdAt: -1 })
        res.status(200).json({ message: "Orders fetched successfully", orders })
    } catch (error) {
        console.error("Fetch user orders error:", error)
        res.status(500).json({ message: "Internal server error", isError: true })
    }
})

// GET all orders (ADMIN ONLY)
router.get("/all", verifyToken, verifyAdmin, async (req, res) => {
    try {
        const orders = await Orders.find().sort({ createdAt: -1 })
        res.status(200).json({ message: "All orders fetched successfully", orders })
    } catch (error) {
        console.error("Fetch all orders error:", error)
        res.status(500).json({ message: "Internal server error", isError: true })
    }
})

// PATCH update order status (ADMIN ONLY)
router.patch("/:id/status", verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body

        const order = await Orders.findOneAndUpdate(
            { $or: [{ orderId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
            { status },
            { new: true }
        )

        if (!order) {
            return res.status(404).json({ message: "Order not found", isError: true })
        }

        res.status(200).json({ message: "Order status updated successfully", order })
    } catch (error) {
        console.error("Update order status error:", error)
        res.status(500).json({ message: "Internal server error", isError: true })
    }
})

module.exports = router
