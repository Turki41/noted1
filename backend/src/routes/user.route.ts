import express from 'express'
import { adminOnly, protect } from '../middlewares/auth.middleware.js'
import { deleteUser, getUserById, getUsers } from '../controllers/user.controller.js'

const router = express.Router()

router.get('/', protect, getUsers) //Get all users 
router.get('/:id', protect, getUserById) //Get a specific user
router.delete('/:id', protect, deleteUser) //Delete a user 

export default router