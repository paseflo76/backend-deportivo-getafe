const { deleteFile } = require('../../utils/deletefile')
const Events = require('../models/event')

//? Controlador para ver los eventos
const getEvents = async (req, res, next) => {
  try {
    const events = await Events.find().populate('asistentes.user', 'userName')
    return res.status(200).json(events)
  } catch (error) {
    return res.status(400).json('error en la solicitud')
  }
}
//? Controlador para publicar los Eventos
const postEvents = async (req, res, next) => {
  try {
    /* console.log('BODY:', req.body)
    console.log('FILE:', req.file) */

    const newEvent = new Events(req.body)

    if (req.file) {
      newEvent.img = req.file.path
    }

    const eventSaved = await newEvent.save()
    return res.status(201).json(eventSaved)
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      error: 'Error al crear el evento',
      detalles: error.message,
      bodyRecibido: req.body
    })
  }
}
//? Controlador para Editar los Eventos
const updateEvents = async (req, res) => {
  try {
    const { id } = req.params

    const oldEvent = await Events.findById(id)
    if (!oldEvent) {
      return res.status(404).json({ error: 'Evento no encontrado' })
    }

    if (req.file) {
      deleteFile(oldEvent.img)
    }

    const updateData = {
      titulo: req.body.titulo,
      fecha: req.body.fecha,
      lugar: req.body.lugar,
      tipo: req.body.tipo
    }

    if (req.file) {
      updateData.img = req.file.path
    }

    const eventoActualizado = await Events.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    })

    res.status(200).json(eventoActualizado)
  } catch (error) {
    res.status(400).json({
      error: 'Error al actualizar el evento',
      details: error.message
    })
  }
}
//? Controlador para Eliminar los Eventos
const deleteEvents = async (req, res, next) => {
  try {
    const { id } = req.params
    const eventsdeled = await Events.findByIdAndDelete(id)
    deleteFile(eventsdeled.img)
    return res.status(200).json({
      message: 'Elemento eliminado',
      elemento: eventsdeled
    })
  } catch (error) {
    return res.status(400).json('error al eliminar el evento')
  }
}
const updateAsistencia = async (req, res) => {
  try {
    const { id } = req.params // id del evento
    const userId = req.user._id
    const { estado } = req.body

    // Validar estado
    const estadosValidos = ['Va a entrenar 👍', 'En duda ❓', 'No puede ❌']
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ message: 'Estado no válido' })
    }

    const evento = await Events.findById(id)
    if (!evento) {
      return res.status(404).json({ message: 'Evento no encontrado' })
    }

    // Buscar si ya existe el usuario en asistentes
    const index = evento.asistentes.findIndex(
      (a) => a.user.toString() === userId.toString()
    )

    if (index !== -1) {
      // Si ya existe, actualiza el estado
      evento.asistentes[index].estado = estado
    } else {
      // Si no existe, lo agrega
      evento.asistentes.push({ user: userId, estado })
    }

    const eventoActualizado = await evento.save()
    return res.status(200).json(eventoActualizado)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error al actualizar asistencia' })
  }
}
module.exports = {
  getEvents,
  postEvents,
  updateEvents,
  deleteEvents,
  updateAsistencia
}
