const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    shippingInfo: {
        houseName: {
            type: String,
            required: true
        },
        phone: {
            type: Number,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        postalCode: {
            type: Number,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        }
    },
    user: {
        type:mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: true
    },
    orderItems: [
        {
            id: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: "Product"
            },
            quantity: {
                type: Number
            }
        }
    ],
    totalAmount: {
        type:Number,
        required: true
    },
    paymentMode: {
        type: String,
        required: true
    },
    isDelivered: {
        type: Boolean,
        default: false
    },
    isCancelled: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    deliveredAt: {
        type: Date
    }
})

module.exports = mongoose.model('Order', orderSchema)