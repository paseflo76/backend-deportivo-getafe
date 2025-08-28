const Match = require('../models/Match')
const { getClassification } = require('../../utils/classification')

// Crea un partido
async function addMatch(req, res) {
  try {
    const match = await Match.create(req.body)
    res.status(201).json(match)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Obtiene partidos, con jornada opcional
async function getMatches(req, res) {
  const jornada = req.params.jornada
  const query = jornada ? { jornada } : {}
  const matches = await Match.find(query).sort({ jornada: 1, fecha: 1 })
  res.json(matches)
}

// Actualiza resultado de un partido (solo admin)
async function updateMatch(req, res) {
  try {
    const match = await Match.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    })
    res.json(match)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Devuelve la clasificación
async function classification(req, res) {
  const table = await getClassification()
  res.json(table)
}

module.exports = { addMatch, getMatches, updateMatch, classification }
