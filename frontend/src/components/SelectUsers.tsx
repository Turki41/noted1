import { useEffect, useState } from 'react'
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import { LuUser } from 'react-icons/lu';
import Modal from './Modal';

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

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title='Select Users'>
                <div className='space-y-4 h-[60vh] overflow-y-auto'>
                    {allUsers.map((user) => (
                        <div key={user._id}>
                               <img src={user.profileImageUrl} alt="avatar" /> 
                               <div>
                                <p>{user.name}</p>
                                <p>{user.email}</p>
                               </div>
                        </div>
                    ))}
                </div>
            </Modal>
        </div>
    )
}

export default SelectUsers