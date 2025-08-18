const { isAdmin, isAuth } = require('../../middleware/auth')
const upload = require('../../middleware/file')
const {
  getEvents,
  postEvents,
  updateEvents,
  deleteEvents,
  updateAsistencia
} = require('../controller/event')

const eventsRouters = require('express').Router()

// Rutas a los Eventos
eventsRouters.get('/tipos', (req, res) => {
  res.json(['Entrenamiento', 'Partido', 'Cena de equipo'])
})

eventsRouters.get('/', getEvents)
eventsRouters.post('/', [isAuth, isAdmin], upload.single('img'), postEvents)
eventsRouters.put('/:id', [isAuth], upload.single('img'), updateEvents)
eventsRouters.delete('/:id', [isAuth, isAdmin], deleteEvents)
eventsRouters.patch('/:id/asistencia', [isAuth], updateAsistencia)

module.exports = eventsRouters
