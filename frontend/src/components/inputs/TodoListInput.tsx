import { useState } from "react"
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2"


const TodoListInput = ({ todoList, setTodoList }: any) => {
    const [option, setOption] = useState('')

    const handleAddOption = () => {
        if (option.trim()) {
            setTodoList([...todoList, option.trim()])
            console.log(todoList)
            setOption('')
        }
    }

    const handleDeleteOption = (index: number) => {
        const updatedArr = todoList.filter((_: string, idx: number) => index !== idx)
        setTodoList(updatedArr)
    }
    return (
        <div>

            <div className="flex items-center gap-5 mt-2">
                <input type="text" placeholder="Enter Task" value={option} onChange={e => setOption(e.target.value)} className="w-full text-sm outline-none bg-white border border-gray-100 px-3 py-2 rounded-md" />

                <button onClick={handleAddOption} className="card-btn text-nowrap">
                    <HiMiniPlus className="text-lg" />Add
                </button>
            </div>
            
            {todoList.map((item: string, index: number) => (
                <div key={index} className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2">
                    <p className="text-sm text-black">
                        <span className="text-sm text-gray-400 font-semibold mr-2">
                            {index < 9 ? `0${index + 1}` : index + 1}
                        </span>
                        {item}
                    </p>

                    <button onClick={() => handleDeleteOption(index)}>
                        <HiOutlineTrash className="text-lg text-red-500" />
                    </button>
                </div>
            ))}
        </div>
    )
}

export default TodoListInput