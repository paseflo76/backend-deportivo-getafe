const express = require('express')
const routersancion = express.Router()
const { getTeams, setPenalizacion } = require('../controller/sanciones')

// Obtener todas las sanciones
routersancion.get('/teams', getTeams)

// Crear o actualizar penalización de un equipo
routersancion.put('/penalizacion', setPenalizacion)

module.exports = routersancion
