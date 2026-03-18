import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../context/DoctorContext'
import { assets } from '../assets/assets'
import PrescriptionModal from '../components/PrescriptionModal'
import PageLoader from '../components/PageLoader'

const DoctorDashboard = () => {

    const { dToken, dashData, getDashData, cancelAppointment, completeAppointment, loadingDashData, ratings, ratingSummary, getDoctorRatings, loadingRatings, profileData, getProfileData } = useContext(DoctorContext)

    const [showModal, setShowModal] = useState(false)
    const [selectedAppointment, setSelectedAppointment] = useState(null)

    useEffect(() => {
        if (dToken) {
            getDashData()
            getDoctorRatings()
            getProfileData()
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
        <div className='bg-slate-50 min-h-[calc(100vh-80px)] py-6 sm:py-8'>
            <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
            {showModal && (
                <PrescriptionModal
                    appointmentId={selectedAppointment?._id}
                    patientName={selectedAppointment?.userData?.name}
                    initialMedicines={selectedAppointment?.prescribedMedicines}
                    onComplete={onCompletePrescription}
                    onCancel={() => setShowModal(false)}
                />
            )}

            {/* Two-column layout: profile + stats on left, activity on right */}
            <div className='grid grid-cols-1 lg:grid-cols-[1.05fr,1.8fr] gap-6 items-start'>
                {/* Left column: doctor profile + key metrics */}
                <div className='space-y-5'>
                    {/* Profile card */}
                    <div className='bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 flex flex-col gap-4'>
                        <div className='flex items-center gap-4'>
                            <div className='w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-sky-400 flex items-center justify-center overflow-hidden shadow-sm'>
                                {profileData?.image
                                    ? <img src={profileData.image} alt='Doctor avatar' className='w-full h-full object-cover' />
                                    : <span className='text-xl font-semibold text-white'>{profileData?.name?.[0] || 'D'}</span>
                                }
                            </div>
                            <div>
                                <p className='text-xs uppercase tracking-[0.18em] text-slate-400 mb-1'>Doctor dashboard</p>
                                <h1 className='text-xl sm:text-2xl font-semibold text-slate-900 leading-snug'>
                                    {profileData?.name || 'Welcome back'}
                                </h1>
                                <p className='text-xs text-slate-500 mt-1'>
                                    {profileData?.speciality || 'Manage your appointments, earnings and patient feedback.'}
                                </p>
                            </div>
                        </div>

                        <div className='grid grid-cols-2 gap-3 mt-2 text-sm'>
                            <div className='rounded-xl border border-blue-50 bg-blue-50/60 px-3 py-2 flex flex-col gap-0.5'>
                                <span className='text-[11px] uppercase tracking-wide text-blue-500'>Earnings</span>
                                <span className='text-lg font-semibold text-slate-900'>₹ {dashData.earnings}</span>
                            </div>
                            <div className='rounded-xl border border-emerald-50 bg-emerald-50/60 px-3 py-2 flex flex-col gap-0.5'>
                                <span className='text-[11px] uppercase tracking-wide text-emerald-500'>Patients</span>
                                <span className='text-lg font-semibold text-slate-900'>{dashData.patients}</span>
                            </div>
                            <div className='rounded-xl border border-indigo-50 bg-indigo-50/60 px-3 py-2 flex flex-col gap-0.5'>
                                <span className='text-[11px] uppercase tracking-wide text-indigo-500'>Appointments</span>
                                <span className='text-lg font-semibold text-slate-900'>{dashData.appointments}</span>
                            </div>
                            <div className='rounded-xl border border-amber-50 bg-amber-50/60 px-3 py-2 flex flex-col gap-0.5'>
                                <span className='text-[11px] uppercase tracking-wide text-amber-500'>Rating</span>
                                <span className='text-lg font-semibold text-slate-900'>
                                    {ratingSummary?.ratingCount ? ratingSummary.averageRating?.toFixed(1) : '--'}
                                </span>
                                <span className='text-[11px] text-slate-500'>
                                    {ratingSummary?.ratingCount ? `${ratingSummary.ratingCount} ratings` : 'No ratings yet'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Mini insight card */}
                    <div className='bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-xs text-slate-600 space-y-2'>
                        <p className='font-semibold text-slate-800 text-sm'>Today&apos;s snapshot</p>
                        <p>• You have <span className='font-semibold text-slate-900'>{dashData.appointments}</span> total appointments logged.</p>
                        <p>• Your average rating is <span className='font-semibold text-amber-500'>{ratingSummary?.ratingCount ? ratingSummary.averageRating?.toFixed(1) : '—'}</span>.</p>
                        <p>• Total unique patients seen: <span className='font-semibold text-emerald-600'>{dashData.patients}</span>.</p>
                    </div>
                </div>

                {/* Right column: bookings + ratings */}
                <div className='space-y-5'>
                    {/* Latest bookings */}
                    <div className='bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden'>
                        <div className='flex items-center justify-between gap-2 px-5 py-4 border-b border-slate-100 bg-slate-50/70'>
                            <div className='flex items-center gap-2'>
                                <img src={assets.list_icon} alt="" className='w-4' />
                                <p className='font-semibold text-slate-800 text-sm sm:text-base'>Upcoming & recent appointments</p>
                            </div>
                            <p className='text-xs text-slate-400'>Last {Math.min(dashData.latestAppointments.length, 5)} visits</p>
                        </div>

                        <div className='divide-y divide-slate-100'>
                    <div className='flex items-center justify-between gap-2 px-5 py-4 border-b border-slate-100 bg-slate-50/60'>
                        <div className='flex items-center gap-2'>
                            <img src={assets.list_icon} alt="" className='w-4' />
                            <p className='font-semibold text-slate-800 text-sm sm:text-base'>Latest Bookings</p>
                        </div>
                        <p className='text-xs text-slate-400'>Last {Math.min(dashData.latestAppointments.length, 5)} visits</p>
                    </div>

                        {dashData.latestAppointments.map((item, index) => (
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
                        ))}
                        </div>
                    </div>

                    {/* Ratings list */}
                    <div className='bg-white rounded-2xl border border-slate-100 shadow-sm max-h-[360px] flex flex-col overflow-hidden'>
                        <div className='flex items-center gap-2 px-5 py-4 border-b border-slate-100 bg-slate-50/70'>
                            <img src={assets.list_icon} alt="" className='w-4' />
                            <p className='font-semibold text-slate-800 text-sm sm:text-base'>Patient feedback</p>
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
            </div>
    )
}

export default DoctorDashboard
