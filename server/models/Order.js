const mongoose = require("mongoose")
const { Schema } = mongoose

const orderItemSchema = new Schema({
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    image: { type: String, default: "" }
}, { _id: false })

const schema = new Schema({
    orderId: { type: String, unique: true, index: true },
    userId: { type: String, required: true, ref: "users" },
    customerName: { type: String, default: "" },
    customerEmail: { type: String, default: "" },
    shippingInfo: {
        fullName: { type: String, default: "" },
        address: { type: String, default: "" },
        city: { type: String, default: "" },
        phone: { type: String, default: "" }
    },
    products: { type: [orderItemSchema], required: true },
    totalPrice: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, default: "Cash on Delivery" },
    status: { type: String, default: "Processing", enum: ["Pending", "Processing", "Delivered", "Cancelled"] }
}, { timestamps: true })

schema.pre("save", function () {
    if (!this.orderId) {
        this.orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000)
    }
})

const Orders = mongoose.model("orders", schema)

module.exports = Orders
