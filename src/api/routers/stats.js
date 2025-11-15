const { Router } = require('express')
const {
  getStats,
  addJugador,
  addPortero,
  deletePortero
} = require('../controller/statsController')
const { isAuth, isAdmin } = require('../../middleware/auth')

const statsRouter = Router()

statsRouter.get('/', getStats) // cualquier usuario puede ver stats
statsRouter.post('/jugador', [isAuth, isAdmin], addJugador) // solo admin puede agregar/modificar
statsRouter.post('/portero', [isAuth, isAdmin], addPortero)
statsRouter.delete('/portero/:id', [isAuth, isAdmin], deletePortero)

module.exports = statsRouter
