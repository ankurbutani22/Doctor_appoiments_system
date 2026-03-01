import React, { useContext, useEffect, useState } from 'react'
import { Route, Routes, Navigate, useLocation } from 'react-router-dom'
import Home from './pages/home'
import About from './pages/About'
import Login from './pages/Login'
import MyAppointments from './pages/MyAppointments'
import Contect from './pages/Contect'
import Myprofile from './pages/Myprofile'
import Doctors from './pages/Doctors'
import Appoinments from './pages/Appoinments'
import DoctorDashboard from './pages/DoctorDashboard'
import DoctorAppointments from './pages/DoctorAppointments'
import DoctorProfile from './pages/DoctorProfile'
import MyMedicines from './pages/MyMedicines'
import DoctorMedicines from './pages/DoctorMedicines'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ErrorBoundary from './components/ErrorBoundary'
import DoctorLoader from './components/DoctorLoader'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AppContext } from './context/AppContext'

// Scroll to top on every route change so new pages
// always start from the header instead of near footer.
const ScrollToTop = () => {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])

  return null
}

const App = () => {
  const { token } = useContext(AppContext)
  const [showLoader, setShowLoader] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false)
    }, 1500) // 1.5 seconds splash

    return () => clearTimeout(timer)
  }, [])

  if (showLoader) {
    return <DoctorLoader />
  }

  return (
    <div className="mx-4 sm:mx-[10%] pt-16 md:pt-0 pb-[72px] md:pb-0">
      <ToastContainer />
      <ScrollToTop />
      <Navbar />
      <ErrorBoundary>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/doctors' element={<Doctors />} />
          <Route path='/doctors/:speciality' element={<Doctors />} />
          <Route path='/Login' element={<Login />} />
          <Route path='/about' element={<About />} />
          <Route path='/Contect' element={<Contect />} />
          <Route path='/my-profile' element={<Myprofile />} />
          <Route path='/my-appointments' element={<MyAppointments />} />
          <Route path='/appointment/:docId' element={<Appoinments />} />
          <Route path='/my-medicines' element={<MyMedicines />} />

          {/* Doctor Routes */}
          <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
          <Route path='/doctor-appointments' element={<DoctorAppointments />} />
          <Route path='/doctor-profile' element={<DoctorProfile />} />
          <Route path='/doctor-medicines' element={<DoctorMedicines />} />

          {/* fallback to home for any unmatched path */}
          <Route path='*' element={<Navigate replace to='/' />} />
        </Routes>
      </ErrorBoundary>
      <Footer />
    </div>
  )
}

export default App
