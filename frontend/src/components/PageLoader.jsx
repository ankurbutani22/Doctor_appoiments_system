import React from 'react'

const PageLoader = ({ label = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-primary">
      <div className="h-10 w-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      <p className="mt-3 text-sm font-medium text-gray-600">{label}</p>
    </div>
  )
}

export default PageLoader
