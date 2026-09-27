// seedStats.js
require('dotenv').config()

const { Jugador, Portero } = require('../api/models/stats')
const { connecDB } = require('../config/db')

const jugadores = [
  'Carlos',
  'Hugo',
  'Marcos',
  'Paraka',
  'Alvaro',
  'Zamora',
  'Rulo',
  'Josete',
  'Juanfer',
  'Wel',
  'Alex',
  'Raul',
  'Lolo',
  'Victor',
  'Jorge',
  'Rome',
  'Costi',
  'Super',
  'Giles',
  'Alfonso',
  'Prior',
  'Villa',
  'Pozo',
  'Ales',
  'Sergio'
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
