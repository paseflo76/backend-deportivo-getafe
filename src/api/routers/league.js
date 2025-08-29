const express = require('express')
const {
  addMatch,
  getMatches,
  updateMatch,
  classification,
  addTeam,
  expelTeam
} = require('../controllers/leagueController')
const { isAdmin, isAuth } = require('../../middleware/auth')

const clasificacionRouter = express.Router()

// Partidos
clasificacionRouter.post('/match', [isAuth, isAdmin], addMatch)
clasificacionRouter.get('/matches', [isAuth], getMatches)
clasificacionRouter.get('/matches/:jornada', [isAuth], getMatches)
clasificacionRouter.patch('/match/:id', [isAuth, isAdmin], updateMatch)

// Clasificación
clasificacionRouter.get('/classification', [isAuth], classification)

// Equipos
clasificacionRouter.post('/team', [isAuth, isAdmin], addTeam)
clasificacionRouter.patch('/team/:id/expel', [isAuth, isAdmin], expelTeam)

module.exports = clasificacionRouter
