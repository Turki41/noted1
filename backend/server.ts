import express from 'express'
import cors from 'cors'
import path from 'path'
import { configDotenv } from 'dotenv'
import connectToDB from './src/lib/db'
import authRoutes from './src/routes/auth.route'

configDotenv()
const app = express()

app.use(express.json())

// Cors Middleware
app.use(
    cors({
        origin: process.env.CLIENT_URL || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-type', 'Authorization']
    }))


// Routes
app.use('/api/auth', authRoutes)
/* app.use('/api/reports', reportRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/users', userRoutes) */

// Start Server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server Started at port ${PORT}`)
    connectToDB()
})