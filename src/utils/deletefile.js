const cloudinary = require('cloudinary').v2

const deleteFile = (url) => {
  if (!url) return

  try {
    const parts = url.split('/')
    const folder = parts.at(-2)
    const name = parts.at(-1).split('.')[0]
    if (!folder || !name) return

    const publicId = `${folder}/${name}`
    cloudinary.uploader.destroy(publicId, (err, res) => {
      if (err) console.error('Error al eliminar en Cloudinary:', err)
    })
  } catch (err) {
    console.error('Error en deleteFile:', err.message)
  }
}

module.exports = { deleteFile }
