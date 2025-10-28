import express from 'express'
import { adminOnly, protect } from '../middlewares/auth.middleware.js'
import { exportTasksReport, exportUserReport } from '../controllers/report.controller.js'

const router = express.Router()

router.get('/export/tasks', protect, exportTasksReport)
router.get('/export/users', protect, exportUserReport)

export default router