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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-sky-100">
      <div className="relative flex flex-col items-center gap-4">
        {/* outer pulsing glow */}
        <div className="absolute inset-[-40px] rounded-full bg-blue-500/5 blur-3xl animate-pulse" />

        {/* animated concentric rings */}
        <div className="relative flex items-center justify-center">
          <div className="h-32 w-32 rounded-full bg-white shadow-2xl flex items-center justify-center overflow-hidden">
            <img
              src={loaderImage}
              alt="Doctor Loader"
              className="h-20 w-20 object-contain animate-bounce"
            />
          </div>

          <div className="absolute h-40 w-40 rounded-full border-2 border-blue-300/60 animate-[spin_2.2s_linear_infinite]" />
          <div className="absolute h-48 w-48 rounded-full border-2 border-dashed border-sky-400/60 animate-[spin_3.5s_linear_infinite_reverse]" />
        </div>

        {/* text */}
        <div className="text-center">
          <p className="text-base md:text-lg font-semibold text-gray-700 tracking-wide">
            Preparing your healthcare dashboard
          </p>
          <p className="mt-1 text-xs md:text-sm text-gray-400">
            This will only take a moment...
          </p>
        </div>
      </div>
    </div>
  )
}

export default DoctorLoader
