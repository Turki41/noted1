import { Request, Response } from "express";
import Task from "../models/Task";
import excelJS from 'exceljs'
import User from "../models/User";

export const exportTasksReport = async (req: Request, res: Response) => {
    try {
        const tasks = await Task.find().populate('assignedTo', 'name email')

        const workbook = new excelJS.Workbook()
        const worksheet = workbook.addWorksheet('Task Report')

        worksheet.columns = [
            { header: 'Title', key: 'title', width: 30 },
            { header: 'Description', key: 'description', width: 50 },
            { header: 'Priority', key: 'priority', width: 15 },
            { header: 'Status', key: 'status', width: 20 },
            { header: 'Due Date', key: 'dueDate', width: 20 },
            { header: 'Assigned To', key: 'assignedTo', width: 30 },
        ]

        tasks.forEach((task) => {
            const assignedTo = task.assignedTo.map((user) => `${(user as any).name}`)
            worksheet.addRow({
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                dueDate: task.dueDate?.toISOString().split('T')[0],
                assignedTo: String(assignedTo) || 'Unassigned'
            })
        })

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=tasks_report.xlsx'
        )

        return workbook.xlsx.write(res).then(() => {
            res.end()
        })
    } catch (error) {
        if (error instanceof Error) {
            console.log('Error in exportTasksReport controller', error.message)
        } else {
            console.log('Error in exportTasksReport controller', String(error))
        }
        res.status(500).json({ message: 'Internal Server error' })
    }
}

export const exportUserReport = async (req: Request, res: Response) => {
    try {
        const users = await User.find().select('name email _id').lean()
        const userTasks = await Task.find().populate(
            'assignedTo',
            'name email _id'
        )

        const userTaskMap: Record<string, {
            name: string;
            email: string;
            tasksCount: number;
            pendingTasks: number;
            inProgressTasks: number;
            completedTasks: number;
        }> = {}

        users.forEach((user) => {
            userTaskMap[String(user._id)] = {
                name: user.name,
                email: user.email,
                tasksCount: 0,
                pendingTasks: 0,
                inProgressTasks: 0,
                completedTasks: 0
            }
        })

        userTasks.forEach((task) => {
            if (task.assignedTo) {
                task.assignedTo.forEach((assignedUser) => {
                    if (userTaskMap[String(assignedUser._id)]) {
                        userTaskMap[String(assignedUser._id)].tasksCount += 1
                        if (task.status === 'Pending') {
                            userTaskMap[String(assignedUser._id)].pendingTasks += 1
                        } else if (task.status === 'In Progress') {
                            userTaskMap[String(assignedUser._id)].inProgressTasks += 1
                        } else if (task.status === 'Completed') {
                            userTaskMap[String(assignedUser._id)].completedTasks += 1
                        }
                    }
                })
            }
        })

        const workbook = new excelJS.Workbook()
        const worksheet = workbook.addWorksheet("User Tasks Report")

        worksheet.columns = [
            { header: 'User Name', key: 'name', width: 30 },
            { header: 'Email', key: 'email', width: 40 },
            { header: 'Total Assigned Tasks', key: 'tasksCount', width: 20 },
            { header: 'Pending Tasks', key: 'pendingTasks', width: 20 },
            {header: 'In Progress Tasks', key: 'inProgressTasks', width:20},
            {header: 'Completed Tasks', key: 'completedTasks', width: 20}
        ]

        Object.values(userTaskMap).forEach((user) => {
            worksheet.addRow(user)
        })

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )

        res.setHeader(
            'Content-Disposition',
            'attachment; filename="users_report.xlsx"'
        )

        return workbook.xlsx.write(res).then(() => {
            res.end()
        })
    } catch (error) {
        if (error instanceof Error) {
            console.log('Error in exportUserReports controller', error.message)
        } else {
            console.log('Error in exportUserReports controller', String(error))
        }
        res.status(500).json({ message: 'Internal Server error' })
    }
}