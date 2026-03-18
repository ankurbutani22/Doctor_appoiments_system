import React, { useState, useEffect, useContext } from 'react'
import { assets } from '../assets/assets.js'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { AppContext } from '../context/AppContext.jsx'
import { DoctorContext } from '../context/DoctorContext.jsx'
import axios from 'axios'
import { toast } from 'react-toastify'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { token, setToken, userData, backendUrl } = useContext(AppContext)
  const { dToken, setDToken, profileData, getProfileData } = useContext(DoctorContext)

  const [profileSheet, setProfileSheet] = useState(false)
  const [userCoins, setUserCoins] = useState(0)
  const [showCoinModal, setShowCoinModal] = useState(false)
  const [coinAmount, setCoinAmount] = useState('100')
  const [addingCoins, setAddingCoins] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])

  const logout = () => {
    if (token) { setToken(false); localStorage.removeItem('token') }
    if (dToken) { setDToken(false); localStorage.removeItem('dToken') }
    navigate('/Login')
    setProfileSheet(false)
  }

  const getUserCoins = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/coin/balance', { headers: { token } })
      if (data.success) setUserCoins(data.coins)
    } catch (e) { console.log(e) }
  }

  useEffect(() => { if (token) getUserCoins() }, [token])

  const handleOpenCoinModal = (e) => {
    e.stopPropagation()
    if (!token || dToken) return
    setShowCoinModal(true)
  }

  const handleAddCoins = async () => {
    if (!token || dToken) return

    const amount = Number(coinAmount)
    if (!amount || amount <= 0) {
      toast.error('Enter a valid coin amount')
      return
    }

    try {
      setAddingCoins(true)
      const { data } = await axios.post(
        backendUrl + '/api/coin/add',
        { amount },
        { headers: { token } }
      )

      if (data.success) {
        setUserCoins(data.coins)
        toast.success(data.message || 'Coins added successfully')
        setShowCoinModal(false)
      } else {
        toast.error(data.message || 'Failed to add coins')
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message || 'Failed to add coins')
    } finally {
      setAddingCoins(false)
    }
  }

  const fetchNotifications = async () => {
    try {
      if (token && !dToken) {
        const { data } = await axios.get(backendUrl + '/api/user/notifications', { headers: { token } })
        if (data.success) setNotifications(data.notifications || [])
      } else if (dToken) {
        const { data } = await axios.get(backendUrl + '/api/doctor/notifications', { headers: { dtoken: dToken } })
        if (data.success) setNotifications(data.notifications || [])
      } else {
        setNotifications([])
      }
    } catch (error) {
      console.log('Notification fetch error:', error.message)
    }
  }

  const markNotificationsRead = async () => {
    try {
      if (token && !dToken) {
        await axios.post(backendUrl + '/api/user/notifications/mark-read', {}, { headers: { token } })
      } else if (dToken) {
        await axios.post(backendUrl + '/api/doctor/notifications/mark-read', {}, { headers: { dtoken: dToken } })
      }
    } catch (error) {
      console.log('Notification mark-read error:', error.message)
    }
  }

  // Load doctor profile data when a doctor is logged in so we can
  // show the correct profile image in the navbar.
  useEffect(() => {
    if (dToken) {
      getProfileData()
    }
  }, [dToken, getProfileData])

  // Load notifications whenever auth state changes
  useEffect(() => {
    if (token || dToken) {
      fetchNotifications()
    } else {
      setNotifications([])
    }
  }, [token, dToken])

  const unreadCount = notifications.filter(n => !n.isRead).length

  /* ── nav link definitions ── */
  const desktopLinks = dToken
    ? [
      { to: '/doctor-dashboard', label: 'DASHBOARD' },
      { to: '/doctor-appointments', label: 'APPOINTMENTS' },
      { to: '/doctor-medicines', label: 'MEDICINES' },
      { to: '/doctor-reports', label: 'REPORTS' },
    ]
    : [
      { to: '/', label: 'HOME' },
      { to: '/doctors', label: 'ALL DOCTORS' },
      ...(token ? [
        { to: '/my-appointments', label: 'APPOINTMENTS' },
        { to: '/my-medicines', label: 'MEDICINES' },
        { to: '/my-reports', label: 'REPORTS' },
      ] : []),
      { to: '/Contect', label: 'CONTACT' },
    ]

  const mobileLinks = dToken
    ? [
      { to: '/doctor-dashboard', label: 'Dashboard', icon: '🏠' },
      { to: '/doctor-appointments', label: 'Appointments', icon: '📅' },
      { to: '/doctor-medicines', label: 'Medicines', icon: '💊' },
      { to: '/doctor-reports', label: 'Reports', icon: '📄' },
      { to: '/doctor-profile', label: 'Profile', icon: '👤' },
    ]
    : token
      ? [
        { to: '/', label: 'Home', icon: '🏠' },
        { to: '/doctors', label: 'Doctors', icon: '🩺' },
        { to: '/my-appointments', label: 'Appointments', icon: '📅' },
        { to: '/my-medicines', label: 'Medicines', icon: '💊' },
        { to: '/my-reports', label: 'Reports', icon: '📄' },
        { to: '/my-profile', label: 'Profile', icon: '👤' },
      ]
      : [
        { to: '/', label: 'Home', icon: '🏠' },
        { to: '/doctors', label: 'Doctors', icon: '🩺' },
        { to: '/Login', label: 'Login', icon: '🔑' },
      ]

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  return (
    <>
      {/* ══════════════════════════════════════════
          DESKTOP — sticky top navbar (md and above)
      ══════════════════════════════════════════ */}
      <nav className="hidden md:flex items-center justify-between text-sm py-4 border-b border-gray-300 sticky top-0 bg-white z-40">
        <img onClick={() => navigate('/')} className="w-36 cursor-pointer" src={assets.logo} alt="Logo" />

        <ul className="flex gap-6 items-center font-medium text-gray-600">
          {desktopLinks.map(l => (
            <NavLink key={l.to} to={l.to} className="group">
              <li className="hover:text-primary transition-colors">{l.label}</li>
              <hr className="border-none h-0.5 bg-primary w-3/5 mx-auto hidden group-[.active]:block" />
            </NavLink>
          ))}
        </ul>

            <div className="flex items-center gap-3">
              {(token || dToken) && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      const next = !showNotifications
                      setShowNotifications(next)
                      if (next && notifications.length > 0) {
                        markNotificationsRead()
                      }
                    }}
                    className="relative flex items-center justify-center w-9 h-9 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    <span>🔔</span>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] leading-none px-1.5 py-0.5 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border rounded-xl shadow-2xl z-50 text-xs">
                      <div className="px-3 py-2 border-b font-semibold text-gray-700 flex items-center justify-between">
                        <span>Notifications</span>
                        {unreadCount > 0 && (
                          <span className="text-[10px] text-gray-400">{unreadCount} new</span>
                        )}
                      </div>
                      <div className="max-h-64 overflow-y-auto p-2">
                        {notifications.length === 0 ? (
                          <p className="text-gray-500 text-xs px-2 py-3 text-center">No new notifications</p>
                        ) : (
                          notifications.map((n, idx) => (
                            <div key={idx} className="px-2 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
                              <p className="text-xs font-medium">{n.title}</p>
                              {n.message && <p className="text-[11px] text-gray-500 mt-0.5">{n.message}</p>}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
          {token && userData ? (
            <div className="flex items-center gap-3">
              {/* Coin pill - its own click target, NOT part of the profile dropdown group */}
              <div
                className="relative z-50 flex items-center gap-1.5 bg-linear-to-r from-yellow-400 to-orange-500 px-3 py-1.5 rounded-full text-white font-bold text-sm shadow cursor-pointer"
                onClick={handleOpenCoinModal}
                title="Click to add coins"
              >
                🪙 {userCoins}
              </div>

              {/* Profile dropdown - hover only on avatar/caret */}
              <div className="relative group z-40">
                <div className="flex items-center gap-2 cursor-pointer">
                  <img
                    className="w-10 h-10 rounded-full border-2 border-primary object-cover"
                    src={(userData.image && userData.image.length > 500) ? assets.profile_pic : (userData.image || assets.profile_pic)}
                    alt="Profile"
                  />
                  <img className="w-2.5" src={assets.dropdown_icon} alt="" />
                </div>
                <div className="absolute right-0 top-full pt-4 z-40 hidden group-hover:block">
                  <div className="min-w-48 bg-white border rounded-xl shadow-2xl overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b">
                      <p className="font-bold text-gray-800">{userData.name}</p>
                      <p className="text-xs text-gray-500">🪙 {userCoins} coins</p>
                    </div>
                    <div className="p-2 flex flex-col text-sm text-gray-600">
                      <p onClick={() => navigate('my-profile')} className="hover:bg-blue-50 hover:text-blue-600 cursor-pointer px-3 py-2 rounded-lg flex items-center gap-2">👤 My Profile</p>
                      <p onClick={() => navigate('/my-appointments')} className="hover:bg-blue-50 hover:text-blue-600 cursor-pointer px-3 py-2 rounded-lg flex items-center gap-2">📅 My Appointments</p>
                      <hr className="my-1 border-gray-100" />
                      <p onClick={logout} className="hover:bg-red-50 hover:text-red-600 cursor-pointer px-3 py-2 rounded-lg flex items-center gap-2">🚪 Logout</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : dToken ? (
            <div className="relative group flex items-center gap-2 cursor-pointer">
              <img
                className="w-10 h-10 rounded-full border-2 border-primary object-cover"
                src={profileData?.image || assets.profile_pic}
                alt="Doctor profile"
              />
              <img className="w-2.5" src={assets.dropdown_icon} alt="" />
              <div className="absolute right-0 top-full pt-4 z-50 hidden group-hover:block">
                <div className="min-w-48 bg-white border rounded-xl shadow-2xl p-2 text-sm text-gray-600 flex flex-col gap-1">
                  <p onClick={() => navigate('doctor-profile')} className="hover:bg-blue-50 hover:text-blue-600 cursor-pointer px-3 py-2 rounded-lg">👤 My Profile</p>
                  <p onClick={() => navigate('doctor-dashboard')} className="hover:bg-blue-50 hover:text-blue-600 cursor-pointer px-3 py-2 rounded-lg">🏠 Dashboard</p>
                  <hr className="my-1 border-gray-100" />
                  <p onClick={logout} className="hover:bg-red-50 hover:text-red-600 cursor-pointer px-3 py-2 rounded-lg">🚪 Logout</p>
                </div>
              </div>
            </div>
          ) : (
            <button onClick={() => navigate('Login')} className="bg-blue-600 text-white px-7 py-2.5 rounded-full text-sm font-medium shadow hover:bg-blue-700 transition-all">
              Login / Sign Up
            </button>
          )}
        </div>
      </nav>

      {/* ══════════════════════════════════════════
          MOBILE — fixed top bar
      ══════════════════════════════════════════ */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-md flex items-center justify-between px-4 h-16">
        <img onClick={() => navigate('/')} className="w-32 cursor-pointer" src={assets.logo} alt="Logo" />
        <div className="flex items-center gap-2">
            {(token || dToken) && (
              <button
                type="button"
                onClick={() => {
                  const next = !showNotifications
                  setShowNotifications(next)
                  if (next && notifications.length > 0) {
                    // mark as read in backend but keep them visible locally
                    // so user can see them in this open dropdown
                    markNotificationsRead()
                  }
                }}
                className="relative flex items-center justify-center w-9 h-9 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 mr-1"
              >
                <span>🔔</span>
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] leading-none px-1.5 py-0.5 rounded-full">
                    {notifications.length}
                  </span>
                )}
              </button>
            )}
          {(token && userData) && (
            <span
              className="flex items-center gap-1 bg-linear-to-r from-yellow-400 to-orange-500 px-2.5 py-1 rounded-full text-white text-xs font-bold cursor-pointer"
              onClick={handleOpenCoinModal}
            >
              🪙 {userCoins}
            </span>
          )}
            {token && !dToken && (
              <button
                onClick={() => navigate('/my-appointments')}
                className="text-xs font-semibold text-primary border border-primary px-2.5 py-1 rounded-full mr-1"
              >
                📅 Appointments
              </button>
            )}
          {(token && userData) || dToken ? (
            <img
              onClick={() => setProfileSheet(true)}
              className="w-9 h-9 rounded-full border-2 border-primary object-cover cursor-pointer"
              src={dToken
                ? (profileData?.image || assets.profile_pic)
                : ((userData?.image && userData.image.length > 500)
                    ? assets.profile_pic
                    : (userData?.image || assets.profile_pic))}
              alt="Profile"
            />
          ) : (
            <button onClick={() => navigate('Login')} className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-semibold hover:bg-blue-700">
              Login
            </button>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          MOBILE — notifications overlay (dropdown)
      ══════════════════════════════════════════ */}
      {(token || dToken) && showNotifications && (
        <div
          className="md:hidden fixed inset-0 z-60 bg-black/20"
          onClick={() => setShowNotifications(false)}
        >
          <div
            className="absolute top-20 right-3 left-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white border rounded-2xl shadow-2xl text-xs max-h-72 overflow-hidden">
              <div className="px-3 py-2 border-b font-semibold text-gray-700 flex items-center justify-between">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-[10px] text-gray-400">{unreadCount} new</span>
                )}
                <button
                  type="button"
                  className="ml-2 text-gray-400 hover:text-gray-600 text-xs font-bold"
                  onClick={() => setShowNotifications(false)}
                >
                  ✕
                </button>
              </div>
              <div className="max-h-60 overflow-y-auto p-2">
                {notifications.length === 0 ? (
                  <p className="text-gray-500 text-xs px-2 py-3 text-center">No new notifications</p>
                ) : (
                  notifications.map((n, idx) => (
                    <div key={idx} className="px-2 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
                      <p className="text-xs font-medium">{n.title}</p>
                      {n.message && <p className="text-[11px] text-gray-500 mt-0.5">{n.message}</p>}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Profile bottom sheet (mobile) ── */}
      {profileSheet && (
        <div className="md:hidden fixed inset-0 z-60 bg-black/50" onClick={() => setProfileSheet(false)}>
          <div
            className="fixed bottom-[72px] left-3 right-3 bg-white rounded-3xl shadow-2xl overflow-hidden animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-linear-to-r from-primary to-blue-600 p-5 flex items-center gap-3">
              <img
                className="w-14 h-14 rounded-full border-2 border-white object-cover"
                src={dToken
                  ? (profileData?.image || assets.profile_pic)
                  : ((userData?.image && userData.image.length > 500)
                      ? assets.profile_pic
                      : (userData?.image || assets.profile_pic))}
                alt="Profile"
              />
              <div>
                <p className="font-bold text-white text-base">{dToken ? 'Doctor' : userData?.name}</p>
                {token && <p className="text-white/80 text-xs">🪙 {userCoins} coins</p>}
              </div>
              <button onClick={() => setProfileSheet(false)} className="ml-auto text-white/80 hover:text-white text-xl font-bold">✕</button>
            </div>
            {/* Options */}
            <div className="p-4 flex flex-col gap-2">
              {token && !dToken && (
                <>
                  <button onClick={() => { navigate('my-profile'); setProfileSheet(false) }} className="w-full text-left py-3 px-4 bg-gray-50 rounded-2xl flex items-center gap-3 font-medium text-gray-700">
                    <span className="text-xl">👤</span> My Profile
                  </button>
                  <button onClick={() => { navigate('/my-appointments'); setProfileSheet(false) }} className="w-full text-left py-3 px-4 bg-gray-50 rounded-2xl flex items-center gap-3 font-medium text-gray-700">
                    <span className="text-xl">📅</span> My Appointments
                  </button>
                </>
              )}
              {dToken && (
                <button onClick={() => { navigate('doctor-profile'); setProfileSheet(false) }} className="w-full text-left py-3 px-4 bg-gray-50 rounded-2xl flex items-center gap-3 font-medium text-gray-700">
                  <span className="text-xl">👤</span> My Profile
                </button>
              )}
              <button onClick={logout} className="w-full text-left py-3 px-4 bg-red-50 rounded-2xl flex items-center gap-3 font-medium text-red-600">
                <span className="text-xl">🚪</span> Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          MOBILE — fixed bottom navigation bar
          (raised slightly for phone safe-area)
      ══════════════════════════════════════════ */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.12)] pb-1"
        style={{ height: 68, paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div
          className="h-full grid"
          style={{ gridTemplateColumns: `repeat(${mobileLinks.length}, 1fr)` }}
        >
          {mobileLinks.map(link => {
            const active = isActive(link.to)
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className="flex flex-col items-center justify-center gap-1 relative"
              >
                {active && (
                  <span className="absolute top-0 inset-x-4 h-1 bg-primary rounded-b-full" />
                )}
                <span className={`text-[24px] leading-none transition-transform duration-200 ${active ? 'scale-110' : 'scale-100'}`}>
                  {link.icon}
                </span>
                <span className={`text-[11px] font-semibold tracking-tight ${active ? 'text-primary' : 'text-gray-500'}`}>
                  {link.label}
                </span>
              </NavLink>
            )
          })}
        </div>
      </nav>

      {/* ── Add Coins Modal ── */}
      {showCoinModal && token && !dToken && (
        <div
          className="fixed inset-0 z-70 bg-black/50 flex items-center justify-center px-4"
          onClick={() => !addingCoins && setShowCoinModal(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Add Coins</h2>
              <button
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                onClick={() => !addingCoins && setShowCoinModal(false)}
              >
                ×
              </button>
            </div>
            <p className="text-sm text-gray-500">
              Current balance: <span className="font-semibold text-gray-800">🪙 {userCoins}</span>
            </p>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Coins to add</label>
              <input
                type="number"
                min="1"
                value={coinAmount}
                onChange={(e) => setCoinAmount(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                placeholder="Enter coins (e.g. 100)"
              />
            </div>
            <button
              onClick={handleAddCoins}
              disabled={addingCoins}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {addingCoins ? 'Adding...' : 'Add Coins'}
            </button>
            <p className="text-[11px] text-gray-400 text-center">
              This is a demo coin wallet. No real payment is processed.
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar
