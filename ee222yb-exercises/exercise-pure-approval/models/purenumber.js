const mongoose = require('mongoose')

const numberSchema = new mongoose.Schema({
  value: { type: Number, unique: true, required: true, min: 1, max: 42 }
}, { timestamps: true })

module.exports = mongoose.model('PureNumber', numberSchema)
