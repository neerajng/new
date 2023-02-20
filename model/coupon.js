const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema({
  couponCode: {
    type: String,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  discountPercentage: {
    type: Number,
    required: true
  },
  minDiscountAmount: {
    type: Number,
    required: true
  },
  isAvailable: {
    type: Boolean,
    required: true
  },
  users: [
    {
      id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true
      }
    }
  ]
})

module.exports = mongoose.model('coupon', couponSchema)
