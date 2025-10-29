import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import { configDotenv } from 'dotenv'
import connectToDB from './lib/db.js'
import authRoutes from './routes/auth.route.js'
import userRoutes from './routes/user.route.js'
import taskRoutes from './routes/task.route.js'
import reportRoutes from './routes/report.route.js'
import { fileURLToPath } from "url";


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
app.use('/api/tasks', taskRoutes)
app.use('/api/reports', reportRoutes)


// Serve uploads statically
const uploadsDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
}
app.use('/uploads', express.static(uploadsDir))

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.static(path.join(__dirname, '../../frontend/dist')))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend', 'dist', 'index.html'))
})



// Start Server
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`Server Started at port ${PORT}`)
    connectToDB()
})