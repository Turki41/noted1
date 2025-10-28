

// @desc    Get all users (Admin only)
// @route   GET /api/users/
// @access  Private (Admin) 

import { Request, Response } from "express"
import Task from "../models/Task.js"
import User from "../models/User.js"

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find({ 'role': 'user' }).select('-password')

        //Add task counts to each user
        const usersWithTaskCounts = await Promise.all(users.map(async (user) => {
            const pendingTasks = await Task.countDocuments({ assignedTo: user._id, status: 'Pending' })
            const inProgressTasks = await Task.countDocuments({ assignedTo: user._id, status: 'In Progress' })
            const conpletedTasks = await Task.countDocuments({ assignedTo: user._id, status: 'Completed' })

            return {
                ...user.toObject(),
                pendingTasks,
                inProgressTasks,
                conpletedTasks
            }
        }))

        return res.status(200).json(usersWithTaskCounts)


    } catch (error) {
        if (error instanceof Error) {
            console.log('Error in getUsers controller', error.message)
        } else {
            console.log('Error in getUsers controller', String(error))
        }
        res.status(500).json({ message: 'Internal Server error' })
    }
}


export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id).select('-password')

        if(!user) {
            console.log('No user found')
            res.status(404).json({message: 'No user found'})
        }

        return res.status(200).json(user)
    } catch (error) {
        if (error instanceof Error) {
            console.log('Error in getUserById controller', error.message)
        } else {
            console.log('Error in getUserById controller', String(error))
        }
        res.status(500).json({ message: 'Internal Server error' })
    }
}


export const deleteUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id

        // Delete tasks exclusively assigned to this user
        await Task.deleteMany({
            assignedTo: userId,
            $expr: { $eq: [ { $size: "$assignedTo" }, 1 ] }
        })

        // For collaborative tasks, remove this user from assignees
        await Task.updateMany(
            {
                assignedTo: userId,
                $expr: { $gt: [ { $size: "$assignedTo" }, 1 ] }
            },
            { $pull: { assignedTo: userId } }
        )

        await User.findByIdAndDelete(userId)

        return res.status(200).json({ message: 'User deleted, tasks cleaned up' })
    } catch (error) {
        if (error instanceof Error) {
            console.log('Error in deleteUser controller', error.message)
        } else {
            console.log('Error in deleteUser controller', String(error))
        }
        res.status(500).json({ message: 'Internal Server error' })
    }
}