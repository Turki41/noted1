import { useState } from 'react'
import { HiMiniPlus, HiOutlineTrash } from 'react-icons/hi2'
import { LuPaperclip } from 'react-icons/lu'

const AddAttachmentsInput = ({ attachments, setAttachments }: any) => {
  const [option, setOption] = useState('')

  const handleAddOption = () => {
    if (option.trim()) {
      setAttachments([...attachments, option.trim()])
      setOption('')
    }
  }

  const handleDeleteOption = (index: number) => {
    const updatedArr = attachments.filter((_: string, idx: number) => index !== idx)
    setAttachments(updatedArr)
  }
  return (
    <div className='mb-3'>

      <div className='flex items-center gap-5 mt-2'>
        <div className='flex-1 flex items-center gap-3 border border-gray-100 rounded-md px-3'>
          <LuPaperclip className='text-gray-400' />

          <input type="text" placeholder='Add File Link' value={option} onChange={(e) => setOption(e.target.value)} className='w-full text-sm text-black outline-none py-2 bg-white' />
        </div>

        <button onClick={handleAddOption} className='card-btn'>
          <HiMiniPlus className='text-lg' />Add
        </button>
      </div>

      {attachments.map((item: string, index: number) => (
        <div key={index} className='flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2'>
          <div className='flex-1 flex items-center gap-3'>
            <LuPaperclip className='text-gray-400' />
            <p className='text-sm text-black'>{item}</p>
          </div>

          <button onClick={() => handleDeleteOption(index)}>
            <HiOutlineTrash className='text-lg text-red-500' />
          </button>
        </div>
      ))}
    </div>
  )
}

export default AddAttachmentsInput