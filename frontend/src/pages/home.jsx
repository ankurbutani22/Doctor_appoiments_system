import React from 'react'
import Header from '../components/header'
import SpecialityMenu from '../components/SpecialityMenu'
import Topdoctors from '../components/Topdoctors'
import Banner from '../components/Banner'

const home = () => {
  return (
    <div className='pt-2'>
      <Header/>
      <SpecialityMenu/>
      <Topdoctors/>
      <Banner/>
    </div>
  )
}

export default home
