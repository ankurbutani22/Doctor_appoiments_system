import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { DoctorContext } from '../context/DoctorContext'

const DoctorLoader = () => {
  const { token, userData } = useContext(AppContext)
  const { dToken } = useContext(DoctorContext)

  let loaderImage = assets.logo

  if (token && userData) {
    loaderImage = (userData.image && userData.image.length > 500)
      ? assets.profile_pic
      : (userData.image || assets.profile_pic)
  } else if (dToken) {
    loaderImage = assets.profile_pic
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="relative flex items-center justify-center">
        <div className="h-32 w-32 rounded-full border-4 border-blue-200 flex items-center justify-center animate-pulse bg-white shadow-lg">
          <img
            src={loaderImage}
            alt="Doctor Loader"
            className="h-16 w-16 object-contain"
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
