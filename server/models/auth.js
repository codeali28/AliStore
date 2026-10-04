const mongoose = require("mongoose")
const { Schema } = mongoose

const schema = new Schema({
    uid: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    fullName: { type: String, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, default: "user", enum: ["user", "admin"] },
    status: { type: String, default: "active" },
}, { timestamps: true })

// Pre-save hook to ensure both name and fullName are populated
schema.pre("save", function () {
    if (!this.fullName && this.name) {
        this.fullName = this.name
    } else if (!this.name && this.fullName) {
        this.name = this.fullName
    }
})

const Users = mongoose.model("users", schema)

module.exports = Users