const { isAdmin, isAuth } = require('../../middleware/auth')
const {
  getUsers,
  register,
  login,
  updateUser,
  deleteUser
} = require('../controller/user')

const userRoutes = require('express').Router()

//? Rutas a los Usuarios
userRoutes.get('/admin-only', isAuth, isAdmin, (req, res) => {
  res.status(200).json({ message: 'Bienvenido adminitrador' })
})

userRoutes.get('/', [isAdmin], getUsers)
userRoutes.post('/register', register)
userRoutes.post('/login', login)
userRoutes.put('/:id', [isAdmin], updateUser)
userRoutes.delete('/:id', [isAuth], deleteUser)
userRoutes.delete('/me', isAuth, deleteOwnUser)

module.exports = userRoutes
