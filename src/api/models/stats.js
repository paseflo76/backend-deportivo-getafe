const { Schema, model } = require('mongoose')

const jugadorSchema = new Schema({
  nombre: { type: String, required: true, unique: true },
  goles: { type: Number, default: 0 },
  asistencias: { type: Number, default: 0 }
})

const porteroSchema = new Schema({
  nombre: { type: String, required: true, unique: true },
  golesRecibidos: { type: Number, default: 0 },
  partidos: { type: Number, default: 0 }
})

module.exports = {
  Jugador: model('Jugador', jugadorSchema),
  Portero: model('Portero', porteroSchema)
}
