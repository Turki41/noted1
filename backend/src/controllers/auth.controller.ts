import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import User from '../models/User'
import bcrypt from 'bcryptjs'

const generateToken = (userId: string) => {
    return jwt.sign({ id: userId }, process.env.SECRET_KEY!, { expiresIn: '30d' })
}

export const registerUser = async (req: Request, res: Response) => {
    try {
        
        const { name, email, password, profileImageUrl, adminInviteToken } = req.body
        
        //Check if user already exists
        const userExists = await User.findOne({ email })
        if (userExists) {
            console.log('User already exists')
            return res.status(400).json({ message: 'User Already exists' })
        }
        
        //Determine user Role: admin if correct token is provided, user otherwise
        let role = 'user'
        if (adminInviteToken && adminInviteToken == process.env.ADMIN_INVITE_TOKEN) {
            role = 'admin'
        }
        
        //Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        //Create new User
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            profileImageUrl,
            role
        })

        //Return user data with JWT
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(String(user._id))
        })
    } catch (error) {
        res.status(500).json({ message: 'Internal Server error' })
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try {

    } catch (error) {
        res.status(500).json({ message: 'Internal Server error' })
    }
}

export const getUserProfile = async (req: Request, res: Response) => {
    try {

    } catch (error) {
        res.status(500).json({ message: 'Internal Server error' })
    }
}

export const updateUserProfile = async (req: Request, res: Response) => {
    try {

    } catch (error) {
        res.status(500).json({ message: 'Internal Server error' })
    }
}
