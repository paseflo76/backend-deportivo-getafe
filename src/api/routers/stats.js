const { Router } = require('express')
const {
  getStats,
  addJugador,
  addPortero
} = require('../controller/statsController')
const { isAuth, isAdmin } = require('../../middleware/auth')
// asegúrate de la ruta correcta

const statsRouter = Router()

statsRouter.get('/', getStats) // cualquier usuario puede ver stats
statsRouter.post('/jugador', [isAuth, isAdmin], addJugador) // solo admin puede agregar/modificar
statsRouter.post('/portero', [isAuth, isAdmin], addPortero)

module.exports = statsRouter
