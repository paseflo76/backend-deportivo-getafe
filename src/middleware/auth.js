const User = require('../api/models/user')
const { verifyJwt } = require('../config/jwt')

//? Función middleware para Express que valida autenticación y autorización por rol

const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    const decoded = verifyJwt(token)

    const user = await User.findById(decoded.id)
    if (!user) return res.status(401).json({ message: 'Usuario no encontrado' })

    req.user = user
    next()
  } catch {
    res.status(401).json({ message: 'No autorizado' })
  }
}

const isAdmin = (req, res, next) => {
  if (req.user?.rol !== 'admin') {
    return res
      .status(403)
      .json({ message: 'Acceso restringido a administradores' })
  }
  next()
}

module.exports = { isAuth, isAdmin }
