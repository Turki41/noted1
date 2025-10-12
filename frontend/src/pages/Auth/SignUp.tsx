import { useContext, useState } from "react"
import { validateSignup } from "../../utils/helper"
import { Link, useNavigate } from "react-router-dom"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6"
import ProfilePhotoSelector from "../../components/ProfilePhotoSelector"
import toast from "react-hot-toast"
import axiosInstance from "../../utils/axiosInstance"
import { API_PATHS } from "../../utils/apiPaths"
import { UserContext } from "../../context/userContext"
import uploadImage from "../../utils/uploadImage"

const SignUp = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState<null | string>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [profilePic, setProfilePic] = useState<null | File>(null)

  const navigate = useNavigate()

  const userContext = useContext(UserContext)
  if (!userContext) return null
  const { updateUser } = userContext

  let profileImageUrl = ''

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    const isvalid = validateSignup({ email, password, confirmPassword, fullName, setError })
    if (!isvalid) return

    try {
      if(profilePic) {
        const imgUploadResponse = await uploadImage(profilePic)
        profileImageUrl = imgUploadResponse.imageUrl || ''
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        profileImageUrl,
        password
      })

      const { token } = response.data

      if (token) {
        localStorage.setItem('token', token)
        updateUser(response.data)
      }

      toast.success('Signed up successfully')
      navigate('/users/dashboard')
    } catch (error) {
      if (error instanceof Error) {
        toast.error('Something went wrong')
      }
    }

  }


const toggleShowPassword = (field: 'password' | 'confirm') => {
  switch (field) {
    case 'password':
      setShowPassword(!showPassword)
      break
    case 'confirm':
      setShowConfirmPassword(!showConfirmPassword)
      break
  }
}

return (
  <div className="w-screen h-screen flex items-center justify-center">
    <div className="w-full max-w-md flex flex-col items-center px-4">
      <div className="my-3 text-center">
        <h1 className="text-2xl font-semibold">Sign up to One Mind</h1>
        <p className="text-sm text-slate-600">
          Welcome! Please enter your details
        </p>
      </div>
      <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
      <form onSubmit={handleSignup} className="w-full">

        <div className="my-3">
          <input
            value={fullName}
            placeholder="Full Name"
            type="text"
            onChange={(e) => setFullName(e.target.value)}
            className="form-input w-full rounded-t-lg"
          />
          <input
            value={email}
            placeholder="Email address"
            type="text"
            onChange={(e) => setEmail(e.target.value)}
            className="form-input w-full"
          />
          <div className="relative">
            <input
              value={password}
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input w-full"
            />
            <button
              type="button"
              onClick={() => toggleShowPassword('password')}
              className="absolute right-3 bottom-3.5 text-slate-400"
            >
              {showPassword ? <FaRegEyeSlash size={22} /> : <FaRegEye size={22} />}
            </button>
          </div>
          <div className="relative">
            <input
              value={confirmPassword}
              placeholder="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input w-full rounded-b-lg"
            />
            <button
              type="button"
              onClick={() => toggleShowPassword('confirm')}
              className="absolute right-3 bottom-3.5 text-slate-400"
            >
              {showConfirmPassword ? <FaRegEyeSlash size={22} /> : <FaRegEye size={22} />}
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm my-2">{error}</p>}

        <button type="submit" className="btn-primary w-full">
          Signup
        </button>
      </form>
      <div className="flex justify-end w-full">
        <p className="mt-3 text-[13px] text-gray-500">
          Already have an account? {' '}
          <Link className="hover:text-blue-500 underline" to={"/login"}>
            Login
          </Link>
        </p>
      </div>
    </div>
  </div>

)
}

export default SignUp