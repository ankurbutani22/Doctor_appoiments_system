import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../context/DoctorContext'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import PrescriptionModal from '../components/PrescriptionModal'
import PageLoader from '../components/PageLoader'

const DoctorAppointments = () => {

    const { dToken, appointments, getAppointments, completeAppointment, cancelAppointment, loadingAppointments } = useContext(DoctorContext)
    const { calculateAge, slotDateFormat, currencysymbol } = useContext(AppContext)

    const [showModal, setShowModal] = useState(false)
    const [selectedAppointment, setSelectedAppointment] = useState(null)

    useEffect(() => {
        if (dToken) {
            getAppointments()
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

    if (loadingAppointments && appointments.length === 0) {
        return <PageLoader label="Loading appointments..." variant="appointments" />
    }

    return (
        <div className='w-full max-w-6xl mx-auto my-6 px-3 sm:px-0'>

            {/* Header */}
            <div className='flex items-center justify-between mb-4 gap-3'>
                <div>
                    <p className='text-2xl font-semibold text-gray-800'>All Appointments</p>
                    <p className='text-sm text-gray-500'>Manage and review your upcoming and past visits.</p>
                </div>
                <div className='hidden sm:flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1'>
                    <span className='w-2 h-2 rounded-full bg-emerald-500 inline-block'></span>
                    <span>{appointments.length} total</span>
                </div>
            </div>

            {/* Table container */}
            <div className='bg-white border border-gray-200 rounded-xl text-sm max-h-[70vh] min-h-[50vh] overflow-y-auto shadow-sm'>

                {showModal && (
                    <PrescriptionModal
                        appointmentId={selectedAppointment?._id}
                        patientName={selectedAppointment?.userData?.name}
                        initialMedicines={selectedAppointment?.prescribedMedicines}
                        onComplete={onCompletePrescription}
                        onCancel={() => setShowModal(false)}
                    />
                )}

                {/* Table header (desktop) */}
                <div className='max-sm:hidden grid grid-cols-[0.5fr_2.2fr_1.1fr_1fr_2.6fr_1fr_1.2fr] gap-1 py-3 px-6 border-b bg-gray-50 text-gray-600 font-semibold sticky top-0 z-10'>
                    <p className='text-xs uppercase tracking-wide'>#</p>
                    <p className='text-xs uppercase tracking-wide'>Patient</p>
                    <p className='text-xs uppercase tracking-wide'>Payment</p>
                    <p className='text-xs uppercase tracking-wide'>Age</p>
                    <p className='text-xs uppercase tracking-wide'>Date &amp; Time</p>
                    <p className='text-xs uppercase tracking-wide text-right'>Fees</p>
                    <p className='text-xs uppercase tracking-wide text-center'>Action</p>
                </div>

                {
                    [...appointments].reverse().map((item, index) => (
                        <div className='flex flex-wrap justify-between max-sm:gap-4 max-sm:text-[15px] sm:grid grid-cols-[0.5fr_2.2fr_1.1fr_1fr_2.6fr_1fr_1.2fr] gap-1 items-center text-gray-600 py-3.5 px-6 border-b hover:bg-gray-50/70 transition-colors' key={index}>
                            <p className='max-sm:hidden'>{index + 1}</p>
                            <div className='flex items-center gap-2 min-w-[140px]'>
                                <img className='w-9 h-9 rounded-full object-cover' src={item.userData.image} alt="" />
                                <div className='flex flex-col leading-tight'>
                                    <p className='font-medium text-gray-800'>{item.userData.name}</p>
                                    <p className='text-[11px] text-gray-400 max-sm:inline-block'>#{index + 1}</p>
                                </div>
                            </div>
                            <div>
                                <p className={`text-[11px] inline px-2 py-0.5 rounded-full border ${item.payment ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                    {item.payment ? 'Online' : 'CASH'}
                                </p>
                            </div>
                            <p className='max-sm:hidden'>{calculateAge(item.userData.dob) || '—'}</p>
                            <p className='text-[13px] text-gray-700'>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
                            <p className='font-semibold text-right'>{currencysymbol}{item.amount}</p>
                            {
                                item.cancelled
                                    ? <p className='text-red-500 text-[11px] font-semibold text-center'>Cancelled</p>
                                    : item.isCompleted
                                        ? <p className='text-emerald-600 text-[11px] font-semibold text-center'>Completed</p>
                                        : <div className='flex justify-end gap-2'>
                                            <button
                                                type='button'
                                                onClick={() => cancelAppointment(item._id)}
                                                className='w-9 h-9 flex items-center justify-center rounded-full border border-red-200 bg-red-50 hover:bg-red-100 transition-colors'
                                            >
                                                <img className='w-4' src={assets.cancel_icon} alt="Cancel" />
                                            </button>
                                            <button
                                                type='button'
                                                onClick={() => handleComplete(item)}
                                                className='w-9 h-9 flex items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 transition-colors'
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
    )
}

export default DoctorAppointments
