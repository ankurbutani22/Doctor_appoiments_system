import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets'
import PageLoader from '../../components/PageLoader'

const PatientsList = () => {
  const { aToken, patients, getAllPatients, loadingPatients } = useContext(AdminContext)

  useEffect(() => {
    if (aToken) {
      getAllPatients()
    }
  }, [aToken])

  if (loadingPatients && patients.length === 0) {
    return <PageLoader label="Loading patients..." />
  }

  return (
    <div className='m-5 max-h-[90vh] overflow-y-auto'>
      <h1 className='text-lg font-medium mb-4'>Patients List</h1>

      <div className='w-full flex flex-wrap gap-4 gap-y-6 pt-2'>
        {patients.map((p, index) => (
          <div
            key={p._id}
            className='flex items-center gap-4 bg-white border border-indigo-100 rounded-2xl px-4 py-3 shadow-sm w-full sm:w-[48%] lg:max-w-md'
          >
            <div className='w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0'>
              <img src={assets.patient_icon} alt='' className='w-7 h-7' />
            </div>
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-semibold text-gray-800 truncate'>
                {index + 1}. {p.name}
              </p>
              <p className='text-xs text-gray-500 truncate'>{p.email}</p>
              <div className='mt-1 flex items-center justify-between text-[11px] text-gray-600 gap-3'>
                <span className='truncate'>📞 {p.phone || '-'} </span>
                <span className='truncate'>
                  {p.gender ? `Gender: ${p.gender}` : 'Gender: Not Selected'}
                </span>
              </div>
            </div>
          </div>
        ))}

        {patients.length === 0 && (
          <p className='text-center text-gray-500 text-sm w-full bg-white rounded-xl border border-dashed border-indigo-200 py-6'>
            No patients found.
          </p>
        )}
      </div>
    </div>
  )
}

export default PatientsList
