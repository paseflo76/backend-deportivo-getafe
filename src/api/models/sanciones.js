const mongoose = require('mongoose')

const sancionSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  penalizacion: { type: Number, default: 0 }
})

module.exports = mongoose.model('Sancion', sancionSchema)
