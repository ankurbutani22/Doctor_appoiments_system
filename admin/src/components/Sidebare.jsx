import React from 'react'
import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AdminContext } from '../context/AdminContext'
import { assets } from '../assets/assets'


const Sidebare = () => {
    const { aToken } = useContext(AdminContext)

    return (
        <div className='min-h-screen bg-white border-r'>
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
    )
}

export default Sidebare
