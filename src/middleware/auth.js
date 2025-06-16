const User = require('../api/models/user')
const { verifyJwt } = require('../config/jwt')

//? Función middleware para Express que valida autenticación y autorización por rol

const checkAuth =
  (role = null) =>
  async (req, res, next) => {
    try {
      const token = req.headers.authorization
      if (!token) return res.status(400).json('No estás autorizado')

      const parsedToken = token.replace('Bearer ', '')
      const { id } = verifyJwt(parsedToken)

      const user = await User.findById(id)
      if (!user) return res.status(400).json('No estás autorizado')

      if (role && user.rol !== role) {
        return res
          .status(400)
          .json('Esta acción solo la pueden realizar los administradores')
      }

      user.password = null
      req.user = user
      next()
    } catch (error) {
      return res.status(400).json('No estás autorizado')
    }
  }

module.exports = {
  isAuth: checkAuth(),
  isAdmin: checkAuth('admin')
}
