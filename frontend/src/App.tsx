import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Login from "./pages/Auth/Login"
import SignUp from "./pages/Auth/SignUp"
import PrivateRoute from "./routes/PrivateRoute"
import UserDashboard from './pages/User/Dashboard'
import MyTasks from "./pages/User/MyTasks"
import ViewTaskDetails from "./pages/User/ViewTaskDetails"
import { Toaster } from "react-hot-toast"
import UserProvider from "./context/UserProvider"



function App() {

  return (
    <UserProvider>
      <div>
        <Toaster />
        <BrowserRouter>
          <Routes>

            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            <Route path="/" element={
              <PrivateRoute>
                <Root />
              </PrivateRoute>
            } />

            {/* Protected user routes */}
            <Route
              path="/user/dashboard"
              element={
                <PrivateRoute>
                  <UserDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/user/tasks"
              element={
                <PrivateRoute>
                  <MyTasks />
                </PrivateRoute>
              }
            />
            <Route
              path="/user/task-details/:id"
              element={
                <PrivateRoute>
                  <ViewTaskDetails />
                </PrivateRoute>
              }
            />

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </div>
    </UserProvider>
  )
}

export default App

const Root = () => {
  return <h1>fefef</h1>
}