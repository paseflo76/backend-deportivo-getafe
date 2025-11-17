const { Router } = require('express')
const {
  getStats,
  addJugador,
  addPortero,
  deletePortero,
  deleteJugador
} = require('../controller/statsController')
const { isAuth, isAdmin } = require('../../middleware/auth')

const statsRouter = Router()

statsRouter.get('/', getStats) // cualquier usuario puede ver stats
statsRouter.post('/jugador', [isAuth, isAdmin], addJugador)
statsRouter.post('/portero', [isAuth, isAdmin], addPortero)
statsRouter.delete('/jugador/:id', [isAuth, isAdmin], deleteJugador)
statsRouter.delete('/portero/:id', [isAuth, isAdmin], deletePortero)

module.exports = statsRouter
