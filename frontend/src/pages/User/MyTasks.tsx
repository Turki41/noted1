import { useEffect, useState } from 'react'
import DashboadLayout from '../../components/layout/DashboadLayout'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { LuFileSpreadsheet } from 'react-icons/lu'
import TaskStatusTabs from '../../components/TaskStatusTabs'
import TaskCard from '../../components/cards/TaskCard'
import toast from 'react-hot-toast'


interface StatusArray {
    label: string,
    count: number
}
const MyTasks = () => {
    const [allTasks, setAllTasks] = useState([])
    const [tabs, setTabs] = useState<StatusArray[] | []>([])
    const [filterStatus, setfiterStatus] = useState('All')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const getAllTasks = async (filterStatus: string) => {
        try {
            setLoading(true)
            const response = await axiosInstance.get(API_PATHS.TASKS.USER_TASKS, {
                params: filterStatus === 'All' ? {} : { status: filterStatus }
            })

            setAllTasks(response.data?.tasks?.length > 0 ? response.data.tasks : [])

            const statusSummary = response.data?.statusSummary || {}

            const statusArray = [
                { label: 'All', count: statusSummary.all || 0 },
                { label: 'Pending', count: statusSummary.pendingTasks || 0 },
                { label: 'In Progress', count: statusSummary.inProgressTasks || 0 },
                { label: 'Completed', count: statusSummary.CompletedTasks || 0 }
            ]
            console.log('Status Array:', statusArray)
            setTabs(statusArray)
        } catch (error) {
            console.log('Error in getAllTasks', error)
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }

    const handleClick = (taskData: any) => {
        navigate(`/user/create-task`, { state: { taskId: taskData._id } })
    }

    const handleDownloadReport = async () => {
          try {
            const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_TASKS, {
                responseType: 'blob'
            })

            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', 'tasks_report.xlsx')
            document.body.appendChild(link)
            link.click()
            link.parentNode?.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.log('Error downloading report:', error)
            toast.error('Failed to download report. Please try again later.')
        }
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
                        <h2 className='text-xl font-medium'>My Tasks</h2>
                    </div>
                    {allTasks && (
                        <div className='flex mt-3 md:mt-0 justify-between items-center gap-3'>
                            <TaskStatusTabs
                                tabs={tabs}
                                activeTab={filterStatus}
                                setActiveTab={setfiterStatus}
                            />
                            <button className='hidden md:flex download-btn' onClick={handleDownloadReport}>
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

                {(loading) && (
                    <p className='text-center text-gray-500 mt-10'>Loading...</p>
                )}
                {(allTasks.length === 0 && !loading) && (
                    <p className='text-center text-gray-500 mt-10'>No tasks found.</p>
                )}
            </div>

        </DashboadLayout>
    )
}

export default MyTasks