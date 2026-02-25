import React from 'react'
import { assets } from '../assets/assets'
import { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'

const Navebar = () => {
  const { aToken, setAToken } = useContext(AdminContext)
  const navigate = useNavigate()
  const logout = () => {
    navigate('/')
    aToken && setAToken('')
    aToken && localStorage.removeItem('aToken')

  }

  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
      <div className='flex items-center gap-3'>
        <div className='flex items-center gap-2 text-xs'>
          <img className='w-36 sm:w-40 cursor-pointer' src={assets.admin_logo} alt="" />
          <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600 '>{aToken ? 'admin' : 'Doctor'}</p>
        </div>
        <div className='w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border-2 border-primary'>
          <span className='text-xl'>👤</span>
        </div>
      </div>
      <button onClick={logout} className='bg-blue-600 text-white text-sm px-10 py-2 rounded-full hover:bg-blue-700 transition-colors'>Logout</button>
    </div>
  )
}

export default Navebar
