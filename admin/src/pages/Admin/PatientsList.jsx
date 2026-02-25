import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const PatientsList = () => {
  const { aToken, patients, getAllPatients } = useContext(AdminContext)

  useEffect(() => {
    if (aToken) {
      getAllPatients()
    }
  }, [aToken])

  return (
    <div className='m-5 max-h-[90vh] overflow-y-auto'>
      <h1 className='text-lg font-medium mb-4'>Patients List</h1>

      {/* Wrapper with horizontal scroll for small mobile screens */}
      <div className='bg-white rounded-xl shadow-sm border border-indigo-100 overflow-x-auto'>
        <table className='w-full min-w-[640px] text-xs sm:text-sm'>
          <thead className='bg-indigo-50 text-left text-gray-700'>
            <tr>
              <th className='py-3 px-4'>#</th>
              <th className='py-3 px-4'>Name</th>
              <th className='py-3 px-4'>Email</th>
              <th className='py-3 px-4'>Phone</th>
              <th className='py-3 px-4'>Gender</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p, index) => (
              <tr key={p._id} className='border-t hover:bg-indigo-50/60'>
                <td className='py-2.5 px-4'>{index + 1}</td>
                <td className='py-2.5 px-4'>{p.name}</td>
                <td className='py-2.5 px-4'>{p.email}</td>
                <td className='py-2.5 px-4'>{p.phone || '-'}</td>
                <td className='py-2.5 px-4 capitalize'>{p.gender || '-'}</td>
              </tr>
            ))}
            {patients.length === 0 && (
              <tr>
                <td className='py-4 px-4 text-center text-gray-500' colSpan={5}>
                  No patients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PatientsList
