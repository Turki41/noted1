
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
    return (
        <div className="w-full">
            {tableData.map(task => (
                <div key={task._id}>
                    <div>Title: {task.title}</div>
                    <div>Status: {task.status}</div>
                    <div>Due Date: {task.dueDate?.toString().split('T')[0]}</div>
                    <div>Priority: {task.priority}</div>
                    <hr />
                </div>
            ))}


        </div>
    )
}

export default TaskListTable