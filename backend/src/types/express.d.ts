declare namespace Express {
    interface UserPayload {
        id: string
        role?: string
    }

    export interface Request {
        user?: UserPayload | null
    }
}

export {}


