const User = require('../models/user')
const { generateSign } = require('../../config/jwt')
const bcrypt = require('bcrypt')

//? Controlador para ver los Usuarios
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find()
    return res.status(200).json(users)
  } catch (error) {
    return res.status(400).json(error)
  }
}
//? Controlador para el nRegistro de Usuarios
const register = async (req, res, next) => {
  try {
    const newUser = new User({
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
      rol: 'user'
    })
    const duplicateUser = await User.findOne({ userName: req.body.userName })
    if (duplicateUser) {
      return res.status(400).json('Ese Nombre Ya Esta Ocupado')
    }

    const userSaved = await newUser.save()
    return res.status(201).json(userSaved)
  } catch (error) {
    return res.status(400).json(error)
  }
}
//? Controlador para Loguear Usuarios
const login = async (req, res, next) => {
  const { userName, password } = req.body

  if (!userName || !password) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' })
  }

  try {
    const user = await User.findOne({ userName })

    if (!user) {
      return res
        .status(400)
        .json({ message: 'El usuario o la contraseña son incorrectos' })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ message: 'El usuario o la contraseña son incorrectos' })
    }

    const token = generateSign(user._id, user.rol)
    const { password: _, ...userData } = user._doc

    return res.status(200).json({ user: userData, token })
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor', error })
  }
}
//? Controlador para Modificar Usuarios
const updateUser = async (req, res) => {
  try {
    const { id } = req.params
    const { rol, ...updateData } = req.body // Extraemos el rol para manejarlo aparte

    // Buscar y actualizar el usuario
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { ...updateData, ...(rol && { rol }) }, // Solo actualiza el rol si está presente
      { new: true }
    )

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    return res.status(200).json(updatedUser)
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error al actualizar el usuario', error })
  }
}
//? Controlador para Eliminar Usuarios
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params

    // Si el usuario autenticado es admin, puede eliminar a cualquiera
    // Si no es admin, solo puede eliminarse a sí mismo
    if (req.user.rol !== 'Admin' && req.user._id.toString() !== id) {
      return res
        .status(403)
        .json({ message: 'No puedes eliminar este usuario' })
    }

    const deletedUser = await User.findByIdAndDelete(id)

    if (!deletedUser) {
      return res.status(404).json({ message: 'usuario no encontrado' })
    }
    return res.status(200).json({ message: 'usuario eliminado correctamente' })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'error al eliminar el usuario', error })
  }
}

module.exports = { getUsers, register, login, updateUser, deleteUser }
