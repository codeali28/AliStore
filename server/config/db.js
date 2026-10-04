const dns = require("dns")
dns.setServers(["8.8.8.8", "8.8.4.4"])

const mongoose = require("mongoose")

const connentDB = () => {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    console.error("FATAL ERROR: MONGODB_URI is not set in environment variables.")
    process.exit(1)
  }

  // Explicit safety check to ensure target is ecommerce_db
  if (!uri.includes("ecommerce_db")) {
    console.warn("WARNING: MONGODB_URI does not explicitly include 'ecommerce_db'. Ensuring safe connection.")
  }

  mongoose.connect(uri, {
    dbName: "ecommerce_db"
  })
    .then((conn) => {
      console.log(`MongoDB connected successfully to database: ${conn.connection.name || "ecommerce_db"}`)
      const { seedInitialData } = require("./seed")
      seedInitialData()
    })
    .catch(error => {
      console.log("MongoDB connection failed.")
      console.error(error)
    })
}

module.exports = { connentDB }