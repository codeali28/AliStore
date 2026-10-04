const jwt = require("jsonwebtoken")
const Users = require("../models/auth")

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader?.split(" ")[1]

    if (!token) {
        return res.status(401).json({ message: "Unauthorized or access token missing", isError: true })
    }

    const secret = process.env.JWT_SECRET || "ecommerce_super_secret_jwt_key_2026_codev_project"

    jwt.verify(token, secret, async (error, decoded) => {
        if (error) {
            console.error("JWT verification error:", error.message)
            return res.status(401).json({ message: "Unauthorized or invalid/expired token", isError: true })
        }

        try {
            const user = await Users.findOne({ uid: decoded.uid }).select("-password")
            if (!user) {
                return res.status(401).json({ message: "User not found or inactive", isError: true })
            }

            req.uid = user.uid
            req.user = user
            next()
        } catch (dbErr) {
            console.error("Error looking up user in auth middleware:", dbErr)
            return res.status(500).json({ message: "Internal server error during authentication", isError: true })
        }
    })
}

const verifyAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden: Admin privileges required", isError: true })
    }
    next()
}

module.exports = { verifyToken, verifyAdmin }