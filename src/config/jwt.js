const jwt = require('jsonwebtoken')
//?  Funcion  para generar la LLAVE TOKEN
const generateSign = (id, rol) => {
  return jwt.sign({ id, rol }, process.env.JWT_SECRET, { expiresIn: '1y' })
}
//?  F//? Controladoruncion  para comprobar si la llave la hemos hecho nosotros
const verifyJwt = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET)
}

module.exports = { generateSign, verifyJwt }
