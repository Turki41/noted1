import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
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
// Serve uploads statically
const uploadsDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
}
app.use('/uploads', express.static(uploadsDir))
/* app.use('/api/reports', reportRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/users', userRoutes) */

// Start Server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server Started at port ${PORT}`)
    connectToDB()
})