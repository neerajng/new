const mongoose = require('mongoose')
const uniqueValidator = require('@ladjs/mongoose-unique-validator')
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category Name is a required field'],
    unique: [true, 'Category Name already exists'],
    trim: true

  },
  icon: {
    type: String
  },
  color: {
    type: String
  },
  isBlocked: {
    type: Boolean,
    default: false
  }

})

categorySchema.pre('save', function (next) {
  this.name = this.name.trim()[0].toUpperCase() + this.name.slice(1).toLowerCase()
  next()
})
categorySchema.plugin(uniqueValidator)

exports.Category = mongoose.model('Category', categorySchema)
