import { createContext, useState } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'

export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [dToken, setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '')
    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState(false)
    const [profileData, setProfileData] = useState(false)
    const [loadingAppointments, setLoadingAppointments] = useState(false)
    const [loadingDashData, setLoadingDashData] = useState(false)
    const [loadingProfile, setLoadingProfile] = useState(false)

    const getAppointments = async () => {
        try {
            setLoadingAppointments(true)
            const { data } = await axios.get(backendUrl + '/api/doctor/appointments', { headers: { dToken } })
            if (data.success) {
                setAppointments(data.appointments)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setLoadingAppointments(false)
        }
    }

    const getDashData = async () => {
        try {
            setLoadingDashData(true)
            const { data } = await axios.get(backendUrl + '/api/doctor/dashboard', { headers: { dToken } })
            if (data.success) {
                setDashData(data.dashData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setLoadingDashData(false)
        }
    }

    const getProfileData = async () => {
        try {
            setLoadingProfile(true)
            const { data } = await axios.get(backendUrl + '/api/doctor/profile', { headers: { dToken } })
            if (data.success) {
                setProfileData(data.profileData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setLoadingProfile(false)
        }
    }

    const completeAppointment = async (appointmentId, prescribedMedicines) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/doctor/complete-appointment', { appointmentId, prescribedMedicines }, { headers: { dToken } })
            if (data.success) {
                toast.success(data.message)
                getAppointments()
                getDashData()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const prescribeMedicines = async (appointmentId, prescribedMedicines) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/doctor/prescribe-medicines', { appointmentId, prescribedMedicines }, { headers: { dToken } })
            if (data.success) {
                toast.success(data.message)
                getAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/doctor/cancel-appointment', { appointmentId }, { headers: { dToken } })
            if (data.success) {
                toast.success(data.message)
                getAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const uploadReport = async (appointmentId, file) => {
        try {
            const formData = new FormData()
            formData.append('appointmentId', appointmentId)
            formData.append('report', file)

            const { data } = await axios.post(backendUrl + '/api/doctor/upload-report', formData, {
                headers: {
                    dToken,
                    'Content-Type': 'multipart/form-data'
                }
            })

            if (data.success) {
                toast.success(data.message)
                getAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const deleteReport = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/doctor/delete-report', { appointmentId }, {
                headers: { dToken }
            })

            if (data.success) {
                toast.success(data.message)
                getAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const value = {
        dToken, setDToken,
        backendUrl,
        appointments, setAppointments,
        getAppointments,
        loadingAppointments,
        dashData, setDashData, getDashData,
        loadingDashData,
        profileData, setProfileData, getProfileData,
        loadingProfile,
        completeAppointment, cancelAppointment, prescribeMedicines,
        uploadReport, deleteReport
    }

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider
