import express from 'express'
import { adminOnly, protect } from '../middlewares/auth.middleware.js'
import { createTask, deleteTask, getDashboardData, getTaskById, getTasks, getUserDashboardData, getUserTasks, updateTask, updateTaskChecklist, updateTaskStatus } from '../controllers/task.controller.js'

const router = express.Router()

router.get('/dashboard-data', protect, getDashboardData)
router.get('/user-dashboard-data', protect, getUserDashboardData)
router.get('/', protect, getTasks)
router.get('/user-tasks', protect, getUserTasks)
router.get('/:id', protect, getTaskById)
router.post('/', protect, createTask)
router.put('/:id', protect, updateTask)
router.delete('/:id', protect, deleteTask)
router.put('/:id/status', protect, updateTaskStatus)
router.put('/:id/todo', protect, updateTaskChecklist)

export default router