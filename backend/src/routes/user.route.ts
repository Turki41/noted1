import express from 'express'
import { adminOnly, protect } from '../middlewares/auth.middleware'
import { deleteUser, getUserById, getUsers } from '../controllers/user.controller'

const router = express.Router()

router.get('/', protect, getUsers) //Get all users 
router.get('/:id', protect, getUserById) //Get a specific user
router.delete('/:id', protect, deleteUser) //Delete a user 

export default router