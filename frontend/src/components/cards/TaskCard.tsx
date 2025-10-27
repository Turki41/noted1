import moment from 'moment'

import { LuPaperclip } from 'react-icons/lu'
import AvatarGroup from '../AvatarGroup'

const TaskCard = ({ title, description, priority, status, progress, createdAt, dueDate, assignedTo, attachmentCount, completedTodoCount, todoChecklist }: any) => {
    const getStatusTagColor = () => {
        switch (status) {
            case 'In Progress':
                return 'text-cyan-500 bg-cyan-50 border border-cyan-500/10'

            case 'Completed':
                return 'text-lime-500 bg-lime-50 border border-lime-500/20'

            default:
                return 'text-violet-500 bg-violet-50 border border-violet-500/10'
        }
    }

    const getPriorityTagColor = () => {
        switch (priority) {
            case 'Low':
                return 'text-emerald-500 bg-emerald-50 border border-emerald-500/10'

            case 'Medium':
                return 'text-amber-500 bg-amber-50 border border-amber-500/10'

            default:
                return 'text-rose-500 bg-rose-50 border border-rose-500/10'
        }
    }

    const Progress = () => {
        return (
            <div className='w-full bg-gray-200 rounded-full h-1.5'>
                <div className={`${getStatusTagColor()} h-1.5 rounded-full text-center text-sm font-medium`} style={{ width: `${progress}%` }}>
                </div>
            </div>
        )
    }
    return (
        <div /* onClick={onClick} */ className='bg-white rounded-xl py-4 shadow-md shadow-gray-100 border border-gray-200/50 cursor-pointer'>
            <div className='flex items-center gap-3 px-4'>
                <div className={`text-sm font-medium ${getStatusTagColor()} px-4 py-0.5 rounded`}>
                    {status}
                </div>
                <div className={`text-sm font-medium ${getPriorityTagColor()} px-4 py-0.5 rounded`}>
                    {priority} Priority
                </div>
            </div>

            <div className={`px-4 mt-4 border-l-[3px] ${status === 'In Progress'
                ? 'border-cyan-500'
                : status === 'Completed'
                    ? 'border-indigo-500'
                    : 'border-violet-500'
                }`}>
                <p className='text-sm font-medium'>
                    {title}
                </p>

                <p className='text-sm text-gray-500 mt-1.5 line-clamp-2 leading-[18px]'>
                    {description}
                </p>

                <p className='text-sm text-gray-700/80 font-medium my-2 leading-[18px]'>
                    Tasks Done {' '}
                    <span className='font-semibold text-gray-700'>
                        {completedTodoCount} / {todoChecklist.length || 0}
                    </span>
                </p>

                <Progress />
            </div>

            <div className='px-4'>
                <div className='flex items-center justify-between my-1'>
                    <div>
                        <label className='text-sm text-gray-500'>Start Date</label>
                        <p className='text-sm font-medium text-gray-900'>{moment(createdAt).format('Do MMM YYYY')}</p>
                    </div>

                    <div>
                        <label className='text-sm text-gray-500'>Due Date</label>
                        <p className='text-sm font-medium text-gray-900'>{moment(dueDate).format('Do MMM YYYY')}</p>
                    </div>
                </div>

                <div className='flex items-center justify-between mt-3'>
                    <AvatarGroup avatars={assignedTo || []} maxVisible={5} />

                    {attachmentCount > 0 && (
                        <div className='flex items-center gap-2 bg-blue-50 px-2.5 py-1.5 rounded-lg'>
                            <LuPaperclip className='text-blue-500'/> {' '}
                            <span className='text-sm text-gray-900'>{attachmentCount}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TaskCard

