const { Router } = require('express')
const {
  getStats,
  addJugador,
  addPortero
} = require('../controller/statsController')

const statsRouter = Router()

statsRouter.get('/', getStats)
statsRouter.post('/jugador', addJugador)
statsRouter.post('/portero', addPortero)

module.exports = statsRouter
