require("dotenv").config()
const express = require("express")
const cors = require("cors")
const { connentDB } = require("./config/db")

const authRoutes = require("./routes/auth")

const productRoutes = require("./routes/products")
const orderRoutes = require("./routes/orders")

const app = express()

// Connect to MongoDB (strictly ecommerce_db)
connentDB()

app.use(cors())
app.use(express.json())


// Mount routes - supporting both /api/... (Instructor PDF standard) and clean root prefixes
app.use("/api", authRoutes)
app.use("/auth", authRoutes)

app.use("/api/products", productRoutes)
app.use("/products", productRoutes)

app.use("/api/orders", orderRoutes)
app.use("/orders", orderRoutes)

app.get("/", (req, res) => {
  res.json({
    status: "online",
    application: "AliStore E-Commerce API",
    database: "ecommerce_db",
    timestamp: new Date().toISOString()
  })
})

app.get("/health-check", (req, res) => {
  res.send("AliStore E-Commerce server health is good.")
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`)
})


