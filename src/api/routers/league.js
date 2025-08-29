const express = require('express')
const {
  addMatch,
  getMatches,
  updateMatch,
  classification,
  addClub,
  getClubs,
  expelClub
} = require('../controller/leagueController')
const { isAdmin, isAuth } = require('../../middleware/auth')

const router = express.Router()

// Partidos
router.post('/match', [isAuth, isAdmin], addMatch)
router.get('/matches', [isAuth], getMatches)
router.get('/matches/:jornada', [isAuth], getMatches)
router.patch('/match/:id', [isAuth, isAdmin], updateMatch)

// Clubs
router.post('/club', [isAuth, isAdmin], addClub)
router.get('/clubs', [isAuth], getClubs)
router.patch('/club/:id/expel', [isAuth, isAdmin], expelClub)

// Clasificación
router.get('/classification', [isAuth], classification)

module.exports = router
