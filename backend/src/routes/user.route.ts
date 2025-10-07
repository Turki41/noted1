import express from 'express'
import { adminOnly, protect } from '../middlewares/auth.middleware'
import { deleteUser, getUserById, getUsers } from '../controllers/user.controller'

const router = express.Router()

router.get('/', protect, adminOnly, getUsers) //Get all users (Admin only)
router.get('/:id', protect, getUserById) //Get a specific user
router.delete('/:id', protect, adminOnly, deleteUser) //Delete a user (Admin only)

export default router