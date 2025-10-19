import { useEffect, useRef, useState } from 'react'
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import { LuUser } from 'react-icons/lu';
import Modal from './Modal';
import AvatarGroup from './AvatarGroup';

const SelectUsers = ({ selectedUsers, setSelectedUsers }: any) => {
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempSelectedUsers, setTempSelectedUsers] = useState<any[]>(selectedUsers || []);

    const getAllUsers = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS)
            if (response.data?.length) {
                setAllUsers(response.data)
            }
        } catch (error) {
            console.log('Error in SelectUsers/ getUsers', error)
        }
    }

    const toggleUserSelection = (userId: any) => {
        setTempSelectedUsers((prev) => prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId])
    }

    const handleAssign = () => {
        setSelectedUsers(tempSelectedUsers)
        setIsModalOpen(false)
    }

    const selectedUsersAvatars = allUsers
        .filter((user) => selectedUsers.includes(user._id))
        .map((user) => user.profileImageUrl)

    useEffect(() => {
        getAllUsers()
    }, [])

    useEffect(() => {
        if (selectedUsers.length === 0) {
            setTempSelectedUsers([])
        }

        return () => { }
    }, [])
    return (
        <div className='space-y-2 mt-2'>
            {selectedUsersAvatars.length === 0 && (
                <button className='card-btn' onClick={() => setIsModalOpen(true)}>
                    <LuUser className='text-sm' /> Add Members
                </button>
            )}

            {selectedUsersAvatars.length !== 0 && (
                <button onClick={() => setIsModalOpen(true)}>
                    <AvatarGroup avatars={selectedUsersAvatars} maxVisible={3}/>
                </button>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title='Select Users'>
                <div className='space-y-4 h-[60vh] overflow-y-auto cursor-pointer'>
                    {allUsers.map((user) => (
                        <div key={user._id} className='flex items-center gap-4 border-b p-3 border-gray-200' onClick={() => toggleUserSelection(user._id)}>
                            {user.profileImageUrl ? <img src={user.profileImageUrl} alt="avatar" className='w-9 h-9 rounded-full object-cover'/> : <LuUser size={34} />}
                            <div className='flex-1'>
                                <p className='font-medium text-gray-800'>{user.name}</p>
                                <p className='text-[13px] text-gray-500'>{user.email}</p>
                            </div>

                            <input type="checkbox" checked={tempSelectedUsers.includes(user._id)} onChange={() => toggleUserSelection(user._id)} className='w-4 h-4 text-blue-500 bg-gray-100 border-gray-300 rounded-sm outline-none' />
                        </div>
                    ))}
                </div>

                    <div className='flex justify-end gap-4 pt-4'>
                        <button className='card-btn' onClick={() => setIsModalOpen(false)}>Cancel</button>
                        <button className='card-btn-fill' onClick={handleAssign}>Done</button>
                    </div>
            </Modal>
        </div>
    )
}

export default SelectUsers