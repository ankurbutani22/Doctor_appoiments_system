import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../context/DoctorContext'
import { assets } from '../assets/assets'
import PrescriptionModal from '../components/PrescriptionModal'
import PageLoader from '../components/PageLoader'

const DoctorDashboard = () => {

    const { dToken, dashData, getDashData, cancelAppointment, completeAppointment, loadingDashData, ratings, ratingSummary, getDoctorRatings, loadingRatings } = useContext(DoctorContext)

    const [showModal, setShowModal] = useState(false)
    const [selectedAppointment, setSelectedAppointment] = useState(null)

    useEffect(() => {
        if (dToken) {
            getDashData()
            getDoctorRatings()
        }
    }, [dToken])

    const handleComplete = (item) => {
        setSelectedAppointment(item)
        setShowModal(true)
    }

    const onCompletePrescription = (appointmentId, medicines) => {
        completeAppointment(appointmentId, medicines)
        setShowModal(false)
        setSelectedAppointment(null)
    }

    if (loadingDashData && !dashData) {
        return <PageLoader label="Loading dashboard..." variant="dashboard" />
    }

    return dashData && (
        <div className='m-5'>
            {showModal && (
                <PrescriptionModal
                    appointmentId={selectedAppointment?._id}
                    patientName={selectedAppointment?.userData?.name}
                    initialMedicines={selectedAppointment?.prescribedMedicines}
                    onComplete={onCompletePrescription}
                    onCancel={() => setShowModal(false)}
                />
            )}
            <div className='flex flex-wrap gap-3'>
                <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
                    <img className='w-14' src={assets.earning_icon} alt="" />
                    <div>
                        <p className='text-xl font-semibold text-gray-600'>₹ {dashData.earnings}</p>
                        <p className='text-gray-400'>Earnings</p>
                    </div>
                </div>

                <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
                    <img className='w-14' src={assets.appointments_icon} alt="" />
                    <div>
                        <p className='text-xl font-semibold text-gray-600'>{dashData.appointments}</p>
                        <p className='text-gray-400'>Appointments</p>
                    </div>
                </div>

                <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
                    <img className='w-14' src={assets.patients_icon} alt="" />
                    <div>
                        <p className='text-xl font-semibold text-gray-600'>{dashData.patients}</p>
                        <p className='text-gray-400'>Patients</p>
                    </div>
                </div>

                <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
                    <img className='w-14' src={assets.star_icon || assets.patients_icon} alt="" />
                    <div>
                        <p className='text-xl font-semibold text-gray-600'>
                            {ratingSummary?.ratingCount > 0 ? ratingSummary.averageRating?.toFixed(1) : '--'}
                        </p>
                        <p className='text-gray-400 text-xs'>
                            {ratingSummary?.ratingCount > 0 ? `${ratingSummary.ratingCount} ratings` : 'No ratings yet'}
                        </p>
                    </div>
                </div>
            </div>

            <div className='bg-white'>
                <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border'>
                    <img src={assets.list_icon} alt="" />
                    <p className='font-semibold'>Latest Bookings</p>
                </div>

                <div className='pt-4 border border-t-0'>
                    {
                        dashData.latestAppointments.map((item, index) => (
                            <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100' key={index}>
                                <img className='rounded-full w-10' src={item.userData.image} alt="" />
                                <div className='flex-1 text-sm'>
                                    <p className='text-gray-800 font-medium'>{item.userData.name}</p>
                                    <p className='text-gray-600'>{item.slotDate}</p>
                                </div>
                                {item.cancelled
                                    ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                                    : item.isCompleted
                                        ? <p className='text-green-500 text-xs font-medium'>Completed</p>
                                        : <div className='flex'>
                                            <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                                            <img onClick={() => handleComplete(item)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />
                                        </div>
                                }
                            </div>
                        ))
                    }
                </div>
            </div>

            {/* Ratings list */}
            <div className='bg-white mt-8'>
                <div className='flex items-center gap-2.5 px-4 py-4 rounded-t border'>
                    <img src={assets.list_icon} alt="" />
                    <p className='font-semibold'>Recent Ratings</p>
                </div>
                <div className='pt-4 border border-t-0 max-h-64 overflow-y-auto'>
                    {loadingRatings && (!ratings || ratings.length === 0) && (
                        <p className='px-6 pb-4 text-sm text-gray-500'>Loading ratings...</p>
                    )}
                    {!loadingRatings && ratings && ratings.length === 0 && (
                        <p className='px-6 pb-4 text-sm text-gray-500'>No ratings received yet.</p>
                    )}
                    {ratings && ratings.map((item, index) => (
                        <div className='flex items-start px-6 py-3 gap-3 border-b last:border-b-0' key={index}>
                            <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-700'>
                                {item.userName?.[0] || 'P'}
                            </div>
                            <div className='flex-1 text-sm'>
                                <div className='flex items-center justify-between'>
                                    <p className='text-gray-800 font-medium'>{item.userName}</p>
                                    <p className='text-yellow-400 text-sm'>
                                        {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
                                    </p>
                                </div>
                                {item.comment && (
                                    <p className='text-gray-600 mt-1 text-xs sm:text-sm'>{item.comment}</p>
                                )}
                                <p className='text-[11px] text-gray-400 mt-1'>
                                    {item.date ? new Date(item.date).toLocaleDateString() : ''}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default DoctorDashboard
