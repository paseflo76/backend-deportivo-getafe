const Match = require('../api/models/Match')

async function getClassification() {
  const matches = await Match.find({
    golesLocal: { $ne: null },
    golesVisitante: { $ne: null }
  })

  const teamsMap = {}

  matches.forEach((m) => {
    const { local, visitante, golesLocal, golesVisitante } = m

    if (!teamsMap[local])
      teamsMap[local] = { equipo: local, puntos: 0, gf: 0, gc: 0 }
    if (!teamsMap[visitante])
      teamsMap[visitante] = { equipo: visitante, puntos: 0, gf: 0, gc: 0 }

    teamsMap[local].gf += golesLocal
    teamsMap[local].gc += golesVisitante
    teamsMap[visitante].gf += golesVisitante
    teamsMap[visitante].gc += golesLocal

    if (golesLocal > golesVisitante) {
      teamsMap[local].puntos += 3
    } else if (golesLocal < golesVisitante) {
      teamsMap[visitante].puntos += 3
    } else {
      teamsMap[local].puntos += 1
      teamsMap[visitante].puntos += 1
    }
  })

  const table = Object.values(teamsMap).sort((a, b) => {
    const diffA = a.gf - a.gc
    const diffB = b.gf - b.gc
    if (b.puntos !== a.puntos) return b.puntos - a.puntos
    if (diffB !== diffA) return diffB - diffA
    return b.gf - a.gf
  })

  return table
}

module.exports = { getClassification }
