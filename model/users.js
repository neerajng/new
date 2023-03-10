const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, 'First name cannot be empty']
  },
  lastname: {
    type: String,
    required: [true, 'Last name cannot be empty']
  },
  email: {
    type: String,
    required: [true, 'Email cannot be empty'],
    index: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number cannot be empty'],
    minlength: [10, 'Phone number must be 10 digits'],
    maxlength: [10, 'Phone number must be 10 digits']
  },
  password: {
    type: String,
    required: [true, 'Password cannot be empty']
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  cart: [
    {
      id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Product'
      },
      quantity: {
        type: Number
      },
      increment: {
        type: Boolean
      },
      decrement: {
        type: Boolean
      }
    }
  ],
  address: [
    {
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
        type: String,
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
    }
  ]
})

userSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password')) {
      const hashedPassword = await bcrypt.hash(this.password, 10)
      this.password = hashedPassword
      next()
    } else {
      next()
    }
  } catch (error) {
    return error
  }
})

const User = mongoose.model('User', userSchema)

module.exports = { User }
