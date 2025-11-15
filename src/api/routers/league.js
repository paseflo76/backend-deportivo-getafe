const express = require('express')
const router = express.Router()
const {
  getAllMatches,
  getMatchesByJornada,
  createMatch,
  updateMatch,
  deleteMatch,
  clearJornadaResults
} = require('../controller/leagueController')

// Rutas públicas y administrativas
router.get('/matches', getAllMatches)
router.get('/matches/:jornada', getMatchesByJornada)
router.post('/matches', createMatch)
router.put('/matches/:id', updateMatch)
router.delete('/matches/:id', deleteMatch)
router.put('/matches/jornada/:jornada/clear', clearJornadaResults)

module.exports = router
