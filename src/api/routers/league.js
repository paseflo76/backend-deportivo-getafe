const express = require('express')
const {
  addMatch,
  getMatches,
  updateMatch,
  classification
} = require('../controller/leagueController')
const { isAdmin, isAuth } = require('../../middleware/auth')

const clasificacionRouter = express.Router()

clasificacionRouter.post('/match', [isAuth, isAdmin], addMatch)
clasificacionRouter.get('/matches/:jornada?', [isAuth], getMatches)
clasificacionRouter.patch('/match/:id', [isAuth, isAdmin], updateMatch)
clasificacionRouter.get('/classification', [isAuth], classification)

module.exports = clasificacionRouter
