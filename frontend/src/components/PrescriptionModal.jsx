import React, { useState } from 'react'
import { assets } from '../assets/assets'

const PrescriptionModal = ({ appointmentId, patientName, initialMedicines = '', onComplete, onCancel }) => {
    const [medicines, setMedicines] = useState(initialMedicines)

    const initial = (patientName || '').trim().charAt(0).toUpperCase()

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm px-4'>
            <div className='w-full max-w-lg bg-white rounded-3xl shadow-[0_24px_80px_rgba(15,23,42,0.32)] overflow-hidden border border-gray-100'>
                {/* Top accent bar */}
                <div className='h-1 w-full bg-linear-to-r from-primary via-blue-500 to-emerald-400' />

                {/* Header */}
                <div className='px-6 pt-4 pb-3 flex items-start justify-between gap-4'>
                    <div className='flex items-start gap-3'>
                        <div className='w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-semibold text-lg'>
                            {initial || 'P'}
                        </div>
                        <div>
                            <p className='text-[11px] font-semibold tracking-[0.2em] text-primary uppercase mb-1'>Doctor Panel</p>
                            <h2 className='text-xl font-semibold text-gray-900'>Complete Appointment</h2>
                            <p className='text-sm text-gray-500 mt-0.5'>
                                Patient:&nbsp;
                                <span className='font-semibold text-gray-800'>{patientName}</span>
                            </p>
                        </div>
                    </div>
                    <button
                        type='button'
                        onClick={onCancel}
                        className='shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors'
                        aria-label='Close'
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className='px-6 pt-1 pb-3'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Prescribe Medicines</label>
                    <p className='text-xs text-gray-400 mb-2'>Write medicine name, dosage, timing and any important instructions for the patient.</p>
                    <textarea
                        className='w-full border border-gray-200 rounded-2xl p-3.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 h-32 resize-none text-sm text-gray-800 placeholder:text-gray-400 transition-all'
                        placeholder='e.g. Tab Paracetamol 500mg – 1 tablet after food, morning & night, for 3 days.'
                        value={medicines}
                        onChange={(e) => setMedicines(e.target.value)}
                    ></textarea>
                </div>

                {/* Footer */}
                <div className='px-6 pb-5 pt-3 flex flex-col sm:flex-row-reverse gap-2 sm:gap-3 bg-gray-50/80'>
                    <button
                        onClick={() => onComplete(appointmentId, medicines)}
                        className='w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-blue-600 text-white py-2.5 px-4 rounded-2xl text-sm font-semibold shadow-md hover:bg-blue-700 active:scale-[0.98] transition-all'
                    >
                        <span>Complete &amp; Prescribe</span>
                    </button>
                    <button
                        onClick={onCancel}
                        className='w-full sm:w-auto inline-flex justify-center items-center gap-2 border border-gray-300 bg-white py-2.5 px-4 rounded-2xl text-sm font-medium text-gray-700 hover:bg-gray-100 active:scale-[0.98] transition-all'
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PrescriptionModal
