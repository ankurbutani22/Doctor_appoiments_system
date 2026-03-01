import React, { useState, useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import loginBg from '../assets/loginb.png'
import { DoctorContext } from '../context/DoctorContext'

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext)
  const { setDToken } = useContext(DoctorContext)
  const navigate = useNavigate()
  const [state, setState] = useState('Login') // Default to Login
  const [role, setRole] = useState('Patient') // Default role
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [image, setImage] = useState(null)

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      if (role === 'Patient') {
        if (state === 'Sign Up') {
          if (!image) {
            toast.error('Profile image is required')
            return
          }

          const formData = new FormData()
          formData.append('name', name)
          formData.append('email', email)
          formData.append('password', password)
          formData.append('image', image)

          const { data } = await axios.post(backendUrl + '/api/user/register', formData)
          if (data.success) {
            // Registration successful – do NOT auto login.
            // Ask user to login manually.
            toast.success('Registration successful, please login.')
            setState('Login')
          } else {
            toast.error(data.message)
          }
        } else {
          const { data } = await axios.post(backendUrl + '/api/user/login', { password, email })
          if (data.success) {
            setToken(data.token)
          } else {
            toast.error(data.message)
          }
        }
      } else if (role === 'Admin') {
        const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
        if (data.success) {
          localStorage.setItem('aToken', data.token)
          // Redirect to Admin Panel with token in URL (atoken)
          window.location.href = `http://localhost:5175?atoken=${data.token}`
        } else {
          toast.error(data.message)
        }
      } else if (role === 'Doctor') {
        const { data } = await axios.post(backendUrl + '/api/doctor/login', { email, password })
        if (data.success) {
          localStorage.setItem('dToken', data.token)
          setDToken(data.token)
          navigate('/doctor-dashboard')
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token, navigate])

  return (
    <div
      className='min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat'
      style={{ backgroundImage: `url(${loginBg})` }}
    >

      {/* --- Glassmorphism Form Container --- */}
      <form
        onSubmit={onSubmitHandler}
        className='flex flex-col gap-3 items-start p-8 min-w-[340px] sm:min-w-96 border border-white/40 rounded-2xl text-zinc-700 text-sm shadow-2xl bg-white/10 backdrop-blur-lg'
      >
        <div className='w-full flex justify-center gap-4 mb-2'>
          <button
            type="button"
            onClick={() => { setRole('Patient'); setState('Login') }}
            className={`px-4 py-1 rounded-full transition-all ${role === 'Patient' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-zinc-600'}`}
          >
            Patient
          </button>
          <button
            type="button"
            onClick={() => { setRole('Doctor'); setState('Login') }}
            className={`px-4 py-1 rounded-full transition-all ${role === 'Doctor' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-zinc-600'}`}
          >
            Doctor
          </button>
        </div>

        <p className='text-2xl font-semibold text-blue-700'>
          {role} {state === 'Sign Up' ? "Registration" : "Login"}
        </p>
        <p className='text-zinc-500'>Please {state === 'Sign Up' ? "Sign Up" : "Login"} to continue</p>

        {role === 'Patient' && state === "Sign Up" && (
          <div className='w-full'>
            <p className='font-medium text-zinc-600'>Full Name</p>
            <input
              className='bg-white/80 border border-white/50 rounded w-full p-2 mt-1 outline-none focus:bg-white transition-all'
              type='text'
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
        )}

        {role === 'Patient' && state === "Sign Up" && (
          <div className='w-full'>
            <p className='font-medium text-zinc-600'>Profile Photo (required)</p>
            <input
              className='bg-white/80 border border-white/50 rounded w-full p-2 mt-1 outline-none focus:bg-white transition-all text-sm'
              type='file'
              accept='image/*'
              onChange={(e) => setImage(e.target.files[0])}
              required
            />
          </div>
        )}

        <div className='w-full'>
          <p className='font-medium text-zinc-600'>Email</p>
          <input
            className='bg-white/80 border border-white/10 rounded w-full p-2 mt-1 outline-none focus:bg-white transition-all'
            type='email'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>

        <div className='w-full'>
          <p className='font-medium text-zinc-600'>Password</p>
          <input
            className='bg-white/80 border border-white/50 rounded w-full p-2 mt-1 outline-none focus:bg-white transition-all'
            type='password'
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>

        <button
          type='submit'
          className='bg-blue-600 text-white w-full py-2.5 rounded-md text-base mt-2 hover:bg-blue-700 transition-all shadow-lg active:scale-95'
        >
          {state === 'Sign Up' ? "Create Account" : "Login"}
        </button>

        <div className='mt-2 w-full text-center'>
          {role === 'Patient' ? (
            state === "Sign Up"
              ? <p>Already have an account? <span onClick={() => setState('Login')} className='text-blue-700 font-semibold underline cursor-pointer'> Login here</span></p>
              : <p>Create a new account? <span onClick={() => setState('Sign Up')} className='text-blue-700 font-semibold underline cursor-pointer'>Click here</span></p>
          ) : (
            <p className='text-zinc-500 italic'>Only registered {role}s can login</p>
          )}
        </div>
      </form>
    </div>
  )
}

export default Login