const mongoose = require('mongoose')

const clubSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  active: { type: Boolean, default: true }, // expulsado o no
  expelledAt: { type: Number, default: null } // jornada de expulsión
})

module.exports = mongoose.model('Club', clubSchema)
