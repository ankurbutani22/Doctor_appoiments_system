import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyMedicines = () => {
    const { backendUrl, token, currencysymbol } = useContext(AppContext)
    const [appointments, setAppointments] = useState([])

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const slotDateFormatter = (slotDate) => {
        const dateArray = slotDate.split('_')
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    }

    const getuserAppointments = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
            if (data.success) {
                const completedList = data.appointments.filter(item => item.isCompleted)
                setAppointments(completedList.reverse())
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (token) {
            getuserAppointments()
        }
    }, [token])

    return (
        <div className='m-5 sm:m-10'>
            <p className='pb-3 mt-12 font-bold text-zinc-800 border-b text-2xl flex items-center gap-2'>
                <span className='text-primary'>🧾</span> Prescription & Billing History
            </p>

            <div className='grid grid-cols-1 gap-8 mt-10'>
                {appointments.length > 0 ? (
                    appointments.map((item, index) => (
                        <div key={index} className='bg-white border rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto w-full'>
                            {/* Bill Header */}
                            <div className='bg-primary p-6 text-white flex justify-between items-center'>
                                <div>
                                    <h2 className='text-2xl font-bold uppercase tracking-wider'>Medical Prescription</h2>
                                    <p className='opacity-90 text-sm'>ID: {item._id.slice(-8).toUpperCase()}</p>
                                </div>
                                <div className='text-right'>
                                    <p className='font-medium'>{slotDateFormatter(item.slotDate)}</p>
                                    <p className='text-xs opacity-80'>Time: {item.slotTime}</p>
                                </div>
                            </div>

                            {/* Info Section */}
                            <div className='p-6 grid grid-cols-1 md:grid-cols-2 gap-8 border-b'>
                                <div>
                                    <p className='text-xs font-bold text-gray-400 uppercase mb-1'>Provider Information</p>
                                    <p className='text-lg font-bold text-gray-800'>{item.docData?.name}</p>
                                    <p className='text-sm text-gray-600'>{item.docData?.speciality}</p>
                                    <p className='text-xs text-gray-500 mt-1'>{item.docData?.address?.line1}, {item.docData?.address?.line2}</p>
                                </div>
                                <div className='md:text-right'>
                                    <p className='text-xs font-bold text-gray-400 uppercase mb-1'>Patient Information</p>
                                    <p className='text-lg font-bold text-gray-800'>{item.userData?.name}</p>
                                    <p className='text-sm text-gray-600 font-medium'>Alpha Health Care Member</p>
                                </div>
                            </div>

                            {/* Medicine Details */}
                            <div className='p-6'>
                                <p className='text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-1'>
                                    <span className='text-lg'>💊</span> Prescribed Medicines
                                </p>
                                <div className='bg-blue-50/50 p-5 rounded-lg border border-blue-100 min-h-[100px]'>
                                    {item.prescribedMedicines ? (
                                        <pre className='whitespace-pre-wrap font-sans text-gray-700 text-base leading-relaxed'>
                                            {item.prescribedMedicines}
                                        </pre>
                                    ) : (
                                        <p className='text-gray-400 italic'>No specific medicines prescribed. Please consult with your doctor for further instructions.</p>
                                    )}
                                </div>
                            </div>

                            {/* Summary / Total */}
                            <div className='bg-gray-50 p-6 flex flex-col items-end'>
                                <div className='w-full md:w-1/3 space-y-2'>
                                    <div className='flex justify-between text-sm'>
                                        <span className='text-gray-500 font-medium'>Consultation Fee:</span>
                                        <span className='font-bold text-gray-700'>{currencysymbol} {item.amount}</span>
                                    </div>
                                    <div className='flex justify-between text-sm pb-2 border-b'>
                                        <span className='text-gray-500 font-medium'>Tax (GST 0%):</span>
                                        <span className='font-bold text-gray-700'>{currencysymbol} 0</span>
                                    </div>
                                    <div className='flex justify-between text-lg font-extrabold text-blue-600 pt-2'>
                                        <span>Total Amount:</span>
                                        <span>{currencysymbol} {item.amount}</span>
                                    </div>
                                </div>
                                <div className='mt-6 w-full text-center md:text-right text-xs text-gray-400 italic'>
                                    * This is an automated medical prescription generated by the Alpha Health portal.
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='text-center py-24 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200'>
                        <span className='text-7xl mb-6 block'>🏥</span>
                        <p className='text-gray-500 font-bold text-xl'>No medical records found.</p>
                        <p className='text-gray-400 mt-2'>Your medicines and bills will appear here once a doctor completes your appointment.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyMedicines
