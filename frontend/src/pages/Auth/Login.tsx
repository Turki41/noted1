import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6"
import { validateLogin } from "../../utils/helper"
import axiosInstance from "../../utils/axiosInstance"
import { API_PATHS } from "../../utils/apiPaths"
import toast from "react-hot-toast"
import { UserContext } from "../../context/userContext"


const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const userContext = useContext(UserContext)
  if (!userContext) return null
  const { updateUser } = userContext

  const navigate = useNavigate()

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const isValid = validateLogin({ email, password, setError })
    if (!isValid) return

    //API Request
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password
      })

      const { token } = response.data

      if (token) {
        localStorage.setItem('token', token)
        updateUser(response.data)
      }

      toast.success('Logged in successfully')
      navigate('/user/dashboard')
    } catch (error) {
      if (error instanceof Error) {
        toast.error('Invalid credentails')
      }
    }
  }


  return (
    <div className='w-screen h-screen flex items-center justify-center'>
      <div className="flex flex-col items-center">

        <div className="my-3 text-center">
          <h1 className="text-2xl font-semibold">Log in to One Mind</h1>
          <p className="text-sm text-slate-600">Welcome Back! Please enter your details</p>
        </div>
        <form onSubmit={handleLogin}>

          <div className="relative my-3">
            <input value={email} placeholder="Email address" type="text" onChange={(e) => setEmail(e.target.value)} className="w-full border-r outline-none text-slate-600 border-l px-3 border-t py-3 border-slate-200 rounded-t-lg" />
            <input value={password} placeholder="Password" type={showPassword ? 'text' : 'password'} onChange={(e) => setPassword(e.target.value)} className="w-full border text-slate-600 outline-none px-3 py-3 border-slate-200 rounded-b-lg" />
            <button type="button" onClick={toggleShowPassword} className="absolute outline-none right-3 bottom-3.5 text-slate-400">{showPassword ? <FaRegEyeSlash size={22} /> : <FaRegEye size={22} />}</button>
          </div>
          {error && <p className="text-red-500 text-sm my-2">{error}</p>}
          <button type="submit" className="btn-primary">Login</button>
        </form>

        <div className="flex justify-end w-full">
          <p className="mt-3 text-[13px] text-gray-500">
            Don't have an account?{" "}
            <Link className="hover:text-blue-500 underline" to={"/signup"}>
              Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login