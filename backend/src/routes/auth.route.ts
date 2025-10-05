import express from 'express'
import { getUserProfile, loginUser, registerUser, updateUserProfile } from '../controllers/auth.controller'
import { protect } from '../middlewares/auth.middleware'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/profile', protect, getUserProfile)
router.put('/update-profile', protect, updateUserProfile)

export default router