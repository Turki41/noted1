import { useLocation, useNavigate } from "react-router-dom"
import DashboadLayout from "../../components/layout/DashboadLayout"
import { useState } from "react"
import { LuTrash2 } from "react-icons/lu"
import { PRIORITY_DATA } from "../../utils/data"
import SelectDropdown from "../../components/SelectDropdown"
import SelectUsers from "../../components/SelectUsers"

const CreateTask = () => {
    const location = useLocation()
    const { taskId } = location.state || {}
    const navigate = useNavigate()

    const [taskData, setTaskData] = useState({
        title: '',
        description: '',
        dueDate: null as Date | null,
        priority: 'Low',
        assignedTo: [],
        todoChecklist: [],
        attachments: []
    })

    const [currentTask, setCurrentTask] = useState<any>(null)

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const [openDeleteAlert, setOpenDeleteAlert] = useState(false)

    const handleValueChange = (key: string, value: any) => {
        setTaskData((prev) => ({ ...prev, [key]: value }))
    }

    const clearData = () => {
        setTaskData({
            title: '',
            description: '',
            dueDate: null,
            priority: 'Low',
            assignedTo: [],
            todoChecklist: [],
            attachments: []
        })
    }

    const createTask = async () => {

    }

    const updateTask = async () => { }

    const handleSubmit = async () => { }

    const getTaskDetailsById = async () => { }

    const deleteTask = async () => { }

    return (
        <DashboadLayout>
            <div className="mt-5">
                <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
                    <div className="form-card col-span-3">
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

                    </div>
                </div>
            </div>
        </DashboadLayout>
    )
}

export default CreateTask