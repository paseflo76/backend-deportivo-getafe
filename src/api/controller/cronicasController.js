const Cronica = require('../models/Cronica')

// ======================================================
// OBTENER TODAS LAS CRÓNICAS
// GET /api/v2/cronicas
// ======================================================

const getCronicas = async (req, res) => {
  try {
    const cronicas = await Cronica.find().sort({ jornada: 1 })

    res.status(200).json(cronicas)
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener las crónicas',
      error: error.message
    })
  }
}

// ======================================================
// OBTENER CRÓNICA DE UNA JORNADA
// GET /api/v2/cronicas/:jornada
// ======================================================

const getCronicaByJornada = async (req, res) => {
  try {
    const jornada = Number(req.params.jornada)

    const cronica = await Cronica.findOne({ jornada })

    if (!cronica) {
      return res.status(404).json({
        message: 'No existe una crónica para esta jornada'
      })
    }

    res.status(200).json(cronica)
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener la crónica',
      error: error.message
    })
  }
}

// ======================================================
// CREAR CRÓNICA
// POST /api/v2/cronicas
// ======================================================

const createCronica = async (req, res) => {
  try {
    const { jornada, titular, resumen, cronicas } = req.body

    if (!jornada) {
      return res.status(400).json({
        message: 'La jornada es obligatoria'
      })
    }

    const existe = await Cronica.findOne({ jornada })

    if (existe) {
      return res.status(400).json({
        message: 'Ya existe una crónica para esta jornada'
      })
    }

    const nuevaCronica = await Cronica.create({
      jornada,
      titular,
      resumen,
      cronicas
    })

    res.status(201).json(nuevaCronica)
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear la crónica',
      error: error.message
    })
  }
}

// ======================================================
// ACTUALIZAR CRÓNICA
// PUT /api/v2/cronicas/:jornada
// ======================================================

const updateCronica = async (req, res) => {
  try {
    const jornada = Number(req.params.jornada)

    const { titular, resumen, cronicas } = req.body

    const cronica = await Cronica.findOneAndUpdate(
      { jornada },
      {
        titular,
        resumen,
        cronicas
      },
      {
        new: true,
        runValidators: true
      }
    )

    if (!cronica) {
      return res.status(404).json({
        message: 'No existe una crónica para esta jornada'
      })
    }

    res.status(200).json(cronica)
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar la crónica',
      error: error.message
    })
  }
}

// ======================================================
// ELIMINAR CRÓNICA
// DELETE /api/v2/cronicas/:jornada
// ======================================================

const deleteCronica = async (req, res) => {
  try {
    const jornada = Number(req.params.jornada)

    const cronica = await Cronica.findOneAndDelete({
      jornada
    })

    if (!cronica) {
      return res.status(404).json({
        message: 'No existe una crónica para esta jornada'
      })
    }

    res.status(200).json({
      message: 'Crónica eliminada correctamente'
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar la crónica',
      error: error.message
    })
  }
}

module.exports = {
  getCronicas,
  getCronicaByJornada,
  createCronica,
  updateCronica,
  deleteCronica
}
