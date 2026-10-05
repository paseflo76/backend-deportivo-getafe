const Match = require('../models/Match')

// GET /api/v2/league/matches
const getAllMatches = async (req, res) => {
  try {
    const matches = await Match.find().sort({
      jornada: 1,
      fecha: 1
    })

    res.status(200).json(matches)
  } catch (err) {
    res.status(500).json({
      message: 'Error al obtener partidos',
      error: err.message
    })
  }
}

// GET /api/v2/league/matches/:jornada
const getMatchesByJornada = async (req, res) => {
  try {
    const { jornada } = req.params

    const matches = await Match.find({
      jornada: Number(jornada)
    }).sort({
      fecha: 1
    })

    res.status(200).json(matches)
  } catch (err) {
    res.status(500).json({
      message: 'Error al obtener jornada',
      error: err.message
    })
  }
}

// POST /api/v2/league/matches
const createMatch = async (req, res) => {
  try {
    const payload = {
      jornada: Number(req.body.jornada),
      fecha: req.body.fecha,
      local: req.body.local,
      visitante: req.body.visitante,
      golesLocal: req.body.golesLocal ?? null,
      golesVisitante: req.body.golesVisitante ?? null
    }

    const exists = await Match.findOne({
      jornada: payload.jornada,
      local: payload.local,
      visitante: payload.visitante
    })

    if (exists) {
      return res.status(409).json({
        message: 'Ya existe este partido'
      })
    }

    const match = new Match(payload)
    const saved = await match.save()

    res.status(201).json(saved)
  } catch (err) {
    res.status(400).json({
      message: 'Error al crear partido',
      error: err.message
    })
  }
}

// PUT /api/v2/league/matches/:id
const updateMatch = async (req, res) => {
  try {
    const { id } = req.params

    const payload = {
      jornada:
        req.body.jornada !== undefined ? Number(req.body.jornada) : undefined,
      fecha: req.body.fecha,
      local: req.body.local,
      visitante: req.body.visitante,
      golesLocal: req.body.golesLocal ?? null,
      golesVisitante: req.body.golesVisitante ?? null
    }

    if (payload.jornada && payload.local && payload.visitante) {
      const duplicate = await Match.findOne({
        _id: { $ne: id },
        jornada: payload.jornada,
        local: payload.local,
        visitante: payload.visitante
      })

      if (duplicate) {
        return res.status(409).json({
          message: 'Duplicado detectado'
        })
      }
    }

    const updated = await Match.findByIdAndUpdate(id, payload, { new: true })

    if (!updated) {
      return res.status(404).json({
        message: 'Partido no encontrado'
      })
    }

    res.status(200).json(updated)
  } catch (err) {
    res.status(400).json({
      message: 'Error al actualizar',
      error: err.message
    })
  }
}

// PUT /api/v2/league/matches/jornada/:jornada/clear
const clearJornadaResults = async (req, res) => {
  try {
    const jornada = Number(req.params.jornada)

    if (!Number.isInteger(jornada) || jornada < 1) {
      return res.status(400).json({
        message: 'Jornada no válida'
      })
    }

    const result = await Match.updateMany(
      {
        jornada: jornada
      },
      {
        $set: {
          golesLocal: null,
          golesVisitante: null
        }
      }
    )

    res.status(200).json({
      message: `Se han borrado los resultados de la jornada ${jornada}`,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount
    })
  } catch (err) {
    console.error('Error al borrar resultados de la jornada:', err)

    res.status(500).json({
      message: 'Error al borrar resultados',
      error: err.message
    })
  }
}

// PUT /api/v2/league/matches/reset
const resetLeague = async (req, res) => {
  try {
    const result = await Match.updateMany(
      {},
      {
        $set: {
          golesLocal: null,
          golesVisitante: null
        }
      }
    )

    res.status(200).json({
      message: 'Liga reiniciada correctamente',
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount
    })
  } catch (err) {
    console.error('Error al reiniciar la liga:', err)

    res.status(500).json({
      message: 'Error al reiniciar la liga',
      error: err.message
    })
  }
}

// DELETE /api/v2/league/matches/:id
const deleteMatch = async (req, res) => {
  try {
    const { id } = req.params

    const deleted = await Match.findByIdAndDelete(id)

    if (!deleted) {
      return res.status(404).json({
        message: 'Partido no encontrado'
      })
    }

    res.status(200).json({
      message: 'Partido eliminado'
    })
  } catch (err) {
    res.status(400).json({
      message: 'Error al eliminar',
      error: err.message
    })
  }
}

// ======================================================
// SINCRONIZAR CALENDARIO ACTUAL
// ======================================================

const syncCalendar = async (req, res) => {
  try {
    const calendario = req.body.calendario

    if (!Array.isArray(calendario) || calendario.length !== 22) {
      return res.status(400).json({
        message: 'El calendario debe contener exactamente 22 jornadas'
      })
    }

    // --------------------------------------------
    // Normalizamos nombres antiguos
    // --------------------------------------------

    const normalizarEquipo = (nombre) => {
      if (!nombre) return nombre

      if (nombre === 'G  EMPRESAS AIRBUS') {
        return 'G.E AIRBUS'
      }

      return nombre
    }

    // --------------------------------------------
    // Guardamos todos los resultados existentes
    // --------------------------------------------

    const partidosExistentes = await Match.find()

    const resultadosValidos = new Map()

    for (const partido of partidosExistentes) {
      if (
        partido.local == null ||
        partido.visitante == null ||
        partido.golesLocal == null ||
        partido.golesVisitante == null
      ) {
        continue
      }

      const local = normalizarEquipo(partido.local)
      const visitante = normalizarEquipo(partido.visitante)

      // VILLABETIS ya no existe
      if (local === 'VILLABETIS' || visitante === 'VILLABETIS') {
        continue
      }

      const key = `${partido.jornada}|${local}|${visitante}`

      // Conservamos el primer resultado encontrado
      if (!resultadosValidos.has(key)) {
        resultadosValidos.set(key, {
          golesLocal: partido.golesLocal,
          golesVisitante: partido.golesVisitante
        })
      }
    }

    // --------------------------------------------
    // Borramos todos los partidos actuales
    // --------------------------------------------

    await Match.deleteMany({})

    // --------------------------------------------
    // Creamos de nuevo los 110 partidos
    // según el calendario definitivo
    // --------------------------------------------

    const nuevosPartidos = []

    for (let i = 0; i < calendario.length; i++) {
      const jornada = i + 1
      const jornadaArray = calendario[i]

      const fechaItem = jornadaArray.find((item) => item.fecha)
      const fecha = fechaItem?.fecha || null

      for (const partido of jornadaArray) {
        if (!partido.local || !partido.visitante) {
          continue
        }

        const local = normalizarEquipo(partido.local)
        const visitante = normalizarEquipo(partido.visitante)

        const key = `${jornada}|${local}|${visitante}`

        const resultado = resultadosValidos.get(key)

        nuevosPartidos.push({
          jornada,
          fecha,
          local,
          visitante,
          golesLocal: resultado?.golesLocal ?? null,
          golesVisitante: resultado?.golesVisitante ?? null
        })
      }
    }

    const creados = await Match.insertMany(nuevosPartidos)

    res.status(200).json({
      message: 'Calendario sincronizado correctamente',
      jornadas: calendario.length,
      partidos: creados.length,
      resultadosConservados: resultadosValidos.size
    })
  } catch (err) {
    console.error('Error sincronizando calendario:', err)

    res.status(500).json({
      message: 'Error al sincronizar calendario',
      error: err.message
    })
  }
}

module.exports = {
  getAllMatches,
  getMatchesByJornada,
  createMatch,
  updateMatch,
  deleteMatch,
  clearJornadaResults,
  resetLeague,
  syncCalendar
}
