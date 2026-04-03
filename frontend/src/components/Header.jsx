import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
  return (
    <div className='flex flex-col md:flex-row flex-wrap bg-blue-600 rounded-lg px-4 py-10 sm:px-6 sm:py-14 md:px-10 lg:px-20 md:py-16 gap-6 md:gap-0'>
      {/* leftside */}
      <div className='w-full md:w-1/2 flex flex-col items-center md:items-start justify-center gap-4 m-auto md:mb-[-30px] text-center md:text-left'>
        <p className='text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight'>
          Book Appoinments <br className='hidden sm:block' />
          With Trusted Doctor
        </p>
        <div className='flex flex-col sm:flex-row items-center sm:items-start gap-3 text-white text-sm font-light'>
          <img className='w-24 sm:w-28' src={assets.group_profiles} alt="Patients group" />
          <p className='max-w-md'>
            Simply browse through our extensive list of trusted doctors,
            schedule your appointment hassle-free.
          </p>
        </div>
        <a
          href='#speciality'
          className='inline-flex items-center justify-center gap-2 bg-white px-7 py-3 rounded-full text-gray-700 text-sm mt-2 hover:scale-105 transition-all duration-300 shadow-sm'
        >
          Book Appoinments
          <img className='w-3' src={assets.arrow_icon} alt='Go to specialities' />
        </a>
      </div>
      {/* rightside */}
      <div className='w-full md:w-1/2 relative mt-6 md:mt-0'>
        <img
          className='w-full h-auto rounded-lg md:absolute md:bottom-0 md:right-0 md:max-w-[460px] object-cover'
          src={assets.header_img}
          alt='Doctor illustration'
        />
      </div>
    </div>
  )
}

export default Header
