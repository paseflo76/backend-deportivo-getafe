const { Jugador, Portero } = require('../models/stats')

const getStats = async (req, res) => {
  try {
    const jugadores = await Jugador.find()
    const porteros = await Portero.find()
    res.json({ jugadores, porteros })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const addJugador = async (req, res) => {
  const { nombre, goles = 0, asistencias = 0 } = req.body
  try {
    let jugador = await Jugador.findOne({ nombre })
    if (jugador) {
      jugador.goles += goles
      jugador.asistencias += asistencias
    } else {
      jugador = new Jugador({ nombre, goles, asistencias })
    }
    await jugador.save()
    res.json(jugador)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const addPortero = async (req, res) => {
  const { nombre, golesRecibidos = 0, partidos = 1 } = req.body
  try {
    let portero = await Portero.findOne({ nombre })
    if (portero) {
      portero.golesRecibidos += golesRecibidos
      portero.partidos += partidos
    } else {
      portero = new Portero({ nombre, golesRecibidos, partidos })
    }
    await portero.save()
    res.json(portero)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteJugador = async (req, res) => {
  const { id } = req.params
  try {
    const jugador = await Jugador.findById(id)
    if (!jugador)
      return res.status(404).json({ message: 'Jugador no encontrado' })

    await jugador.deleteOne()
    res.json({ message: 'Jugador eliminado' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deletePortero = async (req, res) => {
  const { id } = req.params
  try {
    const portero = await Portero.findById(id)
    if (!portero)
      return res.status(404).json({ message: 'Portero no encontrado' })

    // Corregido: usar deleteOne en lugar de remove
    await portero.deleteOne()
    res.json({ message: 'Portero eliminado' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  getStats,
  addJugador,
  addPortero,
  deleteJugador,
  deletePortero
}
