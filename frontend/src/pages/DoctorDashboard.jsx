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
        <div className='m-4 sm:m-6 lg:m-8 bg-slate-50 min-h-[calc(100vh-80px)] rounded-2xl p-4 sm:p-6 lg:p-8'>
            {showModal && (
                <PrescriptionModal
                    appointmentId={selectedAppointment?._id}
                    patientName={selectedAppointment?.userData?.name}
                    initialMedicines={selectedAppointment?.prescribedMedicines}
                    onComplete={onCompletePrescription}
                    onCancel={() => setShowModal(false)}
                />
            )}

            {/* Header */}
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6'>
                <div>
                    <h1 className='text-2xl sm:text-3xl font-semibold text-slate-900'>Doctor Dashboard</h1>
                    <p className='text-sm text-slate-500 mt-1'>Overview of today&apos;s performance, bookings and patient feedback.</p>
                </div>
            </div>

            {/* Top stats grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
                <div className='bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-4 flex items-center gap-3 hover:shadow-md transition-shadow'>
                    <div className='w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center'>
                        <img className='w-6' src={assets.earning_icon} alt="" />
                    </div>
                    <div>
                        <p className='text-xs uppercase tracking-wide text-slate-400'>Total Earnings</p>
                        <p className='text-xl font-semibold text-slate-800 mt-0.5'>₹ {dashData.earnings}</p>
                    </div>
                </div>

                <div className='bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-4 flex items-center gap-3 hover:shadow-md transition-shadow'>
                    <div className='w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center'>
                        <img className='w-6' src={assets.appointments_icon} alt="" />
                    </div>
                    <div>
                        <p className='text-xs uppercase tracking-wide text-slate-400'>Appointments</p>
                        <p className='text-xl font-semibold text-slate-800 mt-0.5'>{dashData.appointments}</p>
                    </div>
                </div>

                <div className='bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-4 flex items-center gap-3 hover:shadow-md transition-shadow'>
                    <div className='w-11 h-11 rounded-full bg-indigo-50 flex items-center justify-center'>
                        <img className='w-6' src={assets.patients_icon} alt="" />
                    </div>
                    <div>
                        <p className='text-xs uppercase tracking-wide text-slate-400'>Patients</p>
                        <p className='text-xl font-semibold text-slate-800 mt-0.5'>{dashData.patients}</p>
                    </div>
                </div>

                <div className='bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-4 flex items-center gap-3 hover:shadow-md transition-shadow'>
                    <div className='w-11 h-11 rounded-full bg-amber-50 flex items-center justify-center'>
                        <span className='text-amber-500 text-xl'>★</span>
                    </div>
                    <div>
                        <p className='text-xs uppercase tracking-wide text-slate-400'>Rating</p>
                        <p className='text-xl font-semibold text-slate-800 mt-0.5'>
                            {ratingSummary?.ratingCount > 0 ? ratingSummary.averageRating?.toFixed(1) : '--'}
                        </p>
                        <p className='text-[11px] text-slate-400'>
                            {ratingSummary?.ratingCount > 0 ? `${ratingSummary.ratingCount} ratings` : 'No ratings yet'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main content: bookings + ratings */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 items-start'>
                {/* Latest bookings */}
                <div className='bg-white rounded-2xl border border-slate-100 shadow-sm col-span-2 overflow-hidden'>
                    <div className='flex items-center justify-between gap-2 px-5 py-4 border-b border-slate-100 bg-slate-50/60'>
                        <div className='flex items-center gap-2'>
                            <img src={assets.list_icon} alt="" className='w-4' />
                            <p className='font-semibold text-slate-800 text-sm sm:text-base'>Latest Bookings</p>
                        </div>
                        <p className='text-xs text-slate-400'>Last {Math.min(dashData.latestAppointments.length, 5)} visits</p>
                    </div>

                    <div className='divide-y divide-slate-100'>
                    {
                        dashData.latestAppointments.map((item, index) => (
                            <div className='flex items-center px-5 py-3.5 gap-3 hover:bg-slate-50 transition-colors' key={index}>
                                <img className='rounded-full w-10 h-10 object-cover bg-slate-100' src={item.userData.image} alt="" />
                                <div className='flex-1 text-sm'>
                                    <p className='text-slate-900 font-medium leading-tight'>{item.userData.name}</p>
                                    <p className='text-slate-500 text-xs mt-0.5'>
                                        {item.slotDate} &bull; {item.slotTime}
                                    </p>
                                </div>
                                {item.cancelled
                                    ? <p className='text-red-400 text-[11px] font-semibold px-2 py-1 rounded-full bg-red-50 border border-red-100'>Cancelled</p>
                                    : item.isCompleted
                                        ? <p className='text-emerald-500 text-[11px] font-semibold px-2 py-1 rounded-full bg-emerald-50 border border-emerald-100'>Completed</p>
                                        : <div className='flex gap-2'>
                                            <button
                                                type='button'
                                                onClick={() => cancelAppointment(item._id)}
                                                className='w-8 h-8 flex items-center justify-center rounded-full border border-red-200 bg-red-50 hover:bg-red-100 transition-colors'
                                            >
                                                <img className='w-4' src={assets.cancel_icon} alt="Cancel" />
                                            </button>
                                            <button
                                                type='button'
                                                onClick={() => handleComplete(item)}
                                                className='w-8 h-8 flex items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 transition-colors'
                                            >
                                                <img className='w-4' src={assets.tick_icon} alt="Complete" />
                                            </button>
                                        </div>
                                }
                            </div>
                        ))
                    }
                </div>
                </div>

                {/* Ratings list */}
                <div className='bg-white rounded-2xl border border-slate-100 shadow-sm max-h-[360px] flex flex-col overflow-hidden'>
                    <div className='flex items-center gap-2 px-5 py-4 border-b border-slate-100 bg-slate-50/60'>
                        <img src={assets.list_icon} alt="" className='w-4' />
                        <p className='font-semibold text-slate-800 text-sm sm:text-base'>Recent Ratings</p>
                    </div>
                    <div className='flex-1 overflow-y-auto'>
                        {loadingRatings && (!ratings || ratings.length === 0) && (
                            <p className='px-5 py-4 text-sm text-slate-500'>Loading ratings...</p>
                        )}
                        {!loadingRatings && ratings && ratings.length === 0 && (
                            <p className='px-5 py-4 text-sm text-slate-500'>No ratings received yet.</p>
                        )}
                        {ratings && ratings.map((item, index) => (
                            <div className='flex items-start px-5 py-3.5 gap-3 border-b last:border-b-0 border-slate-100' key={index}>
                                <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-700'>
                                    {item.userName?.[0] || 'P'}
                                </div>
                                <div className='flex-1 text-sm'>
                                    <div className='flex items-center justify-between gap-2'>
                                        <p className='text-slate-900 font-medium truncate'>{item.userName}</p>
                                        <p className='text-amber-400 text-xs whitespace-nowrap'>
                                            {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
                                        </p>
                                    </div>
                                    {item.comment && (
                                        <p className='text-slate-600 mt-1 text-xs leading-snug line-clamp-3'>{item.comment}</p>
                                    )}
                                    <p className='text-[11px] text-slate-400 mt-1'>
                                        {item.date ? new Date(item.date).toLocaleDateString() : ''}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DoctorDashboard
