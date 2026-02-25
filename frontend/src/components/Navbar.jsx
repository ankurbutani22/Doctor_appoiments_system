import React, { useState, useEffect, useContext } from 'react'
import { assets } from '../assets/assets.js'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { AppContext } from '../context/AppContext.jsx'
import { DoctorContext } from '../context/DoctorContext.jsx'
import axios from 'axios'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { token, setToken, userData, backendUrl } = useContext(AppContext)
  const { dToken, setDToken } = useContext(DoctorContext)

  const [profileSheet, setProfileSheet] = useState(false)
  const [userCoins, setUserCoins] = useState(0)

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

  /* ── nav link definitions ── */
  const desktopLinks = dToken
    ? [
      { to: '/doctor-dashboard', label: 'DASHBOARD' },
      { to: '/doctor-appointments', label: 'APPOINTMENTS' },
      { to: '/doctor-medicines', label: 'MEDICINES' },
    ]
    : [
      { to: '/', label: 'HOME' },
      { to: '/doctors', label: 'ALL DOCTORS' },
      ...(token ? [{ to: '/my-medicines', label: 'MEDICINES' }] : []),
      { to: '/about', label: 'ABOUT' },
      { to: '/Contect', label: 'CONTACT' },
    ]

  const mobileLinks = dToken
    ? [
      { to: '/doctor-dashboard', label: 'Dashboard', icon: '🏠' },
      { to: '/doctor-appointments', label: 'Appointments', icon: '📅' },
      { to: '/doctor-medicines', label: 'Medicines', icon: '💊' },
      { to: '/doctor-profile', label: 'Profile', icon: '👤' },
    ]
    : token
      ? [
        { to: '/', label: 'Home', icon: '🏠' },
        { to: '/doctors', label: 'Doctors', icon: '🩺' },
        { to: '/my-medicines', label: 'Medicines', icon: '💊' },
        { to: '/my-profile', label: 'Profile', icon: '👤' },
      ]
      : [
        { to: '/', label: 'Home', icon: '🏠' },
        { to: '/doctors', label: 'Doctors', icon: '🩺' },
        { to: '/about', label: 'About', icon: 'ℹ️' },
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
          {token && userData ? (
            <div className="relative group">
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1.5 rounded-full text-white font-bold text-sm shadow">
                  🪙 {userCoins}
                </div>
                <img className="w-10 h-10 rounded-full border-2 border-primary object-cover"
                  src={(userData.image && userData.image.length > 500) ? assets.profile_pic : (userData.image || assets.profile_pic)} alt="" />
                <img className="w-2.5" src={assets.dropdown_icon} alt="" />
              </div>
              <div className="absolute right-0 top-full pt-4 z-50 hidden group-hover:block">
                <div className="min-w-48 bg-white border rounded-xl shadow-2xl overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b">
                    <p className="font-bold text-gray-800">{userData.name}</p>
                    <p className="text-xs text-gray-500">🪙 {userCoins} coins</p>
                  </div>
                  <div className="p-2 flex flex-col text-sm text-gray-600">
                    <p onClick={() => navigate('my-profile')} className="hover:bg-blue-50 hover:text-blue-600 cursor-pointer px-3 py-2 rounded-lg flex items-center gap-2">👤 My Profile</p>
                    <p onClick={() => navigate('My-Appointments')} className="hover:bg-blue-50 hover:text-blue-600 cursor-pointer px-3 py-2 rounded-lg flex items-center gap-2">📅 My Appointments</p>
                    <hr className="my-1 border-gray-100" />
                    <p onClick={logout} className="hover:bg-red-50 hover:text-red-600 cursor-pointer px-3 py-2 rounded-lg flex items-center gap-2">🚪 Logout</p>
                  </div>
                </div>
              </div>
            </div>
          ) : dToken ? (
            <div className="relative group flex items-center gap-2 cursor-pointer">
              <img className="w-10 h-10 rounded-full border-2 border-primary" src={assets.profile_pic} alt="" />
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
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-4 h-14">
        <img onClick={() => navigate('/')} className="w-28 cursor-pointer" src={assets.logo} alt="Logo" />
        <div className="flex items-center gap-2">
          {(token && userData) && (
            <span className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 px-2.5 py-1 rounded-full text-white text-xs font-bold">
              🪙 {userCoins}
            </span>
          )}
          {(token && userData) || dToken ? (
            <img
              onClick={() => setProfileSheet(true)}
              className="w-9 h-9 rounded-full border-2 border-primary object-cover cursor-pointer"
              src={dToken ? assets.profile_pic : ((userData?.image && userData.image.length > 500) ? assets.profile_pic : (userData?.image || assets.profile_pic))}
              alt="Profile"
            />
          ) : (
            <button onClick={() => navigate('Login')} className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-semibold hover:bg-blue-700">
              Login
            </button>
          )}
        </div>
      </div>

      {/* ── Profile bottom sheet (mobile) ── */}
      {profileSheet && (
        <div className="md:hidden fixed inset-0 z-[60] bg-black/50" onClick={() => setProfileSheet(false)}>
          <div
            className="fixed bottom-[64px] left-3 right-3 bg-white rounded-3xl shadow-2xl overflow-hidden animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-blue-600 p-5 flex items-center gap-3">
              <img
                className="w-14 h-14 rounded-full border-2 border-white object-cover"
                src={dToken ? assets.profile_pic : ((userData?.image && userData.image.length > 500) ? assets.profile_pic : (userData?.image || assets.profile_pic))}
                alt=""
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
                  <button onClick={() => { navigate('My-Appointments'); setProfileSheet(false) }} className="w-full text-left py-3 px-4 bg-gray-50 rounded-2xl flex items-center gap-3 font-medium text-gray-700">
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
      ══════════════════════════════════════════ */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-2px_16px_rgba(0,0,0,0.08)]" style={{ height: 64 }}>
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
                className="flex flex-col items-center justify-center gap-0.5 relative"
              >
                {active && (
                  <span className="absolute top-0 inset-x-4 h-[3px] bg-primary rounded-b-full" />
                )}
                <span className={`text-[22px] leading-none transition-transform duration-200 ${active ? 'scale-110' : 'scale-100'}`}>
                  {link.icon}
                </span>
                <span className={`text-[10px] font-semibold tracking-tight ${active ? 'text-primary' : 'text-gray-400'}`}>
                  {link.label}
                </span>
              </NavLink>
            )
          })}
        </div>
      </nav>
    </>
  )
}

export default Navbar
