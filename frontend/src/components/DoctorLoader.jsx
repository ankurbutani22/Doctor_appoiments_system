import React from 'react'
import { assets } from '../assets/assets'

const DoctorLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="relative flex items-center justify-center">
        <div className="h-32 w-32 rounded-full border-4 border-blue-200 flex items-center justify-center animate-pulse bg-white shadow-lg">
          <img
            src={assets.profile_pic}
            alt="Doctor loading"
            className="h-20 w-20 object-contain animate-bounce"
          />
        </div>
        <div className="absolute h-40 w-40 rounded-full border-4 border-blue-300 border-dashed animate-spin" />
      </div>
      <p className="mt-6 text-lg font-semibold text-gray-700">
        Loading your healthcare experience...
      </p>
    </div>
  )
}

export default DoctorLoader
