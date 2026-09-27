const { Router } = require('express')

const {
  getStats,
  resetStats,
  addJugador,
  addPortero,
  updateJugador,
  updatePortero,
  deleteJugador,
  deletePortero
} = require('../controller/statsController')

const { isAuth, isAdmin } = require('../../middleware/auth')

const statsRouter = Router()

// Consultar estadísticas
statsRouter.get('/', getStats)

// REINICIAR TEMPORADA
statsRouter.put('/reset', isAuth, isAdmin, resetStats)

// Jugadores
statsRouter.post('/jugador', isAuth, isAdmin, addJugador)

statsRouter.put('/jugador/:id', isAuth, isAdmin, updateJugador)

statsRouter.delete('/jugador/:id', isAuth, isAdmin, deleteJugador)

// Porteros
statsRouter.post('/portero', isAuth, isAdmin, addPortero)

statsRouter.put('/portero/:id', isAuth, isAdmin, updatePortero)

statsRouter.delete('/portero/:id', isAuth, isAdmin, deletePortero)

module.exports = statsRouter
