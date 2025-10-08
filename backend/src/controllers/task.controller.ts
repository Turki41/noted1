import { Request, Response } from "express";
import Task from "../models/Task";


export const getTasks = async (req: Request, res: Response) => {
    try {
        const { status } = req.query as { status?: string }

        const user = (req as any).user
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        //If it's an admin return all tasks assigned to All members, if it's a user return only the tasks assigned to the specific user
        const isAdmin = user.role === 'admin'

        const filter: any = {}
        if (status) filter.status = status

        const match = isAdmin ? filter : { ...filter, assignedTo: user._id }

        const tasksDocs = await Task.find(match).populate('assignedTo', 'name email profileImageUrl')

        const tasks = tasksDocs.map((t: any) => {
            const completedCount = (t.todoChecklist || []).filter((i: any) => i.completed).length
            return { ...t.toObject(), completedTodoCount: completedCount }
        })

        const baseCountFilter = isAdmin ? {} : { assignedTo: user._id }

        const [allTasks, pendingTasks, inProgressTasks, completedTasks] = await Promise.all([
            Task.countDocuments(baseCountFilter),
            Task.countDocuments({ ...baseCountFilter, status: 'Pending' }),
            Task.countDocuments({ ...baseCountFilter, status: 'In Progress' }),
            Task.countDocuments({ ...baseCountFilter, status: 'Completed' })
        ])

        return res.status(200).json({
            tasks,
            statusSummary: {
                all: allTasks,
                pendingTasks,
                inProgressTasks,
                completedTasks
            }
        })
    } catch (error) {
        if (error instanceof Error) {
            console.log('Error in getTasks controller', error.message)
        } else {
            console.log('Error in getTasks controller', String(error))
        }
        res.status(500).json({ message: 'Internal Server error' })
    }
}

export const getTaskById = async (req: Request, res: Response) => {
    try {
        const task = await Task.findById(req.params.id).populate(
            'assignedTo',
            'name email profileImageUrl'
        )

        if(!task) {
            return res.status(404).json({message: 'No task found'})
        }

        return res.status(200).json(task)
    } catch (error) {
        if (error instanceof Error) {
            console.log('Error in getTaskById controller', error.message)
        } else {
            console.log('Error in getTaskById controller', String(error))
        }
        res.status(500).json({ message: 'Internal Server error' })
    }
}

export const createTask = async (req: Request, res: Response) => {
    try {
        const { title, description, priority, dueDate, assignedTo, attachments, todoChecklist } = req.body

        if (!Array.isArray(assignedTo)) {
            res.status(400).json({ message: 'assignedTo must be an array of user IDs' })
        }

        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            createdBy: (req as any).user._id,
            assignedTo,
            attachments,
            todoChecklist
        })

        res.status(201).json({message: 'Task created seccussfully', task})

    } catch (error) {
        if (error instanceof Error) {
            console.log('Error in createTask controller', error.message)
        } else {
            console.log('Error in createTask controller', String(error))
        }
        res.status(500).json({ message: 'Internal Server error' })
    }
}

export const updateTask = async (req: Request, res: Response) => {
    try {

    } catch (error) {
        if (error instanceof Error) {
            console.log('Error in updateTask controller', error.message)
        } else {
            console.log('Error in updateTask controller', String(error))
        }
        res.status(500).json({ message: 'Internal Server error' })
    }
}

export const deleteTask = async (req: Request, res: Response) => {
    try {

    } catch (error) {
        if (error instanceof Error) {
            console.log('Error in deleteTask controller', error.message)
        } else {
            console.log('Error in deleteTask controller', String(error))
        }
        res.status(500).json({ message: 'Internal Server error' })
    }
}

export const updateTaskStatus = async (req: Request, res: Response) => {
    try {

    } catch (error) {
        if (error instanceof Error) {
            console.log('Error in updateTaskStatus controller', error.message)
        } else {
            console.log('Error in updateTaskStatus controller', String(error))
        }
        res.status(500).json({ message: 'Internal Server error' })
    }
}

export const updateTaskChecklist = async (req: Request, res: Response) => {
    try {

    } catch (error) {
        if (error instanceof Error) {
            console.log('Error in updateTaskChecklist controller', error.message)
        } else {
            console.log('Error in updateTaskChecklist controller', String(error))
        }
        res.status(500).json({ message: 'Internal Server error' })
    }
}

export const getDashboardData = async (req: Request, res: Response) => {
    try {

    } catch (error) {
        if (error instanceof Error) {
            console.log('Error in getDashboardData controller', error.message)
        } else {
            console.log('Error in getDashboardData controller', String(error))
        }
        res.status(500).json({ message: 'Internal Server error' })
    }
}

export const getUserDashboardData = async (req: Request, res: Response) => {
    try {

    } catch (error) {
        if (error instanceof Error) {
            console.log('Error in getUserDashboardData controller', error.message)
        } else {
            console.log('Error in getUserDashboardData controller', String(error))
        }
        res.status(500).json({ message: 'Internal Server error' })
    }
}