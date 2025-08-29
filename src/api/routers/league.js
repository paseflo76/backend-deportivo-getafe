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

const leagueRouter = require('express').Router()

// Partidos
leagueRouter.post('/match', [isAuth, isAdmin], addMatch)
leagueRouter.get('/matches', [isAuth], getMatches)
leagueRouter.get('/matches/:jornada', [isAuth], getMatches)
leagueRouter.patch('/match/:id', [isAuth, isAdmin], updateMatch)

// Clubs
leagueRouter.post('/club', [isAuth, isAdmin], addClub)
leagueRouter.get('/clubs', [isAuth], getClubs)
leagueRouter.patch('/club/:id/expel', [isAuth, isAdmin], expelClub)

// Clasificación
leagueRouter.get('/classification', [isAuth], classification)

module.exports = leagueRouter
