const mongoose = require("mongoose")
const { Schema } = mongoose

const schema = new Schema({
    id: { type: String, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, default: "", trim: true },
    image: { type: String, required: true },
    imagePublicId: { type: String, default: "" },
    category: { type: String, default: "General", trim: true },
}, { timestamps: true })

// Ensure id is set before save if not provided
schema.pre("save", function () {
    if (!this.id) {
        this.id = this._id ? this._id.toString() : Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
    }
})

const Products = mongoose.model("products", schema)

module.exports = Products
