import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === 'development'? 'http://localhost:4000/api': '/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
})

//Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('token')
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

//Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                //Redirect to login page
               /*  window.location.href = '/login' */
            } else if (error.response.status === 500) {
                console.log('Server error')
            }
        } else if (error.code === 'ECONNABORTED') {
            console.log('Request timeout')
        }
        return Promise.reject(error)
    }
)

export default axiosInstance