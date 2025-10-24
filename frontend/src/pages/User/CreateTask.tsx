import { useLocation, useNavigate } from "react-router-dom"
import DashboadLayout from "../../components/layout/DashboadLayout"
import { useState } from "react"
import { LuTrash2 } from "react-icons/lu"
import { PRIORITY_DATA } from "../../utils/data"
import SelectDropdown from "../../components/inputs/SelectDropdown"
import TodoListInput from "../../components/inputs/TodoListInput"
import SelectUsers from "../../components/inputs/SelectUsers"
import AddAttachmentsInput from "../../components/inputs/AddAttachmentsInput"
import axiosInstance from "../../utils/axiosInstance"
import { API_PATHS } from "../../utils/apiPaths"
import toast from "react-hot-toast"

const CreateTask = () => {
    const location = useLocation()
    const { taskId } = location.state || {}
    const navigate = useNavigate()

    const [taskData, setTaskData] = useState({
        title: '',
        description: '',
        dueDate: '' as Date | string,
        priority: 'Low',
        assignedTo: [],
        todoChecklist: [],
        attachments: []
    })

    const [currentTask, setCurrentTask] = useState<any>(null)

    const [error, setError] = useState<null | string>('')
    const [loading, setLoading] = useState(false)

    const [openDeleteAlert, setOpenDeleteAlert] = useState(false)

    const handleValueChange = (key: string, value: any) => {
        setTaskData((prev) => ({ ...prev, [key]: value }))
    }

    const clearData = () => {
        setTaskData({
            title: '',
            description: '',
            dueDate: '',
            priority: 'Low',
            assignedTo: [],
            todoChecklist: [],
            attachments: []
        })
    }

    const createTask = async () => {
        setLoading(true)

        try {
            const todoList = taskData.todoChecklist?.map((item) => ({
                text: item,
                completed: false
            }))

            const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
                ...taskData,
                dueDate: new Date(taskData.dueDate).toISOString(),
                todoChecklist: todoList
            })
            clearData()
            toast.success('Task created succefully')
        } catch (error) {
            console.log('Error in create task', error)
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }

    const updateTask = async () => { }

    const handleSubmit = async () => {
        setError(null)

        if (!taskData.title.trim() || !taskData.description.trim()) {
            setError('Please fill all fields')
            return
        } else if (!taskData.dueDate || taskData.dueDate === '') {
            setError('Please choose due date')
            return
        } else if (taskData.todoChecklist?.length === 0) {
            setError('Please Add at least one TODO task')
            return
        } else if (taskData.assignedTo?.length === 0) {
            setError('Assign at least one person')
            return
        } else {
            setError(null)
        }

        if (taskId) {
            updateTask()
            return
        }

        createTask()
    }

    const getTaskDetailsById = async () => { }

    const deleteTask = async () => { }

    return (
        <DashboadLayout>
            <div className="mt-5">
                <div className="mt-4">
                    <div className="form-card">
                        <div className="flex items-center justify-between">
                            <h2>
                                {taskId ? 'Edit Task' : 'Create New Task'}
                            </h2>

                            {taskId && (
                                <button
                                    className="flex items-center gap-1.5 text-sm font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300"
                                    onClick={() => setOpenDeleteAlert(true)}>
                                    <LuTrash2 /> Delete
                                </button>
                            )}
                        </div>

                        <div>
                            <label htmlFor="title" className="text-sm font-medium text-slate-600">
                                Task Title
                            </label>

                            <input className="form-input" id="title" type="text" value={taskData.title} onChange={e => { handleValueChange('title', e.target.value) }} />
                        </div>

                        <div className="mt-3">
                            <label htmlFor="description" className="text-sm font-medium text-slate-600">
                                Description
                            </label>

                            <textarea
                                id="description"
                                className="form-input resize-none"
                                rows={4}
                                value={taskData.description}
                                onChange={e => handleValueChange('description', e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-12 gap-4 mt-2 w-full">
                            <div className="col-span-6 md:col-span-4">
                                <label className="text-sm font-medium text-slate-600">
                                    Priority
                                </label>

                                <SelectDropdown
                                    options={PRIORITY_DATA}
                                    value={taskData.priority}
                                    onChange={(value: any) => handleValueChange('priority', value)}
                                    placeholder="Select Priority"
                                />
                            </div>

                            <div className="col-span-6 md:col-span-4">
                                <label className="text-sm font-medium text-slate-600" htmlFor="dueDate">Due Date</label>

                                <input id="dueDate"
                                    type="date"
                                    className="form-input"
                                    onChange={e => handleValueChange('dueDate', e.target.value)} />
                            </div>

                            <div className="col-span-12 md:col-span-3">
                                <label className="text-sm font-medium text-slate-600" htmlFor="selectUser">Assign To</label>

                                <SelectUsers
                                    selectedUsers={taskData.assignedTo}
                                    setSelectedUsers={(users: any) => handleValueChange('assignedTo', users)}
                                />
                            </div>
                        </div>

                        <div className="mt-3">
                            <label className="text-sm font-medium text-slate-600" htmlFor="checklist">
                                TODO Checklist
                            </label>

                            <TodoListInput todoList={taskData?.todoChecklist} setTodoList={(value: string) => handleValueChange('todoChecklist', value)} />
                        </div>

                        <div className="mt-3">
                            <label className="text-sm font-medium text-slate-600" htmlFor="attachments">
                                Add Attachments
                            </label>

                            <AddAttachmentsInput attachments={taskData?.attachments} setAttachments={(value: string) => handleValueChange('attachments', value)} />
                        </div>

                        {error && (
                            <p className="text-sm text-red-500 mt-5 font-medium">{error}</p>
                        )}

                        <div className="flex justify-end">
                            <button onClick={handleSubmit} disabled={loading} className="add-btn">
                                {taskId ? 'Update Task' : 'Create Task'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboadLayout>
    )
}

export default CreateTask