import { useContext, useEffect, useState } from "react"
import DashboadLayout from "../../components/layout/DashboadLayout"
import { UserContext } from "../../context/userContext"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../../utils/axiosInstance"
import { API_PATHS } from "../../utils/apiPaths"

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  /* useUserAuth() */
  const userContext = useContext(UserContext)
  if (!userContext) return null
  const { user } = userContext

  const navigate = useNavigate()

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_DASHBOARD_DATA)
      if (response.data) {
        setDashboardData(response.data)
      }
    } catch (error) {
      console.log('Error in getDashboardData',error)
    }
  }

  useEffect(() => {
    getDashboardData()
  }, [])
  
  return (
    <DashboadLayout>
        <div>User Dashboard</div>
    </DashboadLayout>
  )
}

export default Dashboard