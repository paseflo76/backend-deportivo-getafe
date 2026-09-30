const express = require('express')

const {
  getCronicas,
  getCronicaByJornada,
  createCronica,
  updateCronica,
  deleteCronica
} = require('../controller/cronicasController')

const { isAuth, isAdmin } = require('../../middleware/auth')

const upload = require('../../middleware/file')

const router = express.Router()

// ======================================================
// GET
// ======================================================

router.get('/', getCronicas)

router.get('/:jornada', getCronicaByJornada)

// ======================================================
// POST
// ======================================================

router.post(
  '/',
  [isAuth, isAdmin],
  upload.fields([
    {
      name: 'imagenEstrella',
      maxCount: 1
    },
    {
      name: 'imagenResultados',
      maxCount: 1
    }
  ]),
  createCronica
)

// ======================================================
// PUT
// ======================================================

router.put(
  '/:jornada',
  [isAuth, isAdmin],
  upload.fields([
    {
      name: 'imagenEstrella',
      maxCount: 1
    },
    {
      name: 'imagenResultados',
      maxCount: 1
    }
  ]),
  updateCronica
)

// ======================================================
// DELETE
// ======================================================

router.delete('/:jornada', [isAuth, isAdmin], deleteCronica)

module.exports = router
