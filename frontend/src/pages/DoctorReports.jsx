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
        <div className="mt-6 space-y-3">
          {/* Table header */}
          <div className="hidden md:grid grid-cols-[2fr_1.6fr_2.2fr_1.4fr] px-6 py-3 rounded-2xl bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500 shadow-sm">
            <p>Patient</p>
            <p>Date &amp; Time</p>
            <p>Report file</p>
            <p className="text-right">Actions</p>
          </div>

          {completedAppointments.slice().reverse().map((item, index) => (
            <div
              key={item._id || index}
              className="flex flex-col md:grid md:grid-cols-[2fr_1.6fr_2.2fr_1.4fr] gap-4 items-center px-6 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-150"
            >
              {/* Patient */}
              <div className="flex items-center gap-3 w-full">
                <img className="w-11 h-11 rounded-full object-cover bg-indigo-50 ring-2 ring-slate-100" src={item.userData?.image} alt="" />
                <div className="leading-tight">
                  <p className="font-semibold text-slate-900">{item.userData?.name}</p>
                  <p className="text-[11px] text-slate-400">#{index + 1}</p>
                </div>
              </div>

              {/* Date & Time */}
              <div className="w-full text-[13px] text-slate-700">
                <p className="font-medium">
                  {slotDateFormat ? slotDateFormat(item.slotDate) : item.slotDate}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">{item.slotTime}</p>
              </div>

              {/* Report upload / view */}
              <div className="w-full flex flex-col md:flex-row md:items-center gap-2">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handleFileChange(item._id, e.target.files[0])}
                  className="block w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-800 hover:file:bg-slate-200 cursor-pointer"
                />
                <button
                  onClick={() => handleUpload(item._id)}
                  disabled={uploadingId === item._id}
                  className="inline-flex items-center justify-center px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                >
                  {uploadingId === item._id ? 'Uploading...' : (item.reportUrl ? 'Update Report' : 'Upload Report')}
                </button>
              </div>

              {/* Status / view link */}
              <div className="w-full flex md:justify-end gap-2 text-[11px]">
                {item.reportUrl ? (
                  <>
                    <button
                      type="button"
                      onClick={() => viewReport(item._id)}
                      className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-full border border-emerald-500 text-emerald-600 bg-emerald-50/40 hover:bg-emerald-50"
                    >
                      <span>View</span>
                      <span>↗</span>
                    </button>
                    <button
                      onClick={() => deleteReport(item._id)}
                      className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-full border border-red-400 text-red-500 bg-red-50/40 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 text-slate-400 self-center">
                    <span className="text-[8px]">●</span>
                    No report uploaded
                  </span>
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
