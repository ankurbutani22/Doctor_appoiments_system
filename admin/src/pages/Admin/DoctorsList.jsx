import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useNavigate } from 'react-router-dom'
import PageLoader from '../../components/PageLoader'

const DoctorsList = () => {
  // Get doctors data and the fetch function from context
  const { doctors, aToken, getAllDoctors ,changeAvailablity, loadingDoctors, removeDoctor } = useContext(AdminContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (aToken) {
      getAllDoctors() // Fetches the data seen in your console
    }
  }, [aToken])

  if (loadingDoctors && doctors.length === 0) {
    return <PageLoader label="Loading doctors..." variant="doctors" />
  }

  return (
    <div className=' m-5 max-h-[90vh] overflow-scroll '>
      <h1 className='text-lg font-medium'>All Doctors</h1>
      <div className='w-full flex flex-wrap gap-y-9 pt-5 gap-4 '>
        {
          doctors.map((item,index)=>(
            <div onClick={()=>navigate(`/edit-doctor/${item._id}`)} className='border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group bg-white shadow-sm hover:shadow-md transition-shadow' key={index}>
              <img className='bg-indigo-50 group-hover:bg-primary transition-all duration-500 ' src={item.image} alt="" />
              <div className='p-5 flex flex-col gap-2'>
                <div>
                  <p className='text-neutral-800 text-lg font-medium '>{item.name}</p>
                  <p className='text-zinc-600 text-sm '>{item.speciality}</p>
                </div>
                <div className='mt-1 flex items-center justify-between text-sm'>
                  <label className='flex items-center gap-1'>
                    <input onChange={(e)=>{e.stopPropagation(); changeAvailablity(item._id)}} type='checkbox'  checked={item.available}/>
                    <span>Available</span>
                  </label>
                  <button
                    type='button'
                    onClick={(e)=>{e.stopPropagation(); removeDoctor(item._id)}}
                    className='text-xs px-2 py-1 rounded-full border border-red-200 text-red-600 hover:bg-red-50'
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))
        }
      </div>
      
    </div>
  )
}

export default DoctorsList