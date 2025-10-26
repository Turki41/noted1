import React, { useEffect, useState } from 'react'
import DashboadLayout from '../../components/layout/DashboadLayout'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { LuFileSpreadsheet } from 'react-icons/lu'
import TaskStatusTabs from '../../components/TaskStatusTabs'
import TaskCard from '../../components/TaskCard'

interface StatusArray {
    label: string,
    count: number
}
const ManageTasks = () => {
    const [allTasks, setAllTasks] = useState([])
    const [tabs, setTabs] = useState<StatusArray[] | []>([])
    const [filterStatus, setfiterStatus] = useState('All')

    const navigate = useNavigate()

    const getAllTasks = async (filterStatus: string) => {
        try {
            const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
                params: filterStatus === 'All' ? {} : { status: filterStatus }
            })

            setAllTasks(response.data?.tasks?.length > 0 ? response.data.tasks : [])

            const statusSummary = response.data?.statusSummary || {}

            const statusArray = [
                { label: 'All', count: statusSummary.all || 0 },
                { label: 'Pending', count: statusSummary.pendingTasks || 0 },
                { label: 'In Progress', count: statusSummary.InProgressTasks || 0 },
                { label: 'Completed', count: statusSummary.CompletedTasks || 0 }
            ]

            setTabs(statusArray)
        } catch (error) {
            console.log('Error in getAllTasks', error)
        }
    }

    const handleClick = (taskData: any) => {
        navigate(`/user/create-task`, { state: { taskId: taskData._id } })
    }

    useEffect(() => {
        getAllTasks(filterStatus)
        return () => { }
    }, [filterStatus])

    return (
        <DashboadLayout>
            <div className='my-5'>
                <div className='flex flex-col lg:flex-row lg:items-center justify-between'>
                    <div className='flex items-center justify-between gap-3'>
                        <h2 className='text-xl font-medium'>Manage Tasks</h2>
                    </div>
                    {allTasks?.length > 0 && (
                        <div className='flex mt-3 md:mt-0 justify-between items-center gap-3'>
                            <TaskStatusTabs
                                tabs={tabs}
                                activeTab={filterStatus}
                                setActiveTab={setfiterStatus}
                            />
                            <button className='hidden md:flex download-btn' /* onClick={handleDownloadReport} */>
                                <LuFileSpreadsheet className='text-lg' />
                                Download Report
                            </button>
                        </div>
                    )}
                </div>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
                    {allTasks?.map((item: any, index) => (
                        <div onClick={() => handleClick(item)}>
                            <TaskCard
                                key={index}
                                title={item.title}
                                description={item.description}
                                priority={item.priority}
                                status={item.status}
                                progress={item.progress}
                                createdAt={item.createdAt}
                                dueDate={item.dueDate}
                                assignedTo={item.assignedTo?.map((user: any) => user.profileImageUrl)}
                                attachmentCount={item.attachments?.length || 0}
                                completedTodoCount={item.completedTodoCount || 0}
                                todoChecklist={item.todoChecklist || []}
                            />
                        </div>
                    ))}
                </div>
            </div>

        </DashboadLayout>
    )
}

export default ManageTasks