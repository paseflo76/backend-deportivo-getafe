const { isAdmin, isAuth } = require('../../middleware/auth')
const upload = require('../../middleware/file')
const {
  getUsers,
  getUserById,
  register,
  login,
  updateUser,
  deleteUser,
  uploadAvatar,
  getMyProfile
} = require('../controller/user')

const userRoutes = require('express').Router()

userRoutes.get('/validate', isAuth, (req, res) => {
  res.status(200).json({ message: 'Token válido', user: req.user })
})

userRoutes.get('/admin-only', isAuth, isAdmin, (req, res) => {
  res.status(200).json({ message: 'Bienvenido administrador' })
})

// Admin ve todos los usuarios
userRoutes.get('/', isAuth, isAdmin, getUsers)

// Usuario o admin ve su perfil
userRoutes.get('/me', isAuth, getMyProfile)

// Usuario o admin puede ver usuario por id (si es admin o es el mismo)
userRoutes.get('/:id', isAuth, getUserById)

userRoutes.post('/register', register)
userRoutes.post('/login', login)

userRoutes.put('/:id', isAuth, updateUser)
userRoutes.delete('/:id', isAuth, deleteUser)

// Sube avatar (solo para el propio usuario)
userRoutes.post('/:id/avatar', isAuth, upload.single('avatar'), uploadAvatar)

module.exports = userRoutes
