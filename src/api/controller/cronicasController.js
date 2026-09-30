const Cronica = require('../models/Cronica')

// ======================================================
// GET TODAS
// ======================================================

const getCronicas = async (req, res) => {
  try {
    const cronicas = await Cronica.find().sort({
      jornada: 1
    })

    res.status(200).json(cronicas)
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener las crónicas',
      error: error.message
    })
  }
}

// ======================================================
// GET POR JORNADA
// ======================================================

const getCronicaByJornada = async (req, res) => {
  try {
    const jornada = Number(req.params.jornada)

    const cronica = await Cronica.findOne({
      jornada
    })

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
// CREAR
// ======================================================

const createCronica = async (req, res) => {
  try {
    const jornada = Number(req.body.jornada)

    const titular = req.body.titular || ''
    const resumen = req.body.resumen || ''

    let cronicas = []

    if (req.body.cronicas) {
      try {
        cronicas = JSON.parse(req.body.cronicas)
      } catch (error) {
        return res.status(400).json({
          message: 'El formato de las crónicas no es válido'
        })
      }
    }

    if (!jornada) {
      return res.status(400).json({
        message: 'La jornada es obligatoria'
      })
    }

    const existe = await Cronica.findOne({
      jornada
    })

    if (existe) {
      return res.status(400).json({
        message: 'Ya existe una crónica para esta jornada'
      })
    }

    const imagenEstrella = req.files?.imagenEstrella?.[0]?.path || ''

    const imagenResultados = req.files?.imagenResultados?.[0]?.path || ''

    const nuevaCronica = await Cronica.create({
      jornada,
      titular,
      resumen,
      cronicas,
      imagenEstrella,
      imagenResultados
    })

    res.status(201).json(nuevaCronica)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Error al crear la crónica',
      error: error.message
    })
  }
}

// ======================================================
// ACTUALIZAR
// ======================================================

const updateCronica = async (req, res) => {
  try {
    const jornada = Number(req.params.jornada)

    const cronica = await Cronica.findOne({
      jornada
    })

    if (!cronica) {
      return res.status(404).json({
        message: 'No existe una crónica para esta jornada'
      })
    }

    const titular =
      req.body.titular !== undefined ? req.body.titular : cronica.titular

    const resumen =
      req.body.resumen !== undefined ? req.body.resumen : cronica.resumen

    let cronicas = cronica.cronicas

    if (req.body.cronicas !== undefined) {
      try {
        cronicas = JSON.parse(req.body.cronicas)
      } catch (error) {
        return res.status(400).json({
          message: 'El formato de las crónicas no es válido'
        })
      }
    }

    let imagenEstrella = cronica.imagenEstrella

    let imagenResultados = cronica.imagenResultados

    if (req.files?.imagenEstrella?.[0]?.path) {
      imagenEstrella = req.files.imagenEstrella[0].path
    }

    if (req.files?.imagenResultados?.[0]?.path) {
      imagenResultados = req.files.imagenResultados[0].path
    }

    cronica.titular = titular
    cronica.resumen = resumen
    cronica.cronicas = cronicas
    cronica.imagenEstrella = imagenEstrella
    cronica.imagenResultados = imagenResultados

    await cronica.save()

    res.status(200).json(cronica)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Error al actualizar la crónica',
      error: error.message
    })
  }
}

// ======================================================
// DELETE
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
