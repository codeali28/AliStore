const express = require("express")
const multer = require("multer")
const Products = require("../models/Product")
const { verifyToken, verifyAdmin } = require("../middleware/auth")
const { getRandomId } = require("../config/global")
const { cloudinary } = require("../config/cloudinary")

const storage = multer.memoryStorage()
const upload = multer({ storage })
const router = express.Router()

// GET all products (PUBLIC)
router.get("/", async (req, res) => {
    try {
        const { search, category } = req.query
        let query = {}

        if (category && category !== "All") {
            query.category = { $regex: new RegExp("^" + category + "$", "i") }
        }

        if (search) {
            query.name = { $regex: new RegExp(search, "i") }
        }

        const products = await Products.find(query).sort({ createdAt: -1 })
        res.status(200).json({ message: "Products fetched successfully", products })
    } catch (error) {
        console.error("Fetch products error:", error)
        res.status(500).json({ message: "Internal server error", isError: true })
    }
})

// GET single product (PUBLIC)
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params
        let product = await Products.findOne({ $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] })

        if (!product) {
            return res.status(404).json({ message: "Product not found", isError: true })
        }

        res.status(200).json({ message: "Product fetched successfully", product })
    } catch (error) {
        console.error("Fetch single product error:", error)
        res.status(500).json({ message: "Internal server error", isError: true })
    }
})

// Helper to upload buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "ecommerce/products" },
            (error, result) => {
                if (error) return reject(error)
                resolve(result)
            }
        )
        uploadStream.end(buffer)
    })
}

// POST create product (ADMIN ONLY)
router.post("/", verifyToken, verifyAdmin, upload.fields([{ name: "image" }]), async (req, res) => {
    try {
        const { name, price, description, category, imageUrl } = req.body

        if (!name || !price) {
            return res.status(400).json({ message: "Product name and price are required", isError: true })
        }

        let image = imageUrl || ""
        let imagePublicId = ""

        if (req.files && req.files["image"] && req.files["image"][0]) {
            try {
                const result = await uploadToCloudinary(req.files["image"][0].buffer)
                image = result.secure_url
                imagePublicId = result.public_id
            } catch (uploadErr) {
                console.error("Cloudinary upload failed:", uploadErr)
                return res.status(500).json({ message: "Image upload to Cloudinary failed", isError: true })
            }
        }

        if (!image) {
            return res.status(400).json({ message: "Product image is required", isError: true })
        }

        const id = getRandomId()
        const newProduct = new Products({
            id,
            name: name.trim(),
            price: Number(price),
            description: (description || "").trim(),
            category: (category || "General").trim(),
            image,
            imagePublicId
        })

        await newProduct.save()
        res.status(201).json({ message: "Product created successfully", product: newProduct })
    } catch (error) {
        console.error("Create product error:", error)
        res.status(500).json({ message: "Internal server error", isError: true })
    }
})

// PUT / PATCH update product (ADMIN ONLY)
router.patch("/:id", verifyToken, verifyAdmin, upload.fields([{ name: "image" }]), async (req, res) => {
    try {
        const { id } = req.params
        const { name, price, description, category, imageUrl } = req.body

        const product = await Products.findOne({ $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] })
        if (!product) {
            return res.status(404).json({ message: "Product not found", isError: true })
        }

        if (name) product.name = name.trim()
        if (price !== undefined) product.price = Number(price)
        if (description !== undefined) product.description = description.trim()
        if (category) product.category = category.trim()

        if (req.files && req.files["image"] && req.files["image"][0]) {
            try {
                const result = await uploadToCloudinary(req.files["image"][0].buffer)
                product.image = result.secure_url
                product.imagePublicId = result.public_id
            } catch (uploadErr) {
                console.error("Cloudinary upload failed:", uploadErr)
                return res.status(500).json({ message: "Image upload to Cloudinary failed", isError: true })
            }
        } else if (imageUrl) {
            product.image = imageUrl
        }

        await product.save()
        res.status(200).json({ message: "Product updated successfully", product })
    } catch (error) {
        console.error("Update product error:", error)
        res.status(500).json({ message: "Internal server error", isError: true })
    }
})

// Support PUT route too
router.put("/:id", verifyToken, verifyAdmin, upload.fields([{ name: "image" }]), async (req, res) => {
    try {
        const { id } = req.params
        const { name, price, description, category, imageUrl } = req.body

        const product = await Products.findOne({ $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] })
        if (!product) {
            return res.status(404).json({ message: "Product not found", isError: true })
        }

        if (name) product.name = name.trim()
        if (price !== undefined) product.price = Number(price)
        if (description !== undefined) product.description = description.trim()
        if (category) product.category = category.trim()

        if (req.files && req.files["image"] && req.files["image"][0]) {
            try {
                const result = await uploadToCloudinary(req.files["image"][0].buffer)
                product.image = result.secure_url
                product.imagePublicId = result.public_id
            } catch (uploadErr) {
                console.error("Cloudinary upload failed:", uploadErr)
                return res.status(500).json({ message: "Image upload to Cloudinary failed", isError: true })
            }
        } else if (imageUrl) {
            product.image = imageUrl
        }

        await product.save()
        res.status(200).json({ message: "Product updated successfully", product })
    } catch (error) {
        console.error("Update product error:", error)
        res.status(500).json({ message: "Internal server error", isError: true })
    }
})

// DELETE product (ADMIN ONLY)
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params
        const product = await Products.findOneAndDelete({ $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] })

        if (!product) {
            return res.status(404).json({ message: "Product not found", isError: true })
        }

        res.status(200).json({ message: "Product deleted successfully", product })
    } catch (error) {
        console.error("Delete product error:", error)
        res.status(500).json({ message: "Internal server error", isError: true })
    }
})

module.exports = router
