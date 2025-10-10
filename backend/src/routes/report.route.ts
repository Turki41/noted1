import express from 'express'
import { adminOnly, protect } from '../middlewares/auth.middleware'
import { exportTasksReport, exportUserReport } from '../controllers/report.controller'

const router = express.Router()

router.get('/export/tasks', protect, adminOnly, exportTasksReport)
router.get('/export/users', protect, adminOnly, exportUserReport)

export default router