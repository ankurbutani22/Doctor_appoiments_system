import React from 'react'

const DoctorLoader = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-10 text-center">
      <div className="relative w-20 h-20 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
        <div className="absolute inset-2 rounded-full bg-blue-50 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-blue-400/90" />
        </div>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-14 h-8 bg-blue-500/90 rounded-t-full" />
      </div>
      <div className="flex items-center gap-2 text-blue-600 mb-1">
        <span className="inline-block w-5 h-[2px] bg-blue-500 animate-pulse" />
        <span className="text-sm font-semibold tracking-wide uppercase">Loading doctors</span>
        <span className="inline-block w-5 h-[2px] bg-blue-500 animate-pulse" />
      </div>
      <p className="text-xs text-gray-500 max-w-xs">
        Please wait a moment while we check available doctors for you.
      </p>
    </div>
  )
}

export default DoctorLoader
