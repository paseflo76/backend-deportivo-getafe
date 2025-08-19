const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    fecha: { type: String, required: true },
    lugar: { type: String, required: true },
    img: { type: String, required: false },
    tipo: {
      type: String,
      enum: ['Entrenamiento', 'Partido', 'Cena de equipo'],
      required: true
    },
    asistentes: [
      {
        user: { type: mongoose.Types.ObjectId, ref: 'User', required: false },
        estado: {
          type: String,
          enum: [
            'Va a entrenar 👍',
            'Va al partido 👍',
            'Va a la cena 🍽️',
            'En duda ❓',
            'No puede ❌'
          ],
          default: 'En duda ❓'
        }
      }
    ]
  },
  { timestamps: true }
)

const Events = mongoose.model('events', eventSchema, 'events')
module.exports = Events
