import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../context/DoctorContext'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import PageLoader from '../components/PageLoader'

const DoctorReports = () => {
  const { dToken, appointments, getAppointments, loadingAppointments, uploadReport, deleteReport, viewReport } = useContext(DoctorContext)
  const { slotDateFormat } = useContext(AppContext)

  const [files, setFiles] = useState({})
  const [uploadingId, setUploadingId] = useState(null)

  useEffect(() => {
    if (dToken) {
      getAppointments()
    }
  }, [dToken])

  const handleFileChange = (appointmentId, file) => {
    setFiles(prev => ({ ...prev, [appointmentId]: file }))
  }

  const handleUpload = async (appointmentId) => {
    const file = files[appointmentId]
    if (!file) {
      toast.error('Please select a PDF report file first')
      return
    }

    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed')
      return
    }

    try {
      setUploadingId(appointmentId)
      await uploadReport(appointmentId, file)
      setUploadingId(null)
    } catch (e) {
      setUploadingId(null)
    }
  }

  const completedAppointments = appointments.filter(item => item.isCompleted && !item.cancelled)

  if (loadingAppointments && appointments.length === 0) {
    return <PageLoader label="Loading completed appointments..." variant="appointments" />
  }

  return (
    <div className="mt-6 md:mt-10">
      <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-1">Reports</h1>
      <p className="text-sm text-gray-500 mb-4">Upload PDF reports for your completed appointments. Patients will be able to view these reports in their appointments list.</p>

      {completedAppointments.length === 0 ? (
        <div className="mt-6 p-6 rounded-2xl border border-dashed border-gray-300 text-center text-sm text-gray-500 bg-gray-50/60">
          No completed appointments available for reports yet.
        </div>
      ) : (
        <div className="mt-4 border rounded-2xl overflow-hidden bg-white">
          <div className="grid grid-cols-[1.6fr_1.3fr_1.8fr_1.3fr] gap-3 px-5 py-3 bg-gray-50 text-[11px] font-semibold uppercase tracking-wide text-gray-500 max-md:hidden">
            <p>Patient</p>
            <p>Date &amp; Time</p>
            <p>Report</p>
            <p className="text-right">Status</p>
          </div>

          {completedAppointments.slice().reverse().map((item, index) => (
            <div
              key={item._id || index}
              className="flex flex-col md:grid md:grid-cols-[1.6fr_1.3fr_1.8fr_1.3fr] gap-3 items-center px-5 py-4 border-t first:border-t-0 text-sm text-gray-700 hover:bg-gray-50/70 transition-colors"
            >
              {/* Patient */}
              <div className="flex items-center gap-3 w-full">
                <img className="w-10 h-10 rounded-full object-cover bg-indigo-50" src={item.userData?.image} alt="" />
                <div className="leading-tight">
                  <p className="font-medium text-gray-900">{item.userData?.name}</p>
                  <p className="text-[11px] text-gray-400">#{index + 1}</p>
                </div>
              </div>

              {/* Date & Time */}
              <div className="w-full text-[13px] text-gray-700">
                <p>{slotDateFormat ? slotDateFormat(item.slotDate) : item.slotDate}, {item.slotTime}</p>
              </div>

              {/* Report upload / view */}
              <div className="w-full flex flex-col md:flex-row md:items-center gap-2">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handleFileChange(item._id, e.target.files[0])}
                  className="block w-full text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 cursor-pointer"
                />
                <button
                  onClick={() => handleUpload(item._id)}
                  disabled={uploadingId === item._id}
                  className="inline-flex items-center justify-center px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {uploadingId === item._id ? 'Uploading...' : (item.reportUrl ? 'Update Report' : 'Upload Report')}
                </button>
              </div>

              {/* Status / view link */}
              <div className="w-full flex md:justify-end gap-2 text-xs">
                {item.reportUrl ? (
                  <>
                    <button
                      type="button"
                      onClick={() => viewReport(item._id)}
                      className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-full border border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                    >
                      <span>View</span>
                      <span>↗</span>
                    </button>
                    <button
                      onClick={() => deleteReport(item._id)}
                      className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-full border border-red-400 text-red-500 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <span className="text-gray-400 self-center">No report uploaded</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DoctorReports
