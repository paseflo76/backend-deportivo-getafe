const Sancion = require('../models/sanciones')

// GET sanciones
const getTeams = async (req, res) => {
  const sanciones = await Sancion.find()
  res.json(sanciones)
}

// PUT sanción
const setPenalizacion = async (req, res) => {
  const { nombre, puntos } = req.body

  if (!nombre || typeof puntos !== 'number' || puntos < 0) {
    return res.status(400).json({ message: 'Datos inválidos' })
  }

  const Sancion = await Sancion.findOneAndUpdate(
    { nombre },
    { penalizacion: puntos },
    { upsert: true, new: true }
  )

  res.json(Sancion)
}

module.exports = { getTeams, setPenalizacion }
