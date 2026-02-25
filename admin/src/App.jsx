import React, { useContext, useEffect } from 'react'
import Login from './pages/Login'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AdminContext } from './context/AdminContext'
import Navebar from './components/Navebar'
import Sidebare from './components/Sidebare'
import { Route, Routes } from 'react-router-dom'
import AllAppoinments from './pages/Admin/AllAppoinments'
import Dashboard from './pages/Admin/Dashboard'
import AddDoctor from './pages/Admin/AddDoctor'
import EditDoctor from './pages/Admin/EditDoctor'
import DoctorsList from './pages/Admin/DoctorsList'

const App = () => {
  const { aToken, setAToken } = useContext(AdminContext)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const urlAToken = urlParams.get('atoken')

    if (urlAToken) {
      localStorage.setItem('aToken', urlAToken)
      setAToken(urlAToken)
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [setAToken])

  return aToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      <Navebar />
      <div className='flex items-start '>
        <Sidebare />
        <Routes>
          <Route path='/' element={<></>} />
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/All-appointments' element={<AllAppoinments />} />
          <Route path='/add-doctor' element={<AddDoctor />} />
          <Route path='/edit-doctor' element={<EditDoctor />} />
          <Route path='/edit-doctor/:id' element={<EditDoctor />} />
          <Route path='/doctor-List' element={<DoctorsList />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  )
}

export default App
