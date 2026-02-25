import { createContext, useEffect, useState } from "react"
import { toast } from 'react-toastify'
import axios from 'axios'

export const AppContext = createContext()

const AppContextprovider = (props) => {
    const currencysymbol = "₹"
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [doctors, setDoctors] = useState([])
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false)
    const [userData, setUserData] = useState(false)

    const getDoctorsData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/list');
            if (data.success) {
                setDoctors(data.doctors);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    // Only one definition of loadUserProfileData is kept here
    const loadUserProfileData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/get-profile', { headers: { token } })

            if (data.success) {
                setUserData(data.userData)
            } else {
                // Logic to handle expired tokens
                if (data.message === 'jwt expired') {
                    setToken(false)
                    localStorage.removeItem('token')
                    toast.error("તમારું સત્ર સમાપ્ત થઈ ગયું છે, ફરી લોગિન કરો.")
                } else {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const calculateAge = (dob) => {
        const today = new Date()
        const birthDate = new Date(dob)

        let age = today.getFullYear() - birthDate.getFullYear()
        return age
    }

    const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_')
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    }

    const value = {
        doctors, getDoctorsData,
        currencysymbol,
        token, setToken,
        backendUrl,
        userData, setUserData,
        loadUserProfileData,
        calculateAge,
        slotDateFormat
    }

    useEffect(() => {
        getDoctorsData()
    }, [])

    useEffect(() => {
        if (token) {
            loadUserProfileData()
        } else {
            setUserData(false)
        }
    }, [token])

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextprovider;