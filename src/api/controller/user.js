// backend/src/api/controller/user.js
const User = require('../models/user')
const { generateSign } = require('../../config/jwt')
const bcrypt = require('bcrypt')
const fs = require('fs')
const path = require('path')
const { validateRegister } = require('../../utils/validateUser')

const getUsers = async (req, res) => {
  try {
    const users = await User.find()
    return res.status(200).json(users)
  } catch (error) {
    return res.status(400).json(error)
  }
}

const getUserById = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findById(id).select('-password')
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
    return res.status(200).json(user)
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error interno', details: error.message })
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
    res.status(201).json(saved)
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Error al registrar usuario', details: error.message })
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

    const updated = await User.findByIdAndUpdate(
      id,
      { ...data, ...(rol && { rol }) },
      { new: true }
    )
    if (!updated)
      return res.status(404).json({ message: 'Usuario no encontrado' })

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

    // Borrar avatar del servidor si existe
    if (deleted.avatar) {
      const avatarPath = path.join(
        __dirname,
        '../../uploads/avatars',
        path.basename(deleted.avatar)
      )
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath)
      }
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
    if (!req.file)
      return res.status(400).json({ message: 'Archivo no enviado' })

    const user = await User.findById(id)
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })

    // Borrar avatar anterior si existe
    if (user.avatar) {
      const oldAvatarPath = path.join(
        __dirname,
        '../../uploads/avatars',
        path.basename(user.avatar)
      )
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath)
      }
    }

    // Guardar ruta relativa al avatar nuevo
    user.avatar = `/uploads/avatars/${req.file.filename}`
    await user.save()

    res
      .status(200)
      .json({ message: 'Avatar subido correctamente', avatar: user.avatar })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al subir avatar', details: error.message })
  }
}

module.exports = {
  getUsers,
  getUserById,
  register,
  login,
  updateUser,
  deleteUser,
  uploadAvatar
}
