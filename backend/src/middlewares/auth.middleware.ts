import jwt from 'jsonwebtoken'
import User from '../models/User'
import { Request, Response, NextFunction } from 'express'

// Augment Express Request with user
interface AuthUser {
    id: string
    role?: string
}
interface AuthRequest extends Request {
    user?: AuthUser | null
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        let token = req.headers.authorization

        if (token && token.startsWith('Bearer')) {
            token = token.split(' ')[1] // Extract token

            const decoded = jwt.verify(token, process.env.SECRET_KEY!) as { id: string }

            const userDoc = await User.findById(decoded.id).select('-password')
            if (!userDoc) {
                return res.status(404).json({ message: "User not found" });
            }

            req.user = { id: userDoc.id, role: (userDoc as any).role } 
            next()
            
        } else {
            console.log('no token found')
            res.status(401).json({ message: 'no token found' })
        }
    } catch (error) {
        console.log('Error in auth middleware: in token verification', (error as Error).message)
        res.status(500).json({ error: 'internal server error' })
    }
}

//Middleware for Admin-only access
export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'admin') {
        next()
    } else {
        console.log('Error in auth middleware: admin only access')
        res.status(500).json({ error: 'admin Only access' })
    }
}