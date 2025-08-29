const mongoose = require('mongoose')

const teamSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  activo: { type: Boolean, default: true }, // expulsado o no
  expulsadoEn: { type: Number, default: null } // nº de jornada de expulsión
})


const Team = mongoose.model('Team', teamSchema)
module.exports = Team
