import { useContext } from "react"
import { UserContext } from "../context/userContext"
import { useLocation, useNavigate } from "react-router-dom"
import { SIDE_MENU_DATA } from "../utils/data"
import { LuUser } from "react-icons/lu"

const SideMenu = () => {
    const userContext = useContext(UserContext)
    if (!userContext) return null
    const { user, clearUser } = userContext

    const navigate = useNavigate()
    const location = useLocation()

    const handleClick = (path: string) => {
        if (path === '/logout') {
            handleLogout()
            return
        }
        navigate(path)
    }

    const handleLogout = () => {
        localStorage.clear()
        clearUser()
        navigate('/login')
    }


    return (
        <div className="w-64 h-[calc(100vh-61px)] border-r border-gray-200/50 bg-white sticky top-[61px] z-20">
            <div className="flex flex-col items-center justify-center mb-7 pt-5">
                <div className="relative">
                    {user?.profileImageUrl ? (
                        <img src={user?.profileImageUrl} alt="Profile image" className="w-20 h-20 bg-slate-400/10 rounded-full" />
                    ) : (
                        <LuUser className="text-4xl text-blue-500 w-20 h-20 bg-slate-400/10 rounded-full" />
                    )}

                </div>
                <h5 className="text-lg font-semibold mt-2">{user?.name || ''}</h5>

            </div>
            {
                SIDE_MENU_DATA.map((item, index) => {
                    const activeMenu = location.pathname === item.path
                    return (
                        <button
                            onClick={() => handleClick(item.path)}
                            key={index}
                            className={`w-full py-3 px-6 flex items-center gap-4 hover:bg-gradient-to-r transition-colors duration-200 from-blue-50/40 to-blue-100/50 text-[15px] font-medium ${activeMenu ? 'text-blue-500 bg-gradient-to-r from-blue-50/40 to-blue-100/50 border-r-3' : ''}`}>
                            <item.icon className="text-xl"/>
                            {item.label}
                                {activeMenu && <div className="bg-blue-500 h-[46.5px] w-[3px] absolute right-0"/>}
                        </button>
                    )
                })
            }
        </div>

    )
}

export default SideMenu