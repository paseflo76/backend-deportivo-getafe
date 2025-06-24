require('dotenv').config()
const express = require('express')
const cors = require('cors')
const eventsRouters = require('./src/api/routers/event')
const userRoutes = require('./src/api/routers/user')
const { connecDB } = require('./src/config/db')

const cloudinary = require('cloudinary').v2

const app = express()

app.use(
  cors({
    origin: 'https://frontend-deportivo-getafe-exlw.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
)

app.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Origin',
    'https://frontend-deportivo-getafe-exlw.vercel.app'
  )
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  )
  next()
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

connecDB()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

app.use('/api/v2/eventos', eventsRouters)
app.use('/api/v2/users', userRoutes)

app.use((req, res) => {
  return res.status(400).json({ message: 'Route not found' })
})

/* app.listen(3000, () => {
  console.log('Servidor funcionando en http://localhost:3000 🎆🎆😊')
})
 */

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`)
})
