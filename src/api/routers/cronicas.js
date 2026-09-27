const express = require('express')

const {
  getCronicas,
  getCronicaByJornada,
  createCronica,
  updateCronica,
  deleteCronica
} = require('../controller/cronicasController')

const router = express.Router()

// Obtener todas
router.get('/', getCronicas)

// Obtener una jornada
router.get('/:jornada', getCronicaByJornada)

// Crear
router.post('/', createCronica)

// Actualizar
router.put('/:jornada', updateCronica)

// Eliminar
router.delete('/:jornada', deleteCronica)

module.exports = router
