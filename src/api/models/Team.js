const mongoose = require('mongoose')

const teamSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  activo: { type: Boolean, default: true }, // expulsado o no
  expulsadoEn: { type: Number, default: null } // nº de jornada de expulsión
})

module.exports = mongoose.model('Team', teamSchema)
