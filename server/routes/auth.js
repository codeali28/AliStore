const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Users = require("../models/auth")
const { verifyToken } = require("../middleware/auth")

const router = express.Router()

// POST /register (Public registration - strictly role: "user")
router.post("/register", async (req, res) => {
    try {
        const { name, fullName, email, password } = req.body

        const userName = (name || fullName || "").trim()
        const userEmail = (email || "").trim().toLowerCase()

        if (!userName) {
            return res.status(400).json({ message: "Name is required", isError: true })
        }
        if (!userEmail) {
            return res.status(400).json({ message: "Valid email is required", isError: true })
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters", isError: true })
        }

        const existingUser = await Users.findOne({ email: userEmail })
        if (existingUser) {
            return res.status(400).json({ message: "Email is already in use.", isError: true })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const uid = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)

        // Enforce role: 'user' regardless of what the client sent
        const newUserData = {
            uid,
            name: userName,
            fullName: userName,
            email: userEmail,
            password: hashedPassword,
            role: "user",
            status: "active"
        }

        const newUser = new Users(newUserData)
        await newUser.save()

        const userResponse = newUser.toObject()
        delete userResponse.password

        res.status(201).json({
            message: "Account created successfully",
            user: userResponse
        })
    } catch (error) {
        console.error("Register error:", error)
        res.status(500).json({ message: "Internal server error", isError: true })
    }
})

// POST /login (User and Admin login)
router.post("/login", async (req, res) => {
    try {
        const { email, password, isAdminLogin } = req.body

        const userEmail = (email || "").trim().toLowerCase()

        if (!userEmail || !password) {
            return res.status(400).json({ message: "Email and password are required", isError: true })
        }

        const user = await Users.findOne({ email: userEmail })
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password", isError: true })
        }

        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            return res.status(401).json({ message: "Invalid email or password", isError: true })
        }

        // Check if Admin Login was attempted
        if (isAdminLogin && user.role !== "admin") {
            return res.status(403).json({
                message: "Access Denied: You do not possess Administrator permissions.",
                isError: true
            })
        }

        const secret = process.env.JWT_SECRET || "ecommerce_super_secret_jwt_key_2026_codev_project"
        const token = jwt.sign(
            { uid: user.uid, role: user.role },
            secret,
            { expiresIn: "7d" }
        )

        const userResponse = user.toObject()
        delete userResponse.password

        res.status(200).json({
            message: "Login successful",
            token,
            user: userResponse
        })
    } catch (error) {
        console.error("Login error:", error)
        res.status(500).json({ message: "Internal Server error", isError: true })
    }
})

// GET /user (Get currently logged-in user profile)
router.get("/user", verifyToken, async (req, res) => {
    try {
        const user = req.user
        res.status(200).json({ message: "User found", user })
    } catch (error) {
        console.error("User profile error:", error)
        res.status(500).json({ message: "Internal Server error", isError: true })
    }
})

// POST /setup-admin (Controlled one-time initial admin account creation)
router.post("/setup-admin", async (req, res) => {
    try {
        const existingAdmin = await Users.findOne({ role: "admin" })
        if (existingAdmin) {
            return res.status(400).json({
                message: "An Administrator already exists in ecommerce_db. Admin setup is locked.",
                isError: true
            })
        }

        const { name, email, password } = req.body
        const userName = (name || "AliStore Admin").trim()
        const userEmail = (email || "admin@shophub.com").trim().toLowerCase()
        const userPassword = password || "admin123"

        if (userPassword.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters", isError: true })
        }

        const hashedPassword = await bcrypt.hash(userPassword, 10)
        const uid = "admin_" + Math.random().toString(36).slice(2, 10)

        const adminUser = new Users({
            uid,
            name: userName,
            fullName: userName,
            email: userEmail,
            password: hashedPassword,
            role: "admin",
            status: "active"
        })

        await adminUser.save()

        const userResponse = adminUser.toObject()
        delete userResponse.password

        res.status(201).json({
            message: "Administrator account created successfully in ecommerce_db.",
            admin: userResponse
        })
    } catch (error) {
        console.error("Setup admin error:", error)
        res.status(500).json({ message: "Internal server error", isError: true })
    }
})

module.exports = router

 