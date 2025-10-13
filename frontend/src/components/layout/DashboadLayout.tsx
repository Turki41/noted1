import Navbar from "../Navbar"
import SideMenu from "../SideMenu"

interface DashboadLayoutProps {
    children: React.ReactNode
}

const DashboadLayout = ({children}: DashboadLayoutProps) => {
  return (
    <div>
        <Navbar/>

        <div className="flex gap-2">
            <SideMenu/>
            {children}
        </div>

    </div>
  )
}

export default DashboadLayout