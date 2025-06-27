const User = require('../api/models/user')
const { verifyJwt } = require('../config/jwt')

const isAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No autorizado' })
    }
    const token = authHeader.split(' ')[1]
    const decoded = verifyJwt(token)
    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: 'Token inválido' })
    }

    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ message: 'No autorizado' })
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
