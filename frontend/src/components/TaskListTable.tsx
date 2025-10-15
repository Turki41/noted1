import moment from "moment";

interface TaskListTableProps {
    tableData: Array<{
        _id: string;
        title: string;
        status: string;
        dueDate: Date;
        priority: string;
    }>;
}

const TaskListTable = ({ tableData }: TaskListTableProps) => {
    const getStatusbadgeColor = (status: string) => {
        switch (status) {
            case 'Completed':
                return 'bg-green-100 text-green-500 border border-green-200'
            case 'Pending':
                return 'bg-purple-100 text-purple-500 border border-purple-200'
            case 'InProgress':
                return 'bg-cyan-100 text-cyan-500 border border-cyan-200'
            default:
                return 'bg-gray-100 text-gray-500 border border-gray-200'
        }
    }

    const getPriorityBadgeColor = (priority: string) => {
        switch (priority) {
            case 'High':
                return 'bg-red-100 text-red-500 border border-red-200'
            case 'Medium':
                return 'bg-orange-100 text-orange-500 border border-orange-200'
            case 'Low':
                return 'bg-green-100 text-green-500 border border-green-200'
            default:
                return 'bg-gray-100 text-gray-500 border border-gray-200'
        }
    }
    return (
        <div className="overflow-x-auto p-0 rounded-lg mt-3">
            <table className="min-w-full">
                <thead>
                    <tr className="text-left">
                        <th className="py-3 font-medium">Name</th>
                        <th className="py-3 font-medium">Status</th>
                        <th className="py-3 font-medium">Priority</th>
                        <th className="py-3 font-medium hidden md:table-cell">Due Date</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((task) => (
                        <tr key={task._id} className="border-t border-gray-200">
                            <td className="my-3 text-gray-700 line-clamp-1 overflow-hidden">{task.title}</td>
                            <td className="py-4 ">
                                <span className={`px-2 py-1 text-xs rounded inline-block font-medium ${getStatusbadgeColor(task.status)}`}>{task.status}</span>
                            </td>
                            <td className="py-4">
                                <span className={`px-2 py-1 text-xs rounded inline-block font-medium ${getPriorityBadgeColor(task.priority)}`}>{task.priority}</span>
                            </td>
                            <td className="py-4 text-gray-700 text-nowrap hidden md:table-cell">
                                <span>
                                    {task.dueDate ? moment(task.dueDate).format('DD MMM, YY') : 'N/A'}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>


            {/*      {tableData.map(task => (
                <div key={task._id}>
                    <div>Title: {task.title}</div>
                    <div>Status: {task.status}</div>
                    <div>Due Date: {task.dueDate?.toString().split('T')[0]}</div>
                    <div>Priority: {task.priority}</div>
                    <hr />
                </div>
            ))}
 */}

        </div>
    )
}

export default TaskListTable