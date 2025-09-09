require('dotenv').config()
const mongoose = require('mongoose')
const Club = require('./src/api/models/Club')
const Match = require('./src/api/models/Match')
const { connecDB } = require('../src/config/db')

const clubs = [
  'Olimpic Ucrania',
  'Arsenal Getafe',
  'Grupo de Empresas Airbus',
  'Real Campo Real',
  'Cervezas club',
  'Bravo Getafe',
  'San Francis FC',
  'Deportivo Getafe',
  'Villabetis',
  'Celtic de Esparta',
  'Los Brasas'
]

async function seed() {
  try {
    await connecDB()
    console.log('Conectado a MongoDB')

    // Limpiar colecciones
    await Club.deleteMany({})
    await Match.deleteMany({})

    // Insertar clubs
    const clubDocs = await Club.insertMany(clubs.map((name) => ({ name })))
    console.log(`Insertados ${clubDocs.length} clubs`)

    // Generar calendario ida y vuelta con fechas
    const jornadas = []
    let jornadaNum = 1
    const equipos = [...clubs]

    if (equipos.length % 2 !== 0) equipos.push('DESCANSA')
    const n = equipos.length
    const mitad = n / 2

    const local = equipos.slice(0, mitad)
    const visitante = equipos.slice(mitad).reverse()

    // Fecha inicial → 28 septiembre 2025
    let fechaBase = new Date(2025, 8, 28)

    // Ida
    for (let r = 0; r < n - 1; r++) {
      const partidos = []
      for (let i = 0; i < mitad; i++) {
        if (local[i] !== 'DESCANSA' && visitante[i] !== 'DESCANSA') {
          partidos.push({
            jornada: jornadaNum,
            local: local[i],
            visitante: visitante[i],
            fecha: new Date(fechaBase),
            golesLocal: null,
            golesVisitante: null
          })
        }
      }
      jornadas.push(...partidos)

      // siguiente jornada +7 días
      fechaBase.setDate(fechaBase.getDate() + 7)

      // rotación
      const fijo = local[0]
      const rotar = local.slice(1).concat(visitante)
      rotar.unshift(rotar.pop())
      local.splice(1, local.length - 1, ...rotar.slice(0, mitad - 1))
      visitante.splice(0, visitante.length, ...rotar.slice(mitad - 1).reverse())

      jornadaNum++
    }

    // Vuelta (invertimos local/visitante)
    for (let r = 0; r < n - 1; r++) {
      const partidos = []
      for (let i = 0; i < mitad; i++) {
        if (local[i] !== 'DESCANSA' && visitante[i] !== 'DESCANSA') {
          partidos.push({
            jornada: jornadaNum,
            local: visitante[i],
            visitante: local[i],
            fecha: new Date(fechaBase),
            golesLocal: null,
            golesVisitante: null
          })
        }
      }
      jornadas.push(...partidos)

      fechaBase.setDate(fechaBase.getDate() + 7)

      const fijo = local[0]
      const rotar = local.slice(1).concat(visitante)
      rotar.unshift(rotar.pop())
      local.splice(1, local.length - 1, ...rotar.slice(0, mitad - 1))
      visitante.splice(0, visitante.length, ...rotar.slice(mitad - 1).reverse())

      jornadaNum++
    }

    await Match.insertMany(jornadas)
    console.log(
      `Insertados ${jornadas.length} partidos en ${jornadaNum - 1} jornadas`
    )

    mongoose.connection.close()
    console.log('Seeding completado')
  } catch (err) {
    console.error(err)
    mongoose.connection.close()
  }
}

seed()
