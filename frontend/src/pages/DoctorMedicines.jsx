import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../context/DoctorContext'
import { AppContext } from '../context/AppContext'
import PrescriptionModal from '../components/PrescriptionModal'

const DoctorMedicines = () => {
    const { dToken, appointments, getAppointments, prescribeMedicines } = useContext(DoctorContext)
    const { calculateAge, slotDateFormat } = useContext(AppContext)

    const [showModal, setShowModal] = useState(false)
    const [selectedAppointment, setSelectedAppointment] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        if (dToken) {
            getAppointments()
        }
    }, [dToken])

    const completedAppointments = appointments.filter(item => item.isCompleted)

    // Filter by patient name search
    const filteredAppointments = completedAppointments.filter(item =>
        item.userData?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handlePrescribe = (item) => {
        setSelectedAppointment(item)
        setShowModal(true)
    }

    const onCompletePrescription = (appointmentId, medicines) => {
        prescribeMedicines(appointmentId, medicines)
        setShowModal(false)
        setSelectedAppointment(null)
    }

    return (
        <div className='m-5'>
            {/* Page Header + Search */}
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 mt-12 border-b'>
                <div>
                    <p className='text-xl font-bold text-zinc-700'>🩺 Doctor Medicine Menu</p>
                    <p className='text-gray-400 text-sm italic mt-1'>Prescribe medicines for completed appointments here.</p>
                </div>

                {/* Search Bar */}
                <div className='relative w-full sm:max-w-xs'>
                    <span className='absolute inset-y-0 left-3 flex items-center text-gray-400 text-base'>
                        🔍
                    </span>
                    <input
                        type='text'
                        placeholder='Search patient by name...'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className='w-full pl-9 pr-8 py-2 border border-gray-300 rounded-full text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm'
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className='absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-700 transition-colors font-bold'
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className='bg-white border rounded text-sm mt-5 overflow-y-scroll max-h-[80vh] relative'>
                {showModal && (
                    <PrescriptionModal
                        appointmentId={selectedAppointment?._id}
                        patientName={selectedAppointment?.userData?.name}
                        initialMedicines={selectedAppointment?.prescribedMedicines}
                        onComplete={onCompletePrescription}
                        onCancel={() => setShowModal(false)}
                    />
                )}

                <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1.5fr] gap-1 py-3 px-6 border-b bg-gray-50 font-bold text-gray-600'>
                    <p>#</p>
                    <p>Patient</p>
                    <p>Age</p>
                    <p>Date &amp; Time</p>
                    <p>Status</p>
                    <p className='text-center'>Action</p>
                </div>

                {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((item, index) => (
                        <div
                            className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1.5fr] gap-1 items-center text-gray-500 py-4 px-6 border-b hover:bg-blue-50/30 transition-colors'
                            key={index}
                        >
                            <p className='max-sm:hidden font-medium text-gray-400'>{index + 1}</p>
                            <div className='flex items-center gap-2'>
                                <img className='w-10 h-10 rounded-full object-cover border-2 border-primary/20' src={item.userData.image} alt="" />
                                <p className='font-semibold text-gray-800'>{item.userData.name}</p>
                            </div>
                            <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
                            <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
                            <div className='flex flex-col gap-0.5'>
                                <span className='text-green-600 font-bold text-xs'>✅ Completed</span>
                                {item.prescribedMedicines ? (
                                    <span className='text-xs text-blue-500 truncate max-w-[160px]'>💊 {item.prescribedMedicines}</span>
                                ) : (
                                    <span className='text-xs text-orange-400 font-medium'>⏳ Medicine Pending</span>
                                )}
                            </div>
                            <div className='text-center'>
                                <button
                                    onClick={() => handlePrescribe(item)}
                                    className={`text-white px-4 py-1.5 rounded-full text-xs font-medium shadow-sm transition-all active:scale-95 ${item.prescribedMedicines ? 'bg-blue-500 hover:bg-blue-600' : 'bg-primary hover:opacity-90'}`}
                                >
                                    {item.prescribedMedicines ? '✏️ Edit Medicine' : '➕ Add Medicine'}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='text-center py-20'>
                        {searchQuery ? (
                            <>
                                <span className='text-5xl'>🔍</span>
                                <p className='text-gray-500 mt-4 font-medium'>No patient found matching "<strong>{searchQuery}</strong>"</p>
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className='mt-3 text-primary text-sm underline hover:opacity-80'
                                >
                                    Clear search
                                </button>
                            </>
                        ) : (
                            <>
                                <span className='text-5xl'>📋</span>
                                <p className='text-gray-400 mt-4'>No completed appointments found.</p>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default DoctorMedicines
