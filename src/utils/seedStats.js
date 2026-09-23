// seedStats.js
require('dotenv').config()

const { Jugador, Portero } = require('../api/models/stats')
const { connecDB } = require('../config/db')

const jugadores = [
  'Carlos',
  'Sergio',
  'Marcos',
  'Paraka',
  'Alvaro',
  'Zamora',
  'Rulo',
  'Josete',
  'Juanfer',
  'Wel',
  'Pozo',
  'Raul',
  'Lolo',
  'Alex',
  'Jorge',
  'Rome',
  'Costi',
  'Super',
  'Victor',
  'Alfonso',
  'Prior',
  'Villa',
  'Hugo',
  'Ales',
  'Giles'
]

const porteros = ['Carlos', 'Ales', 'Super']

const seed = async () => {
  await connecDB()

  await Jugador.deleteMany({})
  await Portero.deleteMany({})

  await Jugador.insertMany(
    jugadores.map((nombre) => ({ nombre, goles: 0, asistencias: 0 }))
  )
  await Portero.insertMany(
    porteros.map((nombre) => ({ nombre, golesRecibidos: 0, partidos: 0 }))
  )

  console.log('Base de datos inicializada')
  process.exit()
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
