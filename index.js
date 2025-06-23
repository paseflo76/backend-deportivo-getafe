require('dotenv').config()
const express = require('express')
const cors = require('cors')
const eventsRouters = require('./src/api/routers/event')
const userRoutes = require('./src/api/routers/user')
const { connecDB } = require('./src/config/db')

const cloudinary = require('cloudinary').v2

const app = express()
/* app.use(cors()) */
app.use(
  cors({
    origin: 'https://frontend-deportivo-getafe-exlw.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
)

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

app.listen(3000, () => {
  console.log('Servidor funcionando en http://localhost:3000 🎆🎆😊')
})
