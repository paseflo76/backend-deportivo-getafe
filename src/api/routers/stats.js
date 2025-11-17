const { Router } = require('express')
const {
  getStats,
  addJugador,
  addPortero,
  deletePortero,
  deleteJugador,
  updateJugador,
  updatePortero
} = require('../controller/statsController')
const { isAuth, isAdmin } = require('../../middleware/auth')

const statsRouter = Router()

statsRouter.get('/', getStats) // cualquier usuario puede ver stats
statsRouter.post('/jugador', [isAuth, isAdmin], addJugador)
statsRouter.post('/portero', [isAuth, isAdmin], addPortero)
statsRouter.put('/jugador/:id', [isAuth, isAdmin], updateJugador)
statsRouter.put('/portero/:id', [isAuth, isAdmin], updatePortero)
statsRouter.delete('/jugador/:id', [isAuth, isAdmin], deleteJugador)
statsRouter.delete('/portero/:id', [isAuth, isAdmin], deletePortero)

module.exports = statsRouter
