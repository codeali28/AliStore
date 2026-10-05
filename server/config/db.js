try {
  const dns = require("dns")
  dns.setServers(["8.8.8.8", "8.8.4.4"])
} catch (e) {
  // DNS override ignored in environments that restrict it
}

const mongoose = require("mongoose")

let isConnected = false

const connentDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return mongoose.connection
  }

  const uri = process.env.MONGODB_URI

  if (!uri) {
    console.error("FATAL ERROR: MONGODB_URI is not set in environment variables.")
    return null
  }

  // Explicit safety check to ensure target is ecommerce_db
  if (!uri.includes("ecommerce_db")) {
    console.warn("WARNING: MONGODB_URI does not explicitly include 'ecommerce_db'. Ensuring safe connection.")
  }

  try {
    const conn = await mongoose.connect(uri, {
      dbName: "ecommerce_db"
    })
    isConnected = true
    console.log(`MongoDB connected successfully to database: ${conn.connection.name || "ecommerce_db"}`)
    try {
      const { seedInitialData } = require("./seed")
      seedInitialData()
    } catch (seedErr) {
      console.warn("Seed warning:", seedErr.message)
    }
    return conn
  } catch (error) {
    console.log("MongoDB connection failed.")
    console.error(error)
    return null
  }
}

module.exports = { connentDB }