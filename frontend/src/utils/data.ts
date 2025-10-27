import { LuClipboardCheck, LuClipboardList, LuLayoutDashboard, LuLogOut, LuSquarePlus, LuUsers } from "react-icons/lu";

export const SIDE_MENU_DATA = [
    {
        id: '01',
        label: 'Dashboard',
        path: '/user/dashboard',
        icon: LuLayoutDashboard
    },
    {
        id: '02',
        label: 'Manage Tasks',
        path: '/user/manage-tasks',
        icon: LuClipboardCheck
    },
    {
        id: '03',
        label: 'My Tasks',
        path: '/user/tasks',
        icon: LuClipboardList
    },
    {
        id: '04',
        label: 'Create Task',
        path: '/user/create-task',
        icon: LuSquarePlus
    },
    {
        id: '05',
        label: 'Team Members',
        path: '/user/members',
        icon: LuUsers
    },
    {
        id: '06',
        label: 'Logout',
        path: '/logout',
        icon: LuLogOut
    }
]

export const PRIORITY_DATA = [
    {label: 'Low', value: 'Low'},
    {label: 'Medium', value: 'Medium'},
    {label: 'High', value: 'High'},
]

export const STATUS_DATA = [
    {label: 'Pendding', value: 'Pending'},
    {label: 'In Progress', value: 'In Progress'},
    {label: 'Completed', value: 'Completed'},
]