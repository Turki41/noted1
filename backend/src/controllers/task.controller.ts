import { Request, Response } from "express";


export const getTasks = async (req: Request, res: Response) => {
    try {

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