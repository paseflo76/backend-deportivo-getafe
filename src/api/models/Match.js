const mongoose = require('mongoose')

const matchSchema = new mongoose.Schema({
  jornada: { type: Number, required: true },
  local: { type: String, required: true }, // nombre equipo
  visitante: { type: String, required: true },
  golesLocal: { type: Number, default: null },
  golesVisitante: { type: Number, default: null },
  fecha: { type: Date, required: true }
})

module.exports = mongoose.model('Match', matchSchema)
