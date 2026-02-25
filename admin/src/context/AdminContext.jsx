import axios from "axios";
import { toast } from 'react-toastify'
import { createContext, useState } from "react";
export const AdminContext = createContext()

const AdminContextProvider = (props) => {
    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '')
    const [doctors, setdoctors] = useState([])
    const [patients, setPatients] = useState([])
    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState(false)
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const getAllDoctors = async () => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/all-doctors', {}, { headers: { atoken: aToken } })
            if (data.success) {
                setdoctors(data.doctors)
            } else {
                toast.error(data.message)
                console.log(data.doctors)
            }
        }
        catch (error) {
            toast.error(error.message)
        }
    }


    const getAllPatients = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/patients', { headers: { atoken: aToken } })
            if (data.success) {
                setPatients(data.patients)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    const getAllAppointments = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/appointments', { headers: { atoken: aToken } })
            if (data.success) {
                setAppointments(data.appointments)
                console.log(data.appointments)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getDashData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { atoken: aToken } })
            if (data.success) {
                setDashData(data.dashData)
                console.log(data.dashData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/cancel-appointment', { appointmentId }, { headers: { atoken: aToken } })
            if (data.success) {
                toast.success(data.message)
                getDashData()
                getAllAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const changeAvailablity = async (docId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/change-availability', { docId }, { headers: { atoken: aToken } })

            if (data.success) {
                toast.success(data.message)
                getAllDoctors() // ડેટા રિફ્રેશ કરવા માટે
            } else {
                toast.error(data.message) // ભૂલનો મેસેજ બતાવવા
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // fetch single doctor by id
    const getDoctorById = async (docId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/get-doctor', { docId }, { headers: { atoken: aToken } })
            return data
        } catch (error) {
            toast.error(error.message)
            return { success: false, message: error.message }
        }
    }

    // update doctor details (formData should include docId and optionally newPassword)
    const updateDoctor = async (formData) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/update-doctor', formData, { headers: { atoken: aToken } })
            return data
        } catch (error) {
            toast.error(error.message)
            return { success: false, message: error.message }
        }
    }

    const value = {
        aToken, setAToken,
        backendUrl, doctors,
        patients,
        getAllDoctors, getAllPatients, changeAvailablity, getDoctorById, updateDoctor,
        appointments, setAppointments,
        getAllAppointments,
        dashData, getDashData,
        cancelAppointment
    }
    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider