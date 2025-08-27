const express = require('express')
const {
  addMatch,
  getMatches,
  classification
} = require('../controller/leagueController')
const { isAdmin, isAuth } = require('../../middleware/auth')

const clasificacionRouter = express.Router()

clasificacionRouter.post('/match', [isAuth, isAdmin], addMatch)
clasificacionRouter.get('/matches/:jornada', [isAuth, isAdmin], getMatches)
clasificacionRouter.get('/classification', [isAuth, isAdmin], classification)

module.exports = clasificacionRouter
