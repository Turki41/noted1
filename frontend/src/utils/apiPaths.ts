

export const API_PATHS = {
    AUTH: {
        REGISTER: "/auth/register", // Register a new user (Admin or Member)
        LOGIN: "/auth/login", // Authenticate user & return JWT token
        GET_PROFILE: "/auth/profile", // Get logged-in user details
    },

    USERS: {
        GET_ALL_USERS: '/users',
        GET_USER_BY_ID: (userId: string) => `/users/${userId}`,
        CREATE_USER: '/users',
        UPDATE_USER: (userId: string) => `/users/${userId}`,
        DELETE_USER: (userId: string) => `/users/${userId}`,
    },
    TASKS: {
        GET_DASHBOARD_DATA: '/tasks/dashboard-data',
        GET_USER_DASHBOARD_DATA: '/tasks/user-dashboard-data',
        GET_ALL_TASKS: '/tasks',
        GET_TASK_BY_ID: (taskId: string) => `/tasks/${taskId}`,
        CREATE_TASK: '/tasks',
        UPDATE_TASK: (taskId: string) => `/tasks/${taskId}`,
        DELETE_TASK: (taskId: string) => `/tasks/${taskId}`,
        UPDATE_TASK_STATUS: (taskId: string) => `/tasks/${taskId}/status`,
        UPDATE_TODO_CHECKLIST: (taskId: string) => `/tasks/${taskId}/todo`,
        USER_TASKS: '/tasks/user-tasks'
    },
    REPORTS: {
        EXPORT_TASKS: '/reports/export/tasks',
        EXPORT_USERS: '/reports/export/users'
    },
    IMAGE: {
        UPLOAD_IMAGE: '/auth/upload-image'
    }
}