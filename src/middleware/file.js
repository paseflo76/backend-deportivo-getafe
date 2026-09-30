const { CloudinaryStorage } = require('multer-storage-cloudinary')

const multer = require('multer')

const cloudinary = require('cloudinary').v2

const storage = new CloudinaryStorage({
  cloudinary,

  params: (req, file) => {
    let folder = 'eventos'

    if (
      file.fieldname === 'imagenEstrella' ||
      file.fieldname === 'imagenResultados'
    ) {
      folder = 'cronicas'
    }

    return {
      folder,

      allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp']
    }
  }
})

const upload = multer({
  storage
})

module.exports = upload
