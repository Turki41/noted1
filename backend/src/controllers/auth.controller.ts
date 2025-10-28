import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import User from '../models/User.js'
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
        if (error instanceof Error) {
            console.log('Error in register controller', error.message)
        } else {
            console.log('Error in register controller', String(error))
        }
        res.status(500).json({ message: 'Internal Server error' })
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        //Find if user exist
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }
        //Check if password is correct
        const correctPassword = await bcrypt.compare(password, user.password)

        if (!correctPassword) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(String(user._id))
        })
    } catch (error) {
        if (error instanceof Error) {
            console.log('Error in login controller', error.message)
        } else {
            console.log('Error in login controller', String(error))
        }
        res.status(500).json({ message: 'Internal Server error' })
    }
}

export const getUserProfile = async (req: Request, res: Response) => {
    try {
        // @ts-expect-error: req.user is set by authentication middleware
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(201).json(user)

    } catch (error) {
        if (error instanceof Error) {
            console.log('Error in getUserProfile controller', error.message)
        } else {
            console.log('Error in getUserProfile controller', String(error))
        }
        res.status(500).json({ message: 'Internal Server error' })
    }
}

export const updateUserProfile = async (req: Request, res: Response) => {
    try {
        // @ts-expect-error: req.user is set by authentication middleware
        const user = await User.findById(req.user.id)

        //Check if user exist
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        //Update name, email and password
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email

        if (req.body.adminInviteToken && req.body.adminInviteToken == process.env.ADMIN_INVITE_TOKEN) {
            user.role = 'admin'
        }

        if (req.body.password) {
            user.password = await bcrypt.hash(req.body.password, 10)
        }

        const updatedUser = await user.save()

        return res.status(201).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            token: generateToken(String(updatedUser._id))
        })
    } catch (error) {
        if (error instanceof Error) {
            console.log('Error in updateUserProfile controller', error.message)
        } else {
            console.log('Error in updateUserProfile controller', String(error))
        }
        res.status(500).json({ message: 'Internal Server error' })
    }
}
