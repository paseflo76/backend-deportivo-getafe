const Match = require('../models/Match')
const Team = require('../models/Team')

async function getClassification() {
  const teams = await Team.find()
  const matches = await Match.find()

  const table = teams.map((t) => ({
    equipo: t.nombre,
    puntos: 0,
    gf: 0,
    gc: 0,
    activo: t.activo,
    expulsadoEn: t.expulsadoEn
  }))

  const findTeam = (name) => table.find((t) => t.equipo === name)

  matches.forEach((m) => {
    if (m.golesLocal == null || m.golesVisitante == null) return

    const local = findTeam(m.local)
    const visitante = findTeam(m.visitante)

    if (
      (local && local.expulsadoEn && m.jornada >= local.expulsadoEn) ||
      (visitante && visitante.expulsadoEn && m.jornada >= visitante.expulsadoEn)
    )
      return

    if (!local || !visitante) return

    local.gf += m.golesLocal
    local.gc += m.golesVisitante
    visitante.gf += m.golesVisitante
    visitante.gc += m.golesLocal

    if (m.golesLocal > m.golesVisitante) local.puntos += 3
    else if (m.golesLocal < m.golesVisitante) visitante.puntos += 3
    else {
      local.puntos += 1
      visitante.puntos += 1
    }
  })

  return table.sort(
    (a, b) => b.puntos - a.puntos || b.gf - b.gc - (a.gf - a.gc) || b.gf - a.gf
  )
}

module.exports = { getClassification }
