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

// Enable CORS for all origins, methods, and credentials
app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"]
}))

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*")
  res.header("Access-Control-Allow-Credentials", "true")
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept, Origin")
  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }
  next()
})

app.use(express.json())

// Ensure MongoDB is connected on each incoming serverless request
app.use(async (req, res, next) => {
  try {
    await connentDB()
  } catch (err) {
    console.error("DB connection error in request lifecycle:", err)
  }
  next()
})

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

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
  })
}

module.exports = app


