const SancionModel = require('../models/sanciones')

// GET sanciones
const getTeams = async (req, res) => {
  try {
    const sanciones = await SancionModel.find()
    res.json(sanciones)
  } catch (err) {
    res.status(500).json({ message: 'Error obteniendo sanciones' })
  }
}

// PUT sanción
const setPenalizacion = async (req, res) => {
  const { nombre, puntos } = req.body

  // Validar nombre y tipo de puntos
  if (!nombre || typeof puntos !== 'number') {
    return res.status(400).json({ message: 'Datos inválidos' })
  }

  try {
    const sancion = await SancionModel.findOneAndUpdate(
      { nombre },
      { penalizacion: puntos },
      { upsert: true, new: true }
    )
    res.json(sancion)
  } catch (err) {
    res.status(500).json({ message: 'Error guardando sanción' })
  }
}

module.exports = { getTeams, setPenalizacion }
