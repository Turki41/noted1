import { useState } from "react"
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2"
import axiosInstance from "../../utils/axiosInstance"
import { API_PATHS } from "../../utils/apiPaths"
import toast from "react-hot-toast"

const TodoListInput = ({ taskId, todoList, setTodoList }: any) => {
    const [option, setOption] = useState('')

    const handleAddOption = () => {
        if (option.trim()) {
            const newTodo = { text: option.trim(), completed: false }
            const updatedList = [...todoList, newTodo]
            setTodoList(updatedList)
            setOption('')

            if (taskId) updateChecklistOnServer(updatedList)
        }
    }

    const handleDeleteOption = (index: number) => {
        const updatedArr = todoList.filter((_: any, idx: number) => index !== idx)
        setTodoList(updatedArr)

        if (taskId) updateChecklistOnServer(updatedArr)
    }

    const handleCheckboxChange = (index: number) => {
        const updatedArr = todoList.map((item: any, idx: number) =>
            idx === index ? { ...item, completed: !item.completed } : item
        )
        setTodoList(updatedArr)

        if (taskId) updateChecklistOnServer(updatedArr)
    }

    const updateChecklistOnServer = async (updatedChecklist: any) => {
        try {
            await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK_STATUS(taskId), {
                todoChecklist: updatedChecklist
            })
        } catch (error) {
            console.log("Error updating task checklist:", error)
            toast.error("Failed to update checklist")
        }
    }

    return (
        <div>
            <div className="flex items-center gap-5 mt-2">
                <input
                    type="text"
                    placeholder="Enter Task"
                    value={option}
                    onChange={e => setOption(e.target.value)}
                    className="w-full text-sm outline-none bg-white border border-gray-100 px-3 py-2 rounded-md"
                />

                <button onClick={handleAddOption} className="card-btn text-nowrap">
                    <HiMiniPlus className="text-lg" /> Add
                </button>
            </div>

            {todoList.map((item: any, index: number) => (
                <div key={index} className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={() => handleCheckboxChange(index)}
                            className="cursor-pointer accent-green-500"
                        />
                        <p className="text-sm text-black">{item.text}</p>
                    </div>
                    <button onClick={() => handleDeleteOption(index)}>
                        <HiOutlineTrash className="text-lg text-red-500" />
                    </button>
                </div>
            ))}
        </div>
    )
}

export default TodoListInput
