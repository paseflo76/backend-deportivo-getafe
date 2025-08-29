const Match = require('../models/Match')
const Club = require('../models/Club')
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

// Obtener partidos (todas o por jornada)
async function getMatches(req, res) {
  const jornada = req.params.jornada
  const query = jornada ? { jornada } : {}
  const matches = await Match.find(query).sort({ jornada: 1, fecha: 1 })
  res.json(matches)
}

// Actualizar resultado
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

// Clasificación
async function classification(req, res) {
  const table = await getClassification()
  res.json(table)
}

// CRUD de Clubs
async function addClub(req, res) {
  try {
    const club = await Club.create(req.body)
    res.status(201).json(club)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

async function getClubs(req, res) {
  const clubs = await Club.find()
  res.json(clubs)
}

async function expelClub(req, res) {
  try {
    const { id } = req.params
    const { jornada } = req.body
    const club = await Club.findByIdAndUpdate(
      id,
      { active: false, expelledAt: jornada },
      { new: true }
    )
    res.json(club)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = {
  addMatch,
  getMatches,
  updateMatch,
  classification,
  addClub,
  getClubs,
  expelClub
}
