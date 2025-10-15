import { useContext, useEffect, useState } from "react"
import DashboadLayout from "../../components/layout/DashboadLayout"
import { UserContext } from "../../context/userContext"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../../utils/axiosInstance"
import { API_PATHS } from "../../utils/apiPaths"
import moment from "moment"
import { addThousandSeparators } from "../../utils/helper"
import InfoCard from "../../components/InfoCard"
import { LuArrowRight } from "react-icons/lu"
import TaskListTable from "../../components/TaskListTable"
import CustomPieChart from "../../components/CustomPieChart"


type DashboardData = {
  charts?: {
    taskDistribution?: {
      All?: number;
      Pending?: number;
      InProgress?: number;
      Completed?: number;
    },
    tasksPriorityLevels: {
      High?: number;
      Medium?: number;
      Low?: number;
    }
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
  const [pieChartData, setPieChartData] = useState<{ status: string; count: number }[]>([]);
  const [barChartData, setBarChartData] = useState<{ priority: string; count: number }[]>([]);

  const COLORS =['#8D51FF', '#00B8DB', '#7BCE00']
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
        prepareChartData(response.data)
        console.log('Dashboard Data:', response.data)

      }
    } catch (error) {
      console.log('Error in getDashboardData', error)
    }
  }

  const prepareChartData = (data: DashboardData) => {
    const taskDistribution = data.charts?.taskDistribution || null
    const tasksPriorityLevels = data.charts?.tasksPriorityLevels || null

    const taskDistributionData = [
      { status: 'Pending', count: taskDistribution?.Pending || 0 },
      { status: 'In Progress', count: taskDistribution?.InProgress || 0 },
      { status: 'Completed', count: taskDistribution?.Completed || 0 },
    ]

    setPieChartData(taskDistributionData)
    console.log('Pie Chart Data:', taskDistributionData)

    const priorityLevelsData = [
      { priority: 'High', count: tasksPriorityLevels?.High || 0 },
      { priority: 'Medium', count: tasksPriorityLevels?.Medium || 0 },
      { priority: 'Low', count: tasksPriorityLevels?.Low || 0 },
    ]

    setBarChartData(priorityLevelsData)
    console.log('Bar Chart Data:', priorityLevelsData)
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

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
        <div>
          <div className="card">
            <div className="flex items-center justify-between">
              <h5>
                Task Distribution
              </h5>
            </div>
            <CustomPieChart data={pieChartData} colors={COLORS}/>
          </div>
        </div>
      </div>

      <div className="w-full gap-6 my-4 md:my-6">
        <div className="">
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="text-lg">
                Recent Tasks
              </h5>
              <button className="card-btn" onClick={onSeeMore}>
                See All <LuArrowRight />
              </button>
            </div>
            <TaskListTable tableData={dashboardData?.recentTasks || []} />
          </div>
        </div>
      </div>
    </DashboadLayout>
  )
}

export default Dashboard