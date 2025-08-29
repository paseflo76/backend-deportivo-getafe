const Match = require('../api/models/Match')
const Club = require('../api/models/Club')

async function getClassification() {
  const clubs = await Club.find()
  const matches = await Match.find()

  // tabla inicial
  const table = clubs.map((c) => ({
    name: c.name,
    active: c.active,
    expelledAt: c.expelledAt,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0
  }))

  const findRow = (name) => table.find((t) => t.name === name)

  matches.forEach((m) => {
    const local = findRow(m.local)
    const visitante = findRow(m.visitante)

    if (!local || !visitante) return
    if (m.golesLocal === null || m.golesVisitante === null) return

    // si un club está expulsado en o antes de esta jornada, se ignoran sus partidos
    if (
      (local.expelledAt && m.jornada >= local.expelledAt) ||
      (visitante.expelledAt && m.jornada >= visitante.expelledAt)
    ) {
      return
    }

    // sumar estadísticas
    local.played++
    visitante.played++
    local.goalsFor += m.golesLocal
    local.goalsAgainst += m.golesVisitante
    visitante.goalsFor += m.golesVisitante
    visitante.goalsAgainst += m.golesLocal

    if (m.golesLocal > m.golesVisitante) {
      local.won++
      visitante.lost++
      local.points += 3
    } else if (m.golesLocal < m.golesVisitante) {
      visitante.won++
      local.lost++
      visitante.points += 3
    } else {
      local.drawn++
      visitante.drawn++
      local.points++
      visitante.points++
    }
  })

  // ordenar por puntos y diferencia de goles
  table.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    const diffA = a.goalsFor - a.goalsAgainst
    const diffB = b.goalsFor - b.goalsAgainst
    if (diffB !== diffA) return diffB - diffA
    return b.goalsFor - a.goalsFor
  })

  return table
}

module.exports = { getClassification }
