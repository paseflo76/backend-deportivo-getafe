const mongoose = require('mongoose')

const cronicaSchema = new mongoose.Schema(
  {
    jornada: {
      type: Number,
      required: true,
      unique: true,
      min: 1,
      max: 22
    },

    titular: {
      type: String,
      default: ''
    },

    resumen: {
      type: String,
      default: ''
    },

    cronicas: [
      {
        partido: {
          type: String,
          required: true
        },

        texto: {
          type: String,
          default: ''
        }
      }
    ]
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Cronica', cronicaSchema)
