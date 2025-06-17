// backend/src/api/controller/user.js

const User = require('../models/user')
const { generateSign } = require('../../config/jwt')
const bcrypt = require('bcrypt')
const { validateRegister } = require('../../utils/validateUser')

const getUsers = async (req, res) => {
  try {
    const users = await User.find()
    return res.status(200).json(users)
  } catch (error) {
    return res.status(400).json(error)
  }
}

const register = async (req, res) => {
  const { userName, email, password } = req.body
  const { valid, errors } = validateRegister(req.body)
  if (!valid)
    return res.status(400).json({ message: 'Datos inválidos', errors })

  try {
    const duplicateUser = await User.findOne({ userName })
    if (duplicateUser) return res.status(400).json('Ese Nombre Ya Esta Ocupado')

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
      rol: 'user'
    })
    const userSaved = await newUser.save()
    return res.status(201).json(userSaved)
  } catch (error) {
    return res.status(400).json(error)
  }
}

const login = async (req, res) => {
  const { userName, password } = req.body
  if (!userName || !password)
    return res.status(400).json({ message: 'Faltan campos obligatorios' })

  try {
    const user = await User.findOne({ userName })
    if (!user)
      return res.status(400).json({ message: 'El usuario o la contraseña son incorrectos' })

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect)
      return res.status(400).json({ message: 'El usuario o la contraseña son incorrectos' })

    const token = generateSign(user._id, user.rol)
    const { password: _, ...userData } = user._doc

    return res.status(200).json({ user: userData, token })
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor', error })
  }
}

const updateUser = async (req, res) => {
  try {
    const { id } = req.params
    const { rol, ...updateData } = req.body
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { ...updateData, ...(rol && { rol }) },
      { new: true }
    )
    if (!updatedUser)
      return res.status(404).json({ message: 'Usuario no encontrado' })
    return res.status(200).json(updatedUser)
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error al actualizar el usuario', error })
  }
}

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    if (
      req.user.rol.toLowerCase() !== 'admin' &&
      req.user._id.toString() !== id
    ) {
      return res
        .status(403)
        .json({ message: 'No puedes eliminar este usuario' })
    }
    const deletedUser = await User.findByIdAndDelete(id)
    if (!deletedUser)
      return res.status(404).json({ message: 'usuario no encontrado' })
    return res.status(200).json({ message: 'usuario eliminado correctamente' })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'error al eliminar el usuario', error })
  }
}

module.exports = { getUsers, register, login, updateUser, deleteUser }
