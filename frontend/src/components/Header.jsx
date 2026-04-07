import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
  return (
    <div className='max-w-4xl mx-auto mt-10 flex flex-col md:flex-row items-center bg-blue-600 rounded-3xl px-4 py-8 sm:px-10 sm:py-10 md:px-12 md:py-12 gap-8 shadow-xl'>
      {/* left side */}
      <div className='w-full md:w-1/2 flex flex-col items-center md:items-start justify-center gap-5 m-auto text-center md:text-left max-w-xl'>
        <p className='text-[26px] sm:text-3xl md:text-4xl lg:text-[42px] text-white font-semibold leading-tight'>
          Book Appoinments <br className='hidden sm:block' />
          With Trusted Doctor
        </p>
        <div className='flex flex-col sm:flex-row items-center sm:items-start gap-3 text-white text-sm font-light'>
          <img className='w-24 sm:w-28' src={assets.group_profiles} alt="Patients group" />
          <p className='max-w-md'>
            Simply browse through our extensive list of trusted doctors and
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

      {/* right side */}
      <div className='w-full md:w-1/2 flex justify-center md:justify-end mt-6 md:mt-0'>
        <img
          className='w-full max-w-[260px] sm:max-w-sm md:max-w-[320px] rounded-2xl object-cover drop-shadow-xl'
          src={assets.header_img}
          alt='Doctor illustration'
        />
      </div>
    </div>
  )
}

export default Header
