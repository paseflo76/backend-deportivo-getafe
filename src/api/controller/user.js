const User = require('../models/user')
const { generateSign } = require('../../config/jwt')
const bcrypt = require('bcrypt')
const { validateRegister } = require('../../utils/validateUser')
const { deleteFile } = require('../../utils/deletefile')
/* const { deleteFile } = require('../../utils/deletefile') */

const getUsers = async (req, res) => {
  try {
    const users = await User.find()
    return res.status(200).json(users)
  } catch (error) {
    return res.status(400).json(error)
  }
}

const getUserById = async (req, res) => {
  const { id } = req.params
  if (!id) return res.status(400).json({ message: 'ID de usuario requerido' })
  try {
    const user = await User.findById(id).select('-password')
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
    return res.status(200).json(user)
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error interno', details: error.message })
  }
}

const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ message: 'Error interno', details: error.message })
  }
}

const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body
    const { valid, errors } = validateRegister(req.body)
    if (!valid)
      return res.status(400).json({ message: 'Datos inválidos', errors })

    const duplicate = await User.findOne({ userName })
    if (duplicate)
      return res.status(400).json({ message: 'Nombre de usuario ya existe' })

    const newUser = new User({ userName, email, password, rol: 'user' })
    const saved = await newUser.save()

    const token = generateSign(saved._id, saved.rol)
    const { password: _, ...userWithoutPassword } = saved.toObject()

    res.status(201).json({ token, user: userWithoutPassword })
  } catch (error) {
    res.status(500).json({
      message: 'Error al registrar usuario',
      details: error.message
    })
  }
}

const login = async (req, res) => {
  const { userName, password } = req.body
  if (!userName || !password)
    return res.status(400).json({ message: 'Faltan campos obligatorios' })

  try {
    const user = await User.findOne({ userName })
    if (!user)
      return res
        .status(400)
        .json({ message: 'El usuario o la contraseña son incorrectos' })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid)
      return res.status(400).json({ message: 'Credenciales incorrectas' })

    const token = generateSign(user._id, user.rol)
    const { password: _, ...userData } = user._doc

    res.status(200).json({ user: userData, token })
  } catch (error) {
    res.status(500).json({ message: 'Error interno', details: error.message })
  }
}

const updateUser = async (req, res) => {
  try {
    const { id } = req.params
    const { rol, ...data } = req.body

    if (req.user._id.toString() !== id && req.user.rol !== 'admin') {
      return res
        .status(403)
        .json({ message: 'No autorizado para actualizar este usuario' })
    }

    const allowedFields = ['name', 'email']
    const updateData = {}
    for (const key of allowedFields) {
      if (data[key] !== undefined) updateData[key] = data[key]
    }

    if (rol && req.user.rol === 'admin') {
      updateData.rol = rol
    }

    const updated = await User.findByIdAndUpdate(id, updateData, {
      new: true
    }).select('-password')
    if (!updated) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    res.status(200).json(updated)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al actualizar usuario', details: error.message })
  }
}

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    if (req.user.rol !== 'admin' && req.user._id.toString() !== id) {
      return res
        .status(403)
        .json({ message: 'No autorizado para eliminar este usuario' })
    }

    const deleted = await User.findByIdAndDelete(id)
    if (!deleted)
      return res.status(404).json({ message: 'Usuario no encontrado' })

    if (deleted.avatar) {
      await deleteFile(deleted.avatar)
    }

    res.status(200).json({ message: 'Usuario eliminado correctamente' })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al eliminar usuario', details: error.message })
  }
}

const uploadAvatar = async (req, res) => {
  try {
    const { id } = req.params
    if (!req.file) {
      return res.status(400).json({ message: 'Archivo no enviado' })
    }

    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    // si ya tiene un avatar, lo borramos antes de guardar el nuevo
    if (user.avatar) {
      await deleteFile(user.avatar)
    }

    user.avatar = req.file.path
    await user.save()

    res.status(200).json({
      message: 'Avatar subido correctamente',
      avatar: user.avatar
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error al subir avatar',
      details: error.message
    })
  }
}

module.exports = {
  getUsers,
  getUserById,
  register,
  login,
  updateUser,
  deleteUser,
  uploadAvatar,
  getMyProfile
}
