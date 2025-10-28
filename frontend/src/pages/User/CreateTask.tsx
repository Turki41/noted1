import { useLocation, useNavigate } from "react-router-dom"
import DashboadLayout from "../../components/layout/DashboadLayout"
import { useEffect, useState } from "react"
import { LuTrash2 } from "react-icons/lu"
import { PRIORITY_DATA } from "../../utils/data"
import SelectDropdown from "../../components/inputs/SelectDropdown"
import SelectUsers from "../../components/inputs/SelectUsers"
import AddAttachmentsInput from "../../components/inputs/AddAttachmentsInput"
import axiosInstance from "../../utils/axiosInstance"
import { API_PATHS } from "../../utils/apiPaths"
import toast from "react-hot-toast"
import moment from "moment"
import Modal from "../../components/Modal"
import TodoListInput from "../../components/inputs/TodoListInput"

interface TodoItem {
    text: string
    completed: boolean
}

const CreateTask = () => {
    const location = useLocation()
    const { taskId } = location.state || {}
    const navigate = useNavigate()

    const [taskData, setTaskData] = useState({
        _id: '',
        title: '',
        description: '',
        dueDate: '' as string,
        priority: 'Low',
        assignedTo: [] as string[],
        todoChecklist: [] as TodoItem[],
        attachments: [] as string[]
    })

    const [currentTask, setCurrentTask] = useState<any>(null)
    const [error, setError] = useState<null | string>(null)
    const [loading, setLoading] = useState(false)
    const [openDeleteAlert, setOpenDeleteAlert] = useState(false)

    const handleValueChange = (key: string, value: any) => {
        setTaskData(prev => ({ ...prev, [key]: value }))
    }

    const clearData = () => {
        setTaskData({
            _id: '',
            title: '',
            description: '',
            dueDate: '',
            priority: 'Low',
            assignedTo: [],
            todoChecklist: [],
            attachments: []
        })
    }

    // Create new task
    const createTask = async () => {
        setLoading(true)
        try {
            const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
                ...taskData,
                dueDate: new Date(taskData.dueDate).toISOString()
            })
            clearData()
            toast.success('Task created successfully')
        } catch (error) {
            console.log('Error in create task', error)
            toast.error('Failed to create task')
        } finally {
            setLoading(false)
        }
    }

    // Update task
    const updateTask = async () => {
        setLoading(true)
        try {
            const response = await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId), {
                ...taskData,
                dueDate: new Date(taskData.dueDate).toISOString()
            })
            toast.success('Task updated successfully')
            navigate('/user/manage-tasks')
        } catch (error) {
            console.log('Error in update Task', error)
            toast.error('Failed to update task')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async () => {
        setError(null)

        if (!taskData.title.trim() || !taskData.description.trim()) {
            setError('Please fill all fields')
            return
        }
        if (!taskData.dueDate) {
            setError('Please choose due date')
            return
        }
        if (taskData.todoChecklist.length === 0) {
            setError('Please add at least one TODO task')
            return
        }
        if (taskData.assignedTo.length === 0) {
            setError('Assign at least one person')
            return
        }

        taskId ? updateTask() : createTask()
    }

    const getTaskDetailsById = async (taskId: string) => {
        try {
            const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId))
            if (response.data) {
                const taskInfo = response.data
                setCurrentTask(taskInfo)
                setTaskData({
                    _id: taskInfo._id,
                    title: taskInfo.title,
                    description: taskInfo.description,
                    dueDate: taskInfo.dueDate ? moment(taskInfo.dueDate).format('YYYY-MM-DD') : '',
                    priority: taskInfo.priority,
                    assignedTo: taskInfo.assignedTo.map((u: any) => u._id),
                    todoChecklist: taskInfo.todoChecklist || [],
                    attachments: taskInfo.attachments || []
                })
            }
        } catch (error) {
            console.log('error in getTaskDetailsById', error)
        }
    }

    const deleteTask = async () => {
        try {
            await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId))
            toast.success('Task deleted successfully')
            navigate('/user/manage-tasks')
        } catch (error) {
            console.log('Error deleting task', error)
            toast.error('Failed to delete task')
        } finally {
            setOpenDeleteAlert(false)
        }
    }

    useEffect(() => {
        if (taskId) getTaskDetailsById(taskId)
    }, [taskId])

    return (
        <DashboadLayout>
            <div className="mt-5">
                <div className="form-card">
                    <div className="flex justify-between items-center">
                        <h2>{taskId ? 'Edit Task' : 'Create New Task'}</h2>
                        {taskId && (
                            <button
                                className="flex items-center gap-1.5 text-sm font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300"
                                onClick={() => setOpenDeleteAlert(true)}
                            >
                                <LuTrash2 /> Delete
                            </button>
                        )}
                    </div>

                    <div className="mt-3">
                        <label className="text-sm font-medium text-slate-600">Task Title</label>
                        <input
                            type="text"
                            className="form-input"
                            value={taskData.title}
                            onChange={e => handleValueChange('title', e.target.value)}
                        />
                    </div>

                    <div className="mt-3">
                        <label className="text-sm font-medium text-slate-600">Description</label>
                        <textarea
                            className="form-input resize-none"
                            rows={4}
                            value={taskData.description}
                            onChange={e => handleValueChange('description', e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-12 gap-4 mt-2 w-full">
                        <div className="col-span-6 md:col-span-4">
                            <label className="text-sm font-medium text-slate-600">Priority</label>
                            <SelectDropdown
                                options={PRIORITY_DATA}
                                value={taskData.priority}
                                onChange={value => handleValueChange('priority', value)}
                            />
                        </div>

                        <div className="col-span-6 md:col-span-4">
                            <label className="text-sm font-medium text-slate-600">Due Date</label>
                            <input
                                type="date"
                                className="form-input"
                                value={taskData.dueDate}
                                onChange={e => handleValueChange('dueDate', e.target.value)}
                            />
                        </div>

                        <div className="col-span-12 md:col-span-3">
                            <label className="text-sm font-medium text-slate-600">Assign To</label>
                            <SelectUsers
                                selectedUsers={taskData.assignedTo}
                                setSelectedUsers={users => handleValueChange('assignedTo', users)}
                            />
                        </div>
                    </div>

                    <div className="mt-3">
                        <label className="text-sm font-medium text-slate-600">TODO Checklist</label>
                        <TodoListInput
                            taskId={taskId}
                            todoList={taskData.todoChecklist}
                            setTodoList={list => handleValueChange('todoChecklist', list)}
                        />
                    </div>

                    <div className="mt-3">
                        <label className="text-sm font-medium text-slate-600">Attachments</label>
                        <AddAttachmentsInput
                            attachments={taskData.attachments}
                            setAttachments={list => handleValueChange('attachments', list)}
                        />
                    </div>

                    {error && <p className="text-sm text-red-500 mt-5 font-medium">{error}</p>}

                    <div className="flex justify-end mt-4">
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="add-btn"
                        >
                            {taskId ? 'Update Task' : 'Create Task'}
                        </button>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={openDeleteAlert}
                onClose={() => setOpenDeleteAlert(false)}
                title="Delete Task"
            >
                <div>
                    <p>Are you sure you want to delete this Task?</p>
                    <div className="flex justify-end mt-6">
                        <button
                            onClick={deleteTask}
                            className="flex items-center font-semibold justify-center gap-1.5 text-sm text-rose-500 whitespace-nowrap bg-rose-50 border border-rose-100 rounded-lg px-4 py-2"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </DashboadLayout>
    )
}

export default CreateTask
