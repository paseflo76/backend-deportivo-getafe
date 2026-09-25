const express = require('express')

const router = express.Router()

const {
  getAllMatches,
  getMatchesByJornada,
  createMatch,
  updateMatch,
  deleteMatch,
  clearJornadaResults,
  resetLeague
} = require('../controller/leagueController')

// GET /api/v2/league/matches
router.get('/matches', getAllMatches)

// GET /api/v2/league/matches/:jornada
router.get('/matches/:jornada', getMatchesByJornada)

// POST /api/v2/league/matches
router.post('/matches', createMatch)

// IMPORTANTE:
// Estas rutas van antes de /matches/:id

// PUT /api/v2/league/matches/reset
router.put('/matches/reset', resetLeague)

// PUT /api/v2/league/matches/jornada/:jornada/clear
router.put('/matches/jornada/:jornada/clear', clearJornadaResults)

// PUT /api/v2/league/matches/:id
router.put('/matches/:id', updateMatch)

// DELETE /api/v2/league/matches/:id
router.delete('/matches/:id', deleteMatch)

module.exports = router
