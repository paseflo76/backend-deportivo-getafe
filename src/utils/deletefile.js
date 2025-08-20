const cloudinary = require('cloudinary').v2

const deleteFile = async (url) => {
  if (!url) return

  try {
    const parts = url.split('/')
    const folder = parts.at(-2)
    const name = parts.at(-1).split('.')[0]
    if (!folder || !name) return

    const publicId = `${folder}/${name}`
    await cloudinary.uploader.destroy(publicId) 
  } catch (err) {
    console.error('Error en deleteFile:', err.message)
  }
}

module.exports = { deleteFile }
