import React from 'react'
import { assets } from '../assets/assets'

const AdminLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-100">
      <div className="relative flex flex-col items-center gap-4">
        <div className="absolute inset-[-40px] rounded-full bg-blue-600/5 blur-3xl animate-pulse" />

        <div className="relative flex items-center justify-center">
          <div className="h-32 w-32 rounded-2xl bg-white shadow-2xl flex items-center justify-center border border-blue-100 overflow-hidden">
            <img
              src={assets.admin_logo}
              alt="Admin Loading"
              className="h-20 w-20 object-contain animate-bounce"
            />
          </div>
          <div className="absolute h-44 w-44 rounded-2xl border-2 border-indigo-300/70 animate-[spin_2.4s_linear_infinite]" />
          <div className="absolute h-52 w-52 rounded-2xl border-2 border-dashed border-sky-400/70 animate-[spin_3.8s_linear_infinite_reverse]" />
        </div>

        <div className="text-center">
          <p className="text-base md:text-lg font-semibold text-gray-700 tracking-wide">
            Loading admin control panel
          </p>
          <p className="mt-1 text-xs md:text-sm text-gray-400">
            Syncing doctors, patients and appointments...
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminLoader
