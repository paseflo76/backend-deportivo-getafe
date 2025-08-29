const Match = require('../models/Match')
const Team = require('../models/Team')
const { getClassification } = require('../../utils/classification')

// Crear partido
async function addMatch(req, res) {
  try {
    const match = await Match.create(req.body)
    res.status(201).json(match)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Obtener partidos (todas las jornadas o una específica)
async function getMatches(req, res) {
  const jornada = req.params.jornada
  const query = jornada ? { jornada } : {}
  const matches = await Match.find(query).sort({ jornada: 1, fecha: 1 })
  res.json(matches)
}

// Actualizar resultado de un partido
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

// Devuelve clasificación
async function classification(req, res) {
  const table = await getClassification()
  res.json(table)
}

// Registrar un equipo
async function addTeam(req, res) {
  try {
    const team = await Team.create(req.body)
    res.status(201).json(team)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Expulsar equipo (lo marca como inactivo y guarda jornada expulsión)
async function expelTeam(req, res) {
  try {
    const { id } = req.params
    const { jornada } = req.body
    const team = await Team.findByIdAndUpdate(
      id,
      { activo: false, expulsadoEn: jornada },
      { new: true }
    )
    res.json(team)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = {
  addMatch,
  getMatches,
  updateMatch,
  classification,
  addTeam,
  expelTeam
}
