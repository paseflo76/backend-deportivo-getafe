require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const cloudinary = require('cloudinary').v2

// Routers
const eventsRouter = require('./src/api/routers/event')
const userRouter = require('./src/api/routers/user')
const leagueRouter = require('./src/api/routers/league')

const { connecDB } = require('./src/config/db')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const allowedOrigins = [
  'https://frontend-deportivo-getafe-exlw.vercel.app',
  'http://localhost:5173' // ajusta al puerto de tu frontend local
]

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true
  })
)

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

app.use('/api/v2/eventos', eventsRouter)
app.use('/api/v2/users', userRouter)
app.use('/api/v2/league', leagueRouter)

app.use((req, res) => {
  return res.status(404).json({ message: 'Route not found' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`)
})
