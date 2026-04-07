import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
  return (
    <div className='max-w-5xl mx-auto mt-10 flex flex-col md:flex-row items-center bg-gradient-to-r from-blue-600 to-blue-500 rounded-3xl px-4 py-8 sm:px-10 sm:py-10 md:px-12 md:py-12 gap-10 shadow-xl'>
      {/* left side */}
      <div className='w-full md:w-1/2 flex flex-col items-center md:items-start justify-center gap-4 m-auto text-center md:text-left max-w-xl'>
        <p className='text-[26px] sm:text-3xl md:text-4xl lg:text-[40px] text-white font-semibold leading-tight'>
          Book Appoinments
          <br className='hidden sm:block' />
          With Trusted Doctor
        </p>
        <p className='text-sm sm:text-base text-blue-100 max-w-md mt-1'>
          Simply browse our trusted doctor list, compare profiles and book
          your appointment in just a few clicks.
        </p>

        <div className='flex items-center gap-3 sm:gap-4 mt-4 flex-wrap justify-center md:justify-start'>
          <img className='w-20 sm:w-24 rounded-full' src={assets.group_profiles} alt='Happy patients' />
          <div className='text-left'>
            <p className='text-xs sm:text-sm text-white font-medium'>Trusted by hundreds of patients</p>
            <p className='text-[11px] sm:text-xs text-blue-100'>Fast, secure and hassle-free appointments.</p>
          </div>
        </div>

        <a
          href='#speciality'
          className='mt-5 inline-flex items-center justify-center gap-2 bg-white px-8 py-3 rounded-full text-gray-800 text-sm sm:text-base font-medium hover:bg-blue-50 hover:shadow-lg hover:-translate-y-[1px] transition-all duration-200'
        >
          Book Appoinments
          <span className='flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-xs'>
            →
          </span>
        </a>
      </div>

      {/* right side */}
      <div className='w-full md:w-1/2 flex justify-center md:justify-end mt-8 md:mt-0'>
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
