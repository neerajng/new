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
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true
  },
  orderItems: [
    {
      id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Product'
      },
      quantity: {
        type: Number
      }
    }
  ],
  orderId: {
    type: String
  },
  totalAmount: {
    type: Number,
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
  isReturned: {
    type: Boolean,
    default: false
  },
  isReturnStatus: {
    type: Boolean,
    default: false
  },
  isRefundStatus: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  deliveredAt: {
    type: Date
  },
  paymentId: {
    type: String
  },
  version: {
    type: Number,
    default: 0
  },
  cancelVersion: {
    type: Number,
    default: 0
  }
})

module.exports = mongoose.model('Order', orderSchema)
