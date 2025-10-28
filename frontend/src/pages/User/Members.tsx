import { useEffect, useState } from "react"
import DashboadLayout from "../../components/layout/DashboadLayout"
import axiosInstance from "../../utils/axiosInstance"
import { API_PATHS } from "../../utils/apiPaths"
import { LuFileSpreadsheet } from "react-icons/lu"
import UserCard from "../../components/cards/UserCard"
import toast from "react-hot-toast"


const Members = () => {
    const [allUsers, setAllUsers] = useState<any>([])

    const getAllUsers = async () => {
        try {

            const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS)
            if (response.data?.length > 0) {
                setAllUsers(response.data)
                console.log('All users:', response.data)
            }

        } catch (error) {
            console.log('Error fetching users:', error);
        }
    }

    const handleDownLoadReport = async () => { 
        try {
            const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_USERS, {
                responseType: 'blob'
            })

            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', 'users_report.xlsx')
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
        getAllUsers()
    }, [])
    return (
        <DashboadLayout>
            <div className="mt-5 mb-10">
                <div className="flex flex-row items-center justify-between">
                    <h2 className="text-xl font-medium">Team Members</h2>

                    <button onClick={handleDownLoadReport} className="flex download-btn">
                        Download Report
                        <LuFileSpreadsheet className="text-lg"/>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    {allUsers.map((user:any) => (
                        <UserCard key={user.id} userInfo={user} />
                    ))}
                </div>
            </div>
        </DashboadLayout>
    )
}

export default Members