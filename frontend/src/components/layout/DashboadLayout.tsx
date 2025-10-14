import Navbar from "../Navbar"
import SideMenu from "../SideMenu"

interface DashboadLayoutProps {
  children: React.ReactNode
}

const DashboadLayout = ({ children }: DashboadLayoutProps) => {
  return (
    <div>
      <Navbar />

      <div className="flex gap-2">
        <div className="hidden lg:block">
          <SideMenu />
        </div>
        <div className="w-full px-4">
          {children}
        </div>
      </div>

    </div>
  )
}

export default DashboadLayout