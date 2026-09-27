const { Jugador, Portero } = require('../models/stats')

// Obtener estadísticas
const getStats = async (req, res) => {
  try {
    const jugadores = await Jugador.find().sort({ nombre: 1 })
    const porteros = await Portero.find().sort({ nombre: 1 })

    res.status(200).json({
      jugadores,
      porteros
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

// Reiniciar estadísticas de la temporada
const resetStats = async (req, res) => {
  try {
    await Jugador.updateMany(
      {},
      {
        $set: {
          goles: 0,
          asistencias: 0
        }
      }
    )

    await Portero.updateMany(
      {},
      {
        $set: {
          golesRecibidos: 0,
          partidos: 0
        }
      }
    )

    res.status(200).json({
      message: 'Estadísticas reiniciadas correctamente'
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

// Actualizar jugador
const updateJugador = async (req, res) => {
  const { id } = req.params
  const { goles, asistencias } = req.body

  try {
    const jugador = await Jugador.findById(id)

    if (!jugador) {
      return res.status(404).json({
        message: 'Jugador no encontrado'
      })
    }

    if (goles !== undefined) {
      jugador.goles = goles
    }

    if (asistencias !== undefined) {
      jugador.asistencias = asistencias
    }

    await jugador.save()

    res.status(200).json(jugador)
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

// Actualizar portero
const updatePortero = async (req, res) => {
  const { id } = req.params
  const { golesRecibidos, partidos } = req.body

  try {
    const portero = await Portero.findById(id)

    if (!portero) {
      return res.status(404).json({
        message: 'Portero no encontrado'
      })
    }

    if (golesRecibidos !== undefined) {
      portero.golesRecibidos = golesRecibidos
    }

    if (partidos !== undefined) {
      portero.partidos = partidos
    }

    await portero.save()

    res.status(200).json(portero)
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

// Añadir jugador
const addJugador = async (req, res) => {
  const { nombre, goles = 0, asistencias = 0 } = req.body

  try {
    if (!nombre) {
      return res.status(400).json({
        message: 'El nombre es obligatorio'
      })
    }

    let jugador = await Jugador.findOne({ nombre })

    if (jugador) {
      jugador.goles += Number(goles)
      jugador.asistencias += Number(asistencias)
    } else {
      jugador = new Jugador({
        nombre,
        goles,
        asistencias
      })
    }

    await jugador.save()

    res.status(200).json(jugador)
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

// Añadir portero
const addPortero = async (req, res) => {
  const { nombre, golesRecibidos = 0, partidos = 1 } = req.body

  try {
    if (!nombre) {
      return res.status(400).json({
        message: 'El nombre es obligatorio'
      })
    }

    let portero = await Portero.findOne({ nombre })

    if (portero) {
      portero.golesRecibidos += Number(golesRecibidos)
      portero.partidos += Number(partidos)
    } else {
      portero = new Portero({
        nombre,
        golesRecibidos,
        partidos
      })
    }

    await portero.save()

    res.status(200).json(portero)
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

// Eliminar jugador
const deleteJugador = async (req, res) => {
  const { id } = req.params

  try {
    const jugador = await Jugador.findById(id)

    if (!jugador) {
      return res.status(404).json({
        message: 'Jugador no encontrado'
      })
    }

    await jugador.deleteOne()

    res.status(200).json({
      message: 'Jugador eliminado'
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

// Eliminar portero
const deletePortero = async (req, res) => {
  const { id } = req.params

  try {
    const portero = await Portero.findById(id)

    if (!portero) {
      return res.status(404).json({
        message: 'Portero no encontrado'
      })
    }

    await portero.deleteOne()

    res.status(200).json({
      message: 'Portero eliminado'
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

module.exports = {
  getStats,
  resetStats,
  addJugador,
  addPortero,
  deleteJugador,
  deletePortero,
  updateJugador,
  updatePortero
}
