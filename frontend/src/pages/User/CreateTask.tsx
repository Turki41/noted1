import { useLocation, useNavigate } from "react-router-dom"
import DashboadLayout from "../../components/layout/DashboadLayout"
import { useEffect, useState } from "react"
import { LuTrash2 } from "react-icons/lu"
import { PRIORITY_DATA } from "../../utils/data"
import SelectDropdown from "../../components/inputs/SelectDropdown"
import TodoListInput from "../../components/inputs/TodoListInput"
import SelectUsers from "../../components/inputs/SelectUsers"
import AddAttachmentsInput from "../../components/inputs/AddAttachmentsInput"
import axiosInstance from "../../utils/axiosInstance"
import { API_PATHS } from "../../utils/apiPaths"
import toast from "react-hot-toast"
import moment from "moment"
import Modal from "../../components/Modal"
import DeleteAlert from "../../components/DeleteAlert"

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

    const updateTask = async () => {
        try {
            setLoading(true)
            const todoList = taskData.todoChecklist?.map((item) => {
                const prevTodoList = currentTask?.todoChecklist || []
                const matchedTask = prevTodoList.find((task: any) => task.text == item)

                return {
                    text: item,
                    completed: matchedTask ? matchedTask.completed : false
                }
            })

            const response = await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId),
                {
                    ...taskData,
                    dueDate: new Date(taskData.dueDate).toISOString(),
                    todoChecklist: todoList,

                })

            navigate('/user/manage-tasks')
            toast.success('Task updated successfully')
        } catch (error) {
            console.log('Error in update Task', error)
            setLoading(false)
        } finally {
            setLoading(false)
        }

    }

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

    const getTaskDetailsById = async (taskId: string) => {
        try {
            const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId))

            if (response.data) {
                const taskInfo = response.data
                setCurrentTask(taskInfo)

                setTaskData((prev) => ({
                    ...prev,
                    title: taskInfo.title,
                    description: taskInfo.description,
                    dueDate: taskInfo.dueDate ? moment(taskInfo.dueDate).format('YYYY-MM-DD') : '',
                    priority: taskInfo.priority,
                    assignedTo: taskInfo?.assignedTo?.map((item: any) => item?._id),
                    todoChecklist: taskInfo?.todoChecklist?.map((item: any) => item?.text) || [],
                    attachments: taskInfo?.attachments || []
                }))
            }
        } catch (error) {
            console.log('error in getTaskDetailsById', error)
        }
    }

    const deleteTask = async () => {
        try {
            await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId))

            setOpenDeleteAlert(false)
            toast.success('Task Deleted successfully')
            navigate('/user/manage-tasks')
        } catch (error) {
            console.log('Error deleting task', error)
        }

    }


    useEffect(() => {
        if (taskId) {
            getTaskDetailsById(taskId)
        }

        return () => { }
    }, [taskId])
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

            <Modal
                isOpen={openDeleteAlert}
                onClose={() => setOpenDeleteAlert(false)}
                title="Delete Task"
            >
                <div>
                    <p>Are you sure you want to delete this Task?</p>

                    <div className="flex justify-end mt-6">
                        <button onClick={deleteTask} className="flex items-center font-semibold justify-center gap-1.5 text-sm text-rose-500 whitespace-nowrap bg-rose-50 border border-rose-100 rounded-lg px-4 py-2">
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </DashboadLayout>
    )
}

export default CreateTask