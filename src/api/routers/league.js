const express = require('express')
const {
  addMatch,
  getMatches,
  classification
} = require('../controller/leagueController')
const { isAdmin } = require('../../middleware/auth')

const clasificacionRouter = express.Router()

clasificacionRouter.post('/match', isAdmin, addMatch)
clasificacionRouter.get('/matches/:jornada', getMatches)
clasificacionRouter.get('/classification', classification)

module.exports = clasificacionRouter
