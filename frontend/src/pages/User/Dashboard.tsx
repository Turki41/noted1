import { useContext, useEffect, useState } from "react"
import DashboadLayout from "../../components/layout/DashboadLayout"
import { UserContext } from "../../context/userContext"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../../utils/axiosInstance"
import { API_PATHS } from "../../utils/apiPaths"
import moment from "moment"
import { IoMdCard } from "react-icons/io"
import { addThousandSeparators } from "../../utils/helper"
import InfoCard from "../../components/InfoCard"
import { LuArrowRight } from "react-icons/lu"
import TaskListTable from "../../components/TaskListTable"


type DashboardData = {
  charts?: {
    taskDistribution?: {
      All?: number;
      Pending?: number;
      InProgress?: number;
      Completed?: number;
    };
  };
  recentTasks?: Array<{
    _id: string;
    title: string;
    status: string;
    dueDate: Date;
    priority: string;
  }>;
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  /* useUserAuth() */
  const userContext = useContext(UserContext)
  if (!userContext) return null
  const { user } = userContext

  const navigate = useNavigate()

  const onSeeMore = () => {
    navigate('/admin/tasks')
  }

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_DASHBOARD_DATA)
      if (response.data) {
        setDashboardData(response.data)
        console.log('Dashboard Data:', response.data)
      }
    } catch (error) {
      console.log('Error in getDashboardData', error)
    }
  }

  useEffect(() => {
    getDashboardData()
  }, [])

  return (
    <DashboadLayout>
      <div className="card my-5">
        <div>
          <div className="">
            <h2 className="text-xl md:text-2xl">Hi! {user?.name}</h2>
            <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">{moment().format('dddd Do MMM YYYY')}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 mt-5">
          <InfoCard
          label="Total Tasks"
          value={addThousandSeparators(dashboardData?.charts?.taskDistribution?.All || 0)}
          color='bg-blue-500/70'
          />
          <InfoCard
          label="Pending Tasks"
          value={addThousandSeparators(dashboardData?.charts?.taskDistribution?.Pending || 0)}
          color='bg-violet-500/70'
          />
          <InfoCard
          label="In Progress Tasks"
          value={addThousandSeparators(dashboardData?.charts?.taskDistribution?.InProgress || 0)}
          color='bg-cyan-500/70'
          />
          <InfoCard
          label="Completed Tasks"
          value={addThousandSeparators(dashboardData?.charts?.taskDistribution?.Completed || 0)}
          color='bg-lime-500/70'
          />
        </div>    
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 my-4 md:my-6">
        <div className="col-span-2">
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="text-lg">
                Recent Tasks
              </h5>
              <button className="card-btn" onClick={onSeeMore}>
                See All <LuArrowRight/>
              </button>
            </div>
            <TaskListTable tableData={dashboardData?.recentTasks || []}/>
          </div>
        </div>
      </div>
    </DashboadLayout>
  )
}

export default Dashboard