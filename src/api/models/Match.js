const mongoose = require('mongoose')

const matchSchema = new mongoose.Schema(
  {
    jornada: {
      type: Number,
      required: true
    },
    fecha: {
      type: Date
    },
    local: {
      type: String,
      required: false
    },
    visitante: {
      type: String,
      required: false
    },
    golesLocal: {
      type: Number,
      default: null
    },
    golesVisitante: {
      type: Number,
      default: null
    },
    descansa: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
)

const Match = mongoose.model('Match', matchSchema)
module.exports = Match
