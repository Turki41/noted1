import { Request, Response } from "express";
import Task from "../models/Task";


export const getTasks = async (req: Request, res: Response) => {
    try {
        const { status } = req.query as { status?: string }

        const user = (req as any).user
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' })
        }


        const filter: any = {}
        if (status) filter.status = status

        const match = filter

        const tasksDocs = await Task.find(match).populate('assignedTo', 'name email profileImageUrl')

        const tasks = tasksDocs.map((t: any) => {
            const completedCount = (t.todoChecklist || []).filter((i: any) => i.completed).length
            return { ...t.toObject(), completedTodoCount: completedCount }
        })

        const baseCountFilter = {}

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

        if (!task) {
            return res.status(404).json({ message: 'No task found' })
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

        res.status(201).json({ message: 'Task created seccussfully', task })

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
        const task = await Task.findById(req.params.id)

        if (!task) {
            return res.status(404).json({ message: 'No task found' })
        }

        task.title = req.body.title || task.title
        task.description = req.body.description || task.description
        task.priority = req.body.priority || task.priority
        task.dueDate = req.body.dueDate || task.dueDate
        task.todoChecklist = req.body.todoChecklist || task.todoChecklist
        task.attachments = req.body.attachments || task.attachments

        if (req.body.assignedTo && !Array.isArray(req.body.assignedTo)) {
            return res.status(400).json({ message: 'assignedTo must be an array of user IDs' })
        }

        const updatedTask = await task.save()

        return res.status(200).json({ message: 'Task updated successfully', updatedTask })

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
        const task = await Task.findByIdAndDelete(req.params.id)

        if (!task) {
            return res.status(404).json({ message: 'No task found' })
        }

        return res.status(200).json({ message: 'Task deleted successfully' })

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
        const task = await Task.findById(req.params.id)

        if (!task) {
            return res.status(404).json({ message: 'No task found' })
        }

        const isAssigned = task.assignedTo.some(
            (userId) => userId === (req as any).user._id
        )

        if (!isAssigned && (req as any).user.role !== 'admin') {
            return res.status(400).json({ message: 'Not authorized' })
        }

        task.status = req.body.status || task.status

        if (task.status === 'Completed') {
            task.todoChecklist.forEach((item) => { item.completed = true })
            task.progress = 100
        }

        await task.save()
        return res.status(200).json({ message: 'Task updated successfully', task })

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
        const { todoChecklist } = req.body
        const task = await Task.findById(req.params.id)

        if (!task) {
            return res.status(404).json({
                message: 'No task found'
            })
        }

        if (!task.assignedTo.includes((req as any).user._id) && (req as any).user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorize to update Checklist' })
        }

        task.todoChecklist = todoChecklist

        //Auto-update progress based of checklist completion
        const completedCount = task.todoChecklist.filter(
            (item) => item.completed
        ).length
        const totalItems = task.todoChecklist.length

        task.progress = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0

        //Auto-mark task as completed if all items are checked
        if (task.progress === 100) {
            task.status = 'Completed'
        } else if (task.progress > 0) {
            task.status = 'In Progress'
        } else {
            task.status = 'Pending'
        }

        await task.save()
        const updatedTask = await Task.findById(req.params.id).populate(
            'assignedTo', 'name email profileImageUrl'
        )

        return res.status(200).json({ message: 'Task checklist updated', task: updatedTask })

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
        //Fetch statistics
        const totalTasks = await Task.countDocuments()
        const pendingTasks = await Task.countDocuments({ status: 'Pending' })
        const completedTasks = await Task.countDocuments({ status: 'Completed' })
        const overdueTasks = await Task.countDocuments({
            status: { $ne: 'Completed' },
            dueDate: { $lt: new Date() }
        })

        const taskStatuses = ['Pending', 'In Progress', 'Completed']
        const taskDistributionRaw = await Task.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ])

        const taskDistribution = taskStatuses.reduce<Record<string, number>>((acc, status) => {
            const formattedKey = status.replace(/\s+/g, '') //remove spaces for response key
            acc[formattedKey] = taskDistributionRaw.find((item) => item._id === status)?.count || 0
            return acc
        }, {})
        taskDistribution['All'] = totalTasks

        const tasksPriorities = ['Low', 'Medium', 'High']
        const tasksPriorityLevelsRaw = await Task.aggregate([
            {
                $group: {
                    _id: '$priority',
                    count: { $sum: 1 }
                }
            }
        ])
        const tasksPriorityLevels = tasksPriorities.reduce<Record<string, number>>((acc, prioriry) => {
            acc[prioriry] = tasksPriorityLevelsRaw.find((item) => item._id === prioriry)?.count || 0
            return acc
        }, {})

        //Fetch most recent 10 tasks
        const recentTasks = await Task.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select('title status priority dueDate createAt')

        return res.status(200).json({
            statistics: {
                totalTasks,
                pendingTasks,
                completedTasks,
                overdueTasks
            },
            charts: {
                taskDistribution,
                tasksPriorityLevels
            },
            recentTasks
        })

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
        //Fetch statistics for logged in user
        const userId = (req as any).user._id

        const totalTasks = await Task.countDocuments({ assignedTo: userId })
        const pendingTasks = await Task.countDocuments({ assignedTo: userId, status: 'Pending' })
        const completedTasks = await Task.countDocuments({ assignedTo: userId, status: 'Completed' })
        const overdueTasks = await Task.countDocuments({
            assignedTo: userId,
            status: { $ne: 'Completed' },
            dueDate: { $lt: new Date() }
        })

        //Task distribution by status
        const taskStatuses = ['Pending', 'In Progress', 'Completed']
        const taskDistributionRaw = await Task.aggregate([
            { $match: { assignedTo: userId } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ])

        const taskDistribution = taskStatuses.reduce<Record<string, number>>((acc, status) => {
            const formattedKey = status.replace(/\s+/g, '')
            acc[formattedKey] = taskDistributionRaw.find((item) => item._id === status)?.count || 0
            return acc
        }, {})
        taskDistribution['All'] = totalTasks

        //Task distribution by priority
        const tasksPriorities = ['Low', 'Medium', 'High']
        const tasksPriorityLevelsRaw = await Task.aggregate([
            { $match: { assignedTo: userId } },
            {
                $group: {
                    _id: '$priority',
                    count: { $sum: 1 }
                }
            }
        ])

        const tasksPriorityLevels = tasksPriorities.reduce<Record<string, number>>((acc, priority) => {
            acc[priority] = tasksPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0
            return acc
        }, {})

        //Fetch most recent 10 tasks for this user
        const recentTasks = await Task.find({ assignedTo: userId })
            .sort({ createdAt: -1 })
            .limit(10)
            .select('title status priority dueDate createdAt')

        return res.status(200).json({
            statistics: {
                totalTasks,
                pendingTasks,
                completedTasks,
                overdueTasks
            },
            charts: {
                taskDistribution,
                tasksPriorityLevels
            },
            recentTasks
        })

    } catch (error) {
        if (error instanceof Error) {
            console.log('Error in getUserDashboardData controller', error.message)
        } else {
            console.log('Error in getUserDashboardData controller', String(error))
        }
        res.status(500).json({ message: 'Internal Server error' })
    }
}