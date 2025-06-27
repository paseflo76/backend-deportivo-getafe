const { isAdmin, isAuth } = require('../../middleware/auth')
const multer = require('multer')
const path = require('path')
const {
  getUsers,
  getUserById,
  register,
  login,
  updateUser,
  deleteUser,
  uploadAvatar
} = require('../controller/user')

const userRoutes = require('express').Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars')
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${req.params.id}-${Date.now()}${ext}`)
  }
})

const upload = multer({ storage })

userRoutes.get('/admin-only', isAuth, isAdmin, (req, res) => {
  res.status(200).json({ message: 'Bienvenido administrador' })
})

userRoutes.get('/', isAdmin, getUsers)
userRoutes.get('/:id', isAuth, getUserById)
userRoutes.post('/register', register)
userRoutes.post('/login', login)
userRoutes.post('/:id/avatar', isAuth, upload.single('avatar'), uploadAvatar)
userRoutes.put('/:id', isAuth, updateUser)
userRoutes.delete('/:id', isAuth, deleteUser)

module.exports = userRoutes

