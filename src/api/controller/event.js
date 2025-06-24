const { deleteFile } = require('../../utils/deletefile')
const Events = require('../models/event')

// Controlador para ver eventos
const getEvents = async (req, res) => {
  try {
    const events = await Events.find().populate('asistentes.user', 'userName')
    return res.status(200).json(events)
  } catch (error) {
    return res.status(400).json({ error: 'Error en la solicitud' })
  }
}

// Controlador para crear eventos
const postEvents = async (req, res) => {
  try {
    const newEvent = new Events(req.body)
    if (req.file) newEvent.img = req.file.path
    const eventSaved = await newEvent.save()
    return res.status(201).json(eventSaved)
  } catch (error) {
    return res.status(400).json({
      error: 'Error al crear el evento',
      details: error.message,
      body: req.body
    })
  }
}

// Controlador para actualizar eventos
const updateEvents = async (req, res) => {
  try {
    const { id } = req.params
    const oldEvent = await Events.findById(id)
    if (!oldEvent)
      return res.status(404).json({ error: 'Evento no encontrado' })

    const updateData = { ...req.body }
    if (req.file) {
      if (oldEvent.img) deleteFile(oldEvent.img)
      updateData.img = req.file.path
    }

    const updatedEvent = await Events.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    })

    res.status(200).json(updatedEvent)
  } catch (error) {
    res
      .status(400)
      .json({ error: 'Error al actualizar el evento', details: error.message })
  }
}

// Controlador para eliminar eventos
const deleteEvents = async (req, res) => {
  try {
    const { id } = req.params
    const deletedEvent = await Events.findByIdAndDelete(id)
    if (deletedEvent?.img) deleteFile(deletedEvent.img)
    return res
      .status(200)
      .json({ message: 'Elemento eliminado', elemento: deletedEvent })
  } catch (error) {
    return res.status(400).json({ error: 'Error al eliminar el evento' })
  }
}

// Controlador para actualizar asistencia
const updateAsistencia = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user._id
    const { estado } = req.body

    const ESTADOS_VALIDOS = ['Va a entrenar 👍', 'En duda ❓', 'No puede ❌']
    if (!ESTADOS_VALIDOS.includes(estado)) {
      return res.status(400).json({ message: 'Estado no válido' })
    }

    const evento = await Events.findById(id)
    if (!evento)
      return res.status(404).json({ message: 'Evento no encontrado' })

    const asistente = evento.asistentes.find(
      (a) => a.user.toString() === userId.toString()
    )
    if (asistente) {
      asistente.estado = estado
    } else {
      evento.asistentes.push({ user: userId, estado })
    }

    const updated = await evento.save()
    res.status(200).json(updated)
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar asistencia',
      details: error.message
    })
  }
}

module.exports = {
  getEvents,
  postEvents,
  updateEvents,
  deleteEvents,
  updateAsistencia
}
