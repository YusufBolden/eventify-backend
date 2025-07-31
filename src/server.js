import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import userRoutes from './routes/userRoutes.js'
import eventRoutes from './routes/eventRoutes.js'
import guestRoutes from './routes/guestRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
import settingsRoutes from './routes/settingsRoutes.js'

import { notFound, errorHandler } from './middleware/errorHandler.js'
import connectDB from './config/db.js'

dotenv.config()
connectDB()

const app = express()

app.use(express.json())

app.use(
  cors({
    origin: process.env.FRONTEND_URL?.trim(),
    credentials: false,
  })
)

app.get('/', (req, res) => {
  res.json('Welcome to Eventify')
})

app.use('/api/users', userRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/guests', guestRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/settings', settingsRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
