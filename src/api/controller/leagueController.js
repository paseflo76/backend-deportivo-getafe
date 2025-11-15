const Match = require('../models/Match')

// GET /api/v2/league/matches
const getAllMatches = async (req, res) => {
  try {
    const matches = await Match.find().sort({ jornada: 1, fecha: 1 })
    res.status(200).json(matches)
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error al obtener partidos', error: err.message })
  }
}

// GET /api/v2/league/matches/:jornada
const getMatchesByJornada = async (req, res) => {
  try {
    const { jornada } = req.params
    const matches = await Match.find({ jornada }).sort({ fecha: 1 })
    res.status(200).json(matches)
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error al obtener jornada', error: err.message })
  }
}

// POST /api/v2/league/matches
const createMatch = async (req, res) => {
  try {
    const match = new Match(req.body)
    const saved = await match.save()
    res.status(201).json(saved)
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Error al crear partido', error: err.message })
  }
}

// PUT /api/v2/league/matches/:id
const updateMatch = async (req, res) => {
  try {
    const { id } = req.params
    const updated = await Match.findByIdAndUpdate(id, req.body, { new: true })
    if (!updated)
      return res.status(404).json({ message: 'Partido no encontrado' })
    res.status(200).json(updated)
  } catch (err) {
    res.status(400).json({ message: 'Error al actualizar', error: err.message })
  }
}

// PUT /api/v2/league/matches/jornada/:jornada/clear
const clearJornadaResults = async (req, res) => {
  try {
    const { jornada } = req.params
    const result = await Match.updateMany(
      { jornada: Number(jornada) },
      { $set: { golesLocal: null, golesVisitante: null } }
    )
    res.status(200).json({
      message: `Se han borrado los resultados de la jornada ${jornada}`,
      modifiedCount: result.modifiedCount
    })
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Error al borrar resultados', error: err.message })
  }
}

// DELETE /api/v2/league/matches/:id
const deleteMatch = async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await Match.findByIdAndDelete(id)
    if (!deleted)
      return res.status(404).json({ message: 'Partido no encontrado' })
    res.status(200).json({ message: 'Partido eliminado' })
  } catch (err) {
    res.status(400).json({ message: 'Error al eliminar', error: err.message })
  }
}

module.exports = {
  getAllMatches,
  getMatchesByJornada,
  createMatch,
  clearJornadaResults,
  updateMatch,
  deleteMatch
}
