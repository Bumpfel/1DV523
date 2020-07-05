const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: false, trim: true },
  price: { type: Number, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  inStock: { type: Number, required: true, default: 0 }
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product
