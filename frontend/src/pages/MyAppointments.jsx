import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import PageLoader from '../components/PageLoader'


const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [userCoins, setUserCoins] = useState(1000)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false)
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const slotDateFormatter = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
  }
  const getuserAppointments = async () => {
    try {
      setIsLoadingAppointments(true)
      // API કોલ બેકએન્ડ રૂટ મુજબ બરાબર છે
      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })

      if (data.success) {
        setAppointments(data.appointments.reverse())
      }
    } catch (error) {
      console.log(error)
      // ટોકન એક્સપાયર હોય તો એરર હેન્ડલિંગ
      if (error.response && error.response.status === 401) {
        toast.error("Session expired. Please login again.")
      } else {
        toast.error(error.message)
      }
    } finally {
      setIsLoadingAppointments(false)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })
      if (data.success) {
        toast.success(data.message)
        getuserAppointments()
        getDoctorsData()
      }
      else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to cancel appointment. Please try again.")
    }
  }

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Appointment Payment',
      description: 'Appointment Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log(response)
        try {
          const { data } = await axios.post(backendUrl + '/api/user/verifyRazorpay', response, { headers: { token } })
          if (data.success) {
            getuserAppointments()
            toast.success(data.message)
          }
        } catch (error) {
          console.log(error)
          toast.error(error.message)
        }
      }
    }
    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/payment-razorpay', { appointmentId }, { headers: { token } })
      if (data.success) {
        initPay(data.order)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  // Get user's coin balance
  const getUserCoins = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/coin/balance', { headers: { token } })
      if (data.success) {
        setUserCoins(data.coins)
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to fetch coin balance")
    }
  }

  // Open fake payment modal
  const openPaymentModal = (appointment) => {
    setSelectedAppointment(appointment)
    setShowPaymentModal(true)
  }

  // Process fake coin payment
  const processPayment = async () => {
    if (!selectedAppointment) return

    setIsProcessing(true)

    // Simulate payment processing delay
    setTimeout(async () => {
      try {
        const { data } = await axios.post(
          backendUrl + '/api/coin/pay',
          { appointmentId: selectedAppointment._id },
          { headers: { token } }
        )

        if (data.success) {
          toast.success(data.message)
          setUserCoins(data.remainingCoins)
          getuserAppointments()
          setShowPaymentModal(false)
          setSelectedAppointment(null)
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        console.log(error)
        toast.error("Payment failed. Please try again.")
      } finally {
        setIsProcessing(false)
      }
    }, 1500) // 1.5 second delay for realism
  }

  useEffect(() => {
    if (token) {
      getuserAppointments()
      getUserCoins()
    }
  }, [token])

  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My appointments</p>
      {isLoadingAppointments && appointments.length === 0 ? (
        <PageLoader label="Loading your appointments..." variant="appointments" />
      ) : (
      <div>
        {appointments.map((item, index) => (
          <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
            <div>
              {/* docData.image લોડ ન થાય તો પ્લેસહોલ્ડર */}
              <img className='w-32 bg-indigo-50' src={item.docData?.image} alt="" />
            </div>
            <div className='flex-1 text-sm text-zinc-600'>
              <p className='text-neutral-800 font-semibold'>{item.docData?.name}</p>
              <p>{item.docData?.speciality}</p>
              <p className='text-zinc-700 font-medium mt-1'>Address:</p>
              <p className='text-xs'>{item.docData?.address?.line1}</p>
              <p className='text-xs'>{item.docData?.address?.line2}</p>
              <p className='text-xs mt-1'>
                <span className='text-sm text-neutral-700 font-medium'>Date & Time: </span>
                {slotDateFormatter(item.slotDate)} | {item.slotTime}
              </p>
            </div>
            <div className='flex flex-col gap-2 justify-end'>
              {!item.cancelled && !item.payment && <button onClick={() => openPaymentModal(item)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-blue-600 hover:text-white transition-all'>Pay Online</button>}
              {!item.cancelled && item.payment && <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'>Paid</button>}
              {!item.cancelled && <button onClick={() => cancelAppointment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all'>Cancel Appointment</button>}
              {item.cancelled && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>Appointment cancelled</button>}

            </div>
          </div>
        ))}
      </div>
      )}

      {/* Fake Payment Modal */}
      {showPaymentModal && selectedAppointment && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50' onClick={() => !isProcessing && setShowPaymentModal(false)}>
          <div className='bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 overflow-hidden' onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className='bg-linear-to-r from-blue-500 to-blue-600 text-white p-6'>
              <h2 className='text-2xl font-bold mb-2'>💳 Secure Payment</h2>
              <p className='text-blue-100 text-sm'>Complete your appointment payment</p>
            </div>

            {/* Content */}
            <div className='p-6'>
              {/* Appointment Details */}
              <div className='mb-6 bg-gray-50 p-4 rounded-lg'>
                <h3 className='font-semibold text-gray-700 mb-3 flex items-center'>
                  <span className='mr-2'>📋</span>Appointment Details
                </h3>
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Doctor:</span>
                    <span className='font-medium text-gray-800'>{selectedAppointment.docData?.name}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Speciality:</span>
                    <span className='font-medium text-gray-800'>{selectedAppointment.docData?.speciality}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Date & Time:</span>
                    <span className='font-medium text-gray-800'>
                      {slotDateFormatter(selectedAppointment.slotDate)} | {selectedAppointment.slotTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className='mb-6'>
                <div className='flex justify-between items-center mb-4 pb-4 border-b'>
                  <span className='text-gray-700 font-semibold'>Total Amount:</span>
                  <span className='text-2xl font-bold text-blue-600'>
                    🪙 {selectedAppointment.amount} coins
                  </span>
                </div>

                <div className='bg-blue-50 p-4 rounded-lg border border-blue-200'>
                  <div className='flex justify-between items-center'>
                    <span className='text-gray-700'>Your Coin Balance:</span>
                    <span className='text-xl font-bold text-green-600'>
                      🪙 {userCoins} coins
                    </span>
                  </div>
                  {userCoins < selectedAppointment.amount && (
                    <p className='text-red-500 text-sm mt-2 flex items-center'>
                      <span className='mr-1'>⚠️</span>
                      Insufficient balance! You need {selectedAppointment.amount - userCoins} more coins.
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className='flex gap-3'>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  disabled={isProcessing}
                  className='flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Cancel
                </button>
                <button
                  onClick={processPayment}
                  disabled={isProcessing || userCoins < selectedAppointment.amount}
                  className='flex-1 px-4 py-3 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg'
                >
                  {isProcessing ? (
                    <span className='flex items-center justify-center'>
                      <svg className='animate-spin -ml-1 mr-2 h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Pay Now'
                  )}
                </button>
              </div>

              {/* Security Badge */}
              <div className='mt-4 text-center'>
                <p className='text-xs text-gray-500 flex items-center justify-center'>
                  <span className='mr-1'>🔒</span>
                  Secure payment powered by ALPHA Coins
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyAppointments