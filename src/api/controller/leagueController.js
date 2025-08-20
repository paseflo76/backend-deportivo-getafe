const Match = require('../models/Match')
const { getClassification } = require('../services/classification')

async function addMatch(req, res) {
  try {
    const match = await Match.create(req.body)
    res.status(201).json(match)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

async function getMatches(req, res) {
  const jornada = req.params.jornada
  const query = jornada ? { jornada } : {}
  const matches = await Match.find(query).sort({ jornada: 1, fecha: 1 })
  res.json(matches)
}

async function classification(req, res) {
  const table = await getClassification()
  res.json(table)
}

module.exports = { addMatch, getMatches, classification }
