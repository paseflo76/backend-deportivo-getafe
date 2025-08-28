const express = require('express')
const {
  addMatch,
  getMatches,
  updateMatch,
  classification
} = require('../controller/leagueController')
const { isAdmin, isAuth } = require('../../middleware/auth')

const clasificacionRouter = express.Router()

// Crear partido
clasificacionRouter.post('/match', [isAuth, isAdmin], addMatch)

// Listar todas las jornadas o una específica
clasificacionRouter.get('/matches', [isAuth], getMatches)
clasificacionRouter.get('/matches/:jornada', [isAuth], getMatches)

// Actualizar resultado de un partido
clasificacionRouter.patch('/match/:id', [isAuth, isAdmin], updateMatch)

// Obtener clasificación
clasificacionRouter.get('/classification', [isAuth], classification)

module.exports = clasificacionRouter
