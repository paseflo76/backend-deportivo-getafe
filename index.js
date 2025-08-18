require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const cloudinary = require('cloudinary').v2

// Nombres consistentes
const eventsRouter = require('./src/api/routers/event')
const userRouter = require('./src/api/routers/user')
const { connecDB } = require('./src/config/db')

const app = express()

// ✅ Configuración CORS (solo una)
app.use(
  cors({
    origin: 'https://frontend-deportivo-getafe-exlw.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Servir archivos estáticos de avatars
app.use(
  '/uploads/avatars',
  express.static(path.join(__dirname, 'uploads/avatars'))
)

connecDB()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

// ✅ Routers con nombres consistentes
app.use('/api/v2/eventos', eventsRouter)
app.use('/api/v2/users', userRouter)

// ✅ 404 correcto
app.use((req, res) => {
  return res.status(404).json({ message: 'Route not found' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`)
})
