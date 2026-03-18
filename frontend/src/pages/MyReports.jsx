import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'
import PageLoader from '../components/PageLoader'

const MyReports = () => {
  const { backendUrl, token } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const slotDateFormatter = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + ' ' + months[Number(dateArray[1])] + ' ' + dateArray[2]
  }

  const fetchAppointments = async () => {
    try {
      setIsLoading(true)
      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
      if (data.success) {
        setAppointments(data.appointments.reverse())
      }
    } catch (error) {
      console.log(error)
      toast.error('Failed to load reports')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchAppointments()
    }
  }, [token])

  const reportAppointments = appointments.filter(
    (item) => item.isCompleted && !item.cancelled && item.reportUrl
  )

  if (isLoading && appointments.length === 0) {
    return <PageLoader label="Loading your reports..." variant="appointments" />
  }

  return (
    <div className="mt-6 md:mt-10">
      <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-1">My Reports</h1>
      <p className="text-sm text-gray-500 mb-4">
        Here you can view all medical reports uploaded by your doctors for your completed appointments.
      </p>

      {reportAppointments.length === 0 ? (
        <div className="mt-6 p-6 rounded-2xl border border-dashed border-gray-300 text-center text-sm text-gray-500 bg-gray-50/60">
          No reports available yet. Once your doctor uploads a report for a completed appointment, it will appear here.
        </div>
      ) : (
        <div className="mt-4 border rounded-2xl overflow-hidden bg-white">
          <div className="grid grid-cols-[1.8fr_1.4fr_1.5fr] gap-3 px-5 py-3 bg-gray-50 text-[11px] font-semibold uppercase tracking-wide text-gray-500 max-md:hidden">
            <p>Doctor</p>
            <p>Date &amp; Time</p>
            <p className="text-right">Report</p>
          </div>

          {reportAppointments.map((item, index) => (
            <div
              key={item._id || index}
              className="flex flex-col md:grid md:grid-cols-[1.8fr_1.4fr_1.5fr] gap-3 items-center px-5 py-4 border-t first:border-t-0 text-sm text-gray-700 hover:bg-gray-50/70 transition-colors"
            >
              {/* Doctor */}
              <div className="flex items-center gap-3 w-full">
                <img
                  className="w-10 h-10 rounded-full object-cover bg-indigo-50"
                  src={item.docData?.image}
                  alt="Doctor"
                />
                <div className="leading-tight">
                  <p className="font-medium text-gray-900">{item.docData?.name}</p>
                  <p className="text-[11px] text-gray-400">{item.docData?.speciality}</p>
                </div>
              </div>

              {/* Date & Time */}
              <div className="w-full text-[13px] text-gray-700">
                <p>
                  {slotDateFormatter(item.slotDate)} | {item.slotTime}
                </p>
              </div>

              {/* Report link */}
              <div className="w-full text-right text-xs">
                <a
                  href={item.reportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-end gap-1 text-emerald-600 hover:text-emerald-700"
                >
                  <span>View Report (PDF)</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyReports
