import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
  return (
    <div className='flex flex-col md:flex-row flex-wrap bg-blue-600 rounded-lg px-6 md:px-10 lg:px-20'>
      {/* leftside */}
      <div className='md:1/2 flex flex-col items-start justify-center gap-4 py-20 m-auto md:mb-[-30px]'>
    <p className='text-3xl md:text-4xl lg:text-5xl text-white font-semibold lending-tight md:lending-tight lg:lending-tight'>Book Appoinments <br/>With Trusted Doctor </p>
    <div className=' gap-3 text-white text-sm font-light'>
        <img className='w-28' src={assets.group_profiles} alt=""  />
        <p>Simply browse through our extensive list of Trusted doctors, <br className='hidden sm:block'/>schedule your Appoinment hassle-free. </p>
    </div>
    <a href='#speciality'className='flex items-center gap-2 bg-white px-8 py-3 rounded-full text-gray-600 text-sm m-auto md:m-0 hover:scale-105 transition-all duration-300'>Book Appoinments <img className='w-3' src={assets.arrow_icon} alt=""  /></a>
      </div>
        {/* rightside */}
        <div className='md:w-1/2 relative'>
    <img className='w-full md:absolute bottom-0 h-auto rounded-lg' src={assets.header_img} alt=""  />
        </div>
    </div>
  )
}

export default Header
