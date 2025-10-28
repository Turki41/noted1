

export const API_PATHS = {
    AUTH: {
        REGISTER: "/api/auth/register", // Register a new user (Admin or Member)
        LOGIN: "/api/auth/login", // Authenticate user & return JWT token
        GET_PROFILE: "/api/auth/profile", // Get logged-in user details
    },

    USERS: {
        GET_ALL_USERS: '/api/users',
        GET_USER_BY_ID: (userId: string) => `/api/users/${userId}`,
        CREATE_USER: '/api/users',
        UPDATE_USER: (userId: string) => `/api/users/${userId}`,
        DELETE_USER: (userId: string) => `/api/users/${userId}`,
    },
    TASKS: {
        GET_DASHBOARD_DATA: '/api/tasks/dashboard-data',
        GET_USER_DASHBOARD_DATA: '/api/tasks/user-dashboard-data',
        GET_ALL_TASKS: '/api/tasks',
        GET_TASK_BY_ID: (taskId: string) => `/api/tasks/${taskId}`,
        CREATE_TASK: '/api/tasks',
        UPDATE_TASK: (taskId: string) => `/api/tasks/${taskId}`,
        DELETE_TASK: (taskId: string) => `/api/tasks/${taskId}`,
        UPDATE_TASK_STATUS: (taskId: string) => `/api/tasks/${taskId}/status`,
        UPDATE_TODO_CHECKLIST: (taskId: string) => `/api/tasks/${taskId}/todo`,
        USER_TASKS: '/api/tasks/user-tasks'
    },
    REPORTS: {
        EXPORT_TASKS: '/api/reports/export/tasks',
        EXPORT_USERS: '/api/reports/export/users'
    },
    IMAGE: {
        UPLOAD_IMAGE: '/api/auth/upload-image'
    }
}