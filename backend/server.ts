import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import { configDotenv } from 'dotenv'
import connectToDB from './src/lib/db'
import authRoutes from './src/routes/auth.route'
import userRoutes from './src/routes/user.route'

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
app.use('/api/users', userRoutes)
/* app.use('/api/reports', reportRoutes)
app.use('/api/tasks', taskRoutes) */


// Serve uploads statically
const uploadsDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
}
app.use('/uploads', express.static(uploadsDir))

// Start Server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server Started at port ${PORT}`)
    connectToDB()
})