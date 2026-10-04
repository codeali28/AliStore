const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const Users = require("../models/auth")
const Products = require("../models/Product")

const sampleProducts = [
    {
        id: "prod_seed_01",
        name: "Wireless Noise-Canceling Headphones",
        price: 79.99,
        description: "High quality wireless headphones with active noise cancellation, 30-hour battery life, and deep bass premium sound quality.",
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
    },
    {
        id: "prod_seed_02",
        name: "Smart Watch Pro",
        price: 119.99,
        description: "Modern smartwatch with 24/7 fitness tracking, optical heart rate monitor, sleep analysis and vivid AMOLED touch display.",
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80"
    },
    {
        id: "prod_seed_03",
        name: "Classic Vintage Denim Jacket",
        price: 64.99,
        description: "Timeless vintage wash denim jacket tailored with premium heavyweight cotton, durable metal hardware, and relaxed fit.",
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80"
    },
    {
        id: "prod_seed_04",
        name: "Men's Performance Athletic Sneakers",
        price: 84.99,
        description: "Ultra-comfortable lightweight athletic running sneakers designed for daily training, gym workouts, and modern casual street wear.",
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80"
    },
    {
        id: "prod_seed_05",
        name: "Slim RFID-Blocking Leather Wallet",
        price: 29.99,
        description: "Minimalist bifold wallet handcrafted from genuine full-grain leather featuring built-in RFID blocking protection.",
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80"
    },
    {
        id: "prod_seed_06",
        name: "Urban Commuter Laptop Backpack",
        price: 49.99,
        description: "Durable water-resistant urban backpack with 15.6-inch laptop compartment and multi-tier organizational pockets.",
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80"
    },
    {
        id: "prod_seed_07",
        name: "Ceramic Pour-Over Coffee Dripper Set",
        price: 34.99,
        description: "Artisan matte-ceramic pour-over brewer with heat-resistant glass carafe for the ultimate morning coffee ritual.",
        category: "Home & Living",
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80"
    },
    {
        id: "prod_seed_08",
        name: "Aroma Ultrasonic Essential Oil Diffuser",
        price: 39.99,
        description: "Whisper-quiet ultrasonic cool mist aromatherapy diffuser with natural wood-grain finish and ambient warm lighting.",
        category: "Home & Living",
        image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80"
    }
]

const seedInitialData = async () => {
    try {
        // Strict guard: ensure database is strictly ecommerce_db
        const currentDb = mongoose.connection?.name
        if (currentDb && currentDb !== "ecommerce_db") {
            console.warn(`[Seed] Aborting seed: Connected DB is "${currentDb}", strictly requiring "ecommerce_db".`)
            return
        }

        // 1. Check & Seed Default Admin Account
        const adminEmail = "admin@shophub.com"
        const existingAdmin = await Users.findOne({ role: "admin" })
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash("admin123", 10)
            const adminUser = new Users({
                uid: "admin_" + Math.random().toString(36).slice(2, 10),
                name: "AliStore Administrator",
                fullName: "AliStore Administrator",
                email: adminEmail,
                password: hashedPassword,
                role: "admin",
                status: "active"
            })
            await adminUser.save()
            console.log(`[Seed] Default Admin account created: ${adminEmail} / admin123`)
        }

        // 2. Check if product seeding was already executed using system_meta collection
        const metaCollection = mongoose.connection.collection("system_meta")
        const seedRecord = await metaCollection.findOne({ key: "products_seed_v1" })

        if (seedRecord) {
            // Already seeded previously. Skip to ensure admin deletions or edits are never overwritten.
            return
        }

        // 3. Seed sample products safely without duplicating or overwriting existing items
        let addedCount = 0
        for (const item of sampleProducts) {
            const existing = await Products.findOne({
                $or: [{ id: item.id }, { name: item.name }]
            })
            if (!existing) {
                await Products.create(item)
                addedCount++
            }
        }

        // Record completion in system_meta
        await metaCollection.updateOne(
            { key: "products_seed_v1" },
            { $set: { key: "products_seed_v1", executedAt: new Date(), itemsSeeded: addedCount } },
            { upsert: true }
        )

        console.log(`[Seed] Safely seeded ${addedCount} sample products into ecommerce_db. Existing items preserved.`)
    } catch (err) {
        console.error("[Seed] Error during seeding:", err.message)
    }
}

// Allow direct CLI execution: node config/seed.js
if (require.main === module) {
    const path = require("path")
    require("dotenv").config({ path: path.join(__dirname, "../.env") })
    const { connentDB } = require("./db")
    connentDB()
    mongoose.connection.once("open", async () => {
        await seedInitialData()
        console.log("[Seed] Standalone seed run complete.")
        process.exit(0)
    })
}

module.exports = { seedInitialData }
