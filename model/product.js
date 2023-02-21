const mongoose = require('mongoose')
const uniqueValidator = require('@ladjs/mongoose-unique-validator')
const paginate = require('mongoose-paginate-v2')
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product Name is a required field'],
    unique: [true, 'Product Name already exists'],
    trim: true
  },
  price: {
    type: Number,
    default: 0,
    required: [true, 'Price is a required field'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Image is a required field']
  },
  description: {
    type: String,
    required: [true, 'Description is a required field']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is a required field']
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  stock: {
    type: Number,
    required: [true, 'Stock cannot be empty']
  }
})

productSchema.pre('save', function (next) {
  this.name = this.name.trim()[0].toUpperCase() + this.name.slice(1).toLowerCase()
  next()
})
productSchema.plugin(uniqueValidator)
productSchema.plugin(paginate)
const Product = mongoose.model('Product', productSchema)

module.exports = { Product }
