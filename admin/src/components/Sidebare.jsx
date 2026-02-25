import React from 'react'
import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AdminContext } from '../context/AdminContext'
import { assets } from '../assets/assets'


const Sidebare = () => {
    const { aToken } = useContext(AdminContext)

    return (
        <>
        {/* Desktop / Tablet sidebar */}
        <div className='min-h-screen bg-white border-r hidden md:block'>
            {aToken && <ul className='text-[#515151] mt-5'>
                <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:main-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} to="/admin-dashboard" >
                    <img src={assets.home_icon} alt="" />
                    <p>Dashboard</p>
                </NavLink>

                <NavLink to="/All-appointments" className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:main-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
                    <img src={assets.appointment_icon} alt="" />
                    <p>Appointments</p>
                </NavLink>

                <NavLink to="/add-doctor" className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:main-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
                    <img src={assets.add_icon} alt="" />
                    <p>Add Doctor</p>
                </NavLink>

                <NavLink to="/doctor-List" className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:main-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
                    <img src={assets.people_icon} alt="" />
                    <p>Doctors List</p>
                </NavLink>

                <NavLink to="/patients" className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:main-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
                    <img src={assets.patients_icon} alt="" />
                    <p>Patients List</p>
                </NavLink>
            </ul>
            }
        </div>

        {/* Mobile bottom navigation */}
        {aToken && (
            <nav className='md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]' style={{ height: 64 }}>
                <div className='h-full grid grid-cols-5 text-[11px] font-medium text-gray-600'>
                    <NavLink to="/admin-dashboard" className={({ isActive }) => `flex flex-col items-center justify-center gap-1 ${isActive ? 'text-primary' : ''}`}>
                        <img src={assets.home_icon} alt='' className='w-5 h-5' />
                        <span>Home</span>
                    </NavLink>
                    <NavLink to="/All-appointments" className={({ isActive }) => `flex flex-col items-center justify-center gap-1 ${isActive ? 'text-primary' : ''}`}>
                        <img src={assets.appointment_icon} alt='' className='w-5 h-5' />
                        <span>Appt</span>
                    </NavLink>
                    <NavLink to="/add-doctor" className={({ isActive }) => `flex flex-col items-center justify-center gap-1 ${isActive ? 'text-primary' : ''}`}>
                        <img src={assets.add_icon} alt='' className='w-5 h-5' />
                        <span>Add</span>
                    </NavLink>
                    <NavLink to="/doctor-List" className={({ isActive }) => `flex flex-col items-center justify-center gap-1 ${isActive ? 'text-primary' : ''}`}>
                        <img src={assets.people_icon} alt='' className='w-5 h-5' />
                        <span>Doctors</span>
                    </NavLink>
                    <NavLink to="/patients" className={({ isActive }) => `flex flex-col items-center justify-center gap-1 ${isActive ? 'text-primary' : ''}`}>
                        <img src={assets.patients_icon} alt='' className='w-5 h-5' />
                        <span>Patients</span>
                    </NavLink>
                </div>
            </nav>
        )}
        </>
    )
}

export default Sidebare
