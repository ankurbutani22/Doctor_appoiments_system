import React, { useState } from 'react'
import { assets } from '../assets/assets'

const PrescriptionModal = ({ appointmentId, patientName, initialMedicines = '', onComplete, onCancel }) => {
    const [medicines, setMedicines] = useState(initialMedicines)

    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
            <div className='bg-white p-6 rounded-xl w-full max-w-md shadow-2xl'>
                <h2 className='text-xl font-bold text-gray-800 mb-2'>Complete Appointment</h2>
                <p className='text-gray-600 mb-4'>Patient: <span className='font-semibold'>{patientName}</span></p>

                <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Prescribe Medicines</label>
                    <textarea
                        className='w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-primary h-32 resize-none transition-all'
                        placeholder='Enter medicines, dosage, and instructions...'
                        value={medicines}
                        onChange={(e) => setMedicines(e.target.value)}
                    ></textarea>
                </div>

                <div className='flex gap-3'>
                    <button
                        onClick={onCancel}
                        className='flex-1 border border-gray-300 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 transition-all font-medium active:scale-95'
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onComplete(appointmentId, medicines)}
                        className='flex-1 bg-primary text-white py-2.5 rounded-lg hover:bg-primary-dark transition-all font-medium shadow-lg active:scale-95'
                    >
                        Complete & Prescribe
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PrescriptionModal
