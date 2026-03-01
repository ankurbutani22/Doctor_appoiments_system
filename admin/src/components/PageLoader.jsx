import React from 'react'

const variants = {
  dashboard: {
    icon: '📊',
    ringClass: 'border-purple-200 border-t-purple-600',
  },
  doctors: {
    icon: '🧑‍⚕️',
    ringClass: 'border-blue-200 border-t-blue-600',
  },
  patients: {
    icon: '👥',
    ringClass: 'border-sky-200 border-t-sky-500',
  },
  appointments: {
    icon: '📅',
    ringClass: 'border-indigo-200 border-t-indigo-600',
  },
  default: {
    icon: '⏳',
    ringClass: 'border-blue-200 border-t-blue-600',
  },
}

const PageLoader = ({ label = 'Loading...', variant = 'default' }) => {
  const config = variants[variant] || variants.default

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className={`h-10 w-10 border-4 rounded-full animate-spin ${config.ringClass}`} />
      <p className="mt-3 text-sm font-medium text-gray-600 flex items-center gap-2">
        <span>{config.icon}</span>
        <span>{label}</span>
      </p>
    </div>
  )
}

export default PageLoader
