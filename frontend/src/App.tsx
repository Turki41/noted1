import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Login from "./pages/Auth/Login"
import SignUp from "./pages/Auth/SignUp"
import PrivateRoute from "./routes/PrivateRoute"
import MyTasks from "./pages/User/MyTasks"
import { Toaster } from "react-hot-toast"
import UserProvider from "./context/UserProvider"
import Dashboard from "./pages/User/Dashboard"
import CreateTask from "./pages/User/CreateTask"
import ManageTasks from "./pages/User/ManageTasks"
import Members from "./pages/User/Members"
import PublicRoute from "./routes/PublicRoute"



function App() {

  return (
    <UserProvider>
      <div>
        <Toaster />
        <BrowserRouter>
          <Routes>

            {/* Public routes */}
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />

            <Route path="/signup" element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            } />


            {/* Protected user routes */}
            <Route
              path="/user/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
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
              path="/user/manage-tasks"
              element={
                <PrivateRoute>
                  <ManageTasks />
                </PrivateRoute>
              }
            />
            <Route
              path="/user/create-task"
              element={
                <PrivateRoute>
                  <CreateTask />
                </PrivateRoute>
              }
            />
            <Route
              path="/user/members"
              element={
                <PrivateRoute>
                  <Members />
                </PrivateRoute>
              }
            />

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/user/dashboard" />} />
          </Routes>
        </BrowserRouter>
      </div>
    </UserProvider>
  )
}

export default App

const Root = () => {
  return <h1>Root</h1>
}