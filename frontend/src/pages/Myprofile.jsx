import React, { use, useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Myprofile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext)
  const [isEdit, setIsEdit] = useState(false)
  const [image, setImage] = useState(false)

  const updateUserProfileData = async () => {
    try {
      // Require a real profile image before saving
      if (!image && (!userData.image || userData.image.length > 500)) {
        toast.error('Profile image is required.')
        return
      }

      const formData = new FormData()
      formData.append('name', userData.name)
      formData.append('phone', userData.phone)
      formData.append('address', JSON.stringify(userData.address))
      formData.append('gender', userData.gender)
      formData.append('dob', userData.dob)

      image && formData.append('image', image)
      const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { token } })

      if (data.success) {
        toast.success(data.message)
        await loadUserProfileData()
        setIsEdit(false)
        setImage(false)
      }
      else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }

  }


  return userData && (
    <div className='max-w-lg flex flex-col gap-2 text-sm '>
      {
        isEdit
          ? <label htmlFor="image">
            <div className='inline-block relative cursor-pointer group'>
              <img className='w-36 h-36 rounded-lg object-cover opacity-75 group-hover:opacity-50 transition-opacity'
                src={image ? URL.createObjectURL(image) : ((userData.image && userData.image.length > 500) ? assets.profile_pic : (userData.image || assets.profile_pic))}
                alt="Profile" />
              {!image && <img className='w-10 absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 opacity-80' src={assets.upload_icon} alt="Upload" />}
              <p className='absolute bottom-2 w-full text-center text-xs font-bold text-blue-600'>Change Photo</p>
            </div>
            <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
          </label>
          : <img className='w-36 h-36 rounded-lg border-2 border-gray-100 object-cover shadow-sm'
            src={(userData.image && userData.image.length > 500) ? assets.profile_pic : (userData.image || assets.profile_pic)}
            alt="Profile" />
      }
      {
        isEdit
          ? <input className='bg-gray-50 text-3xl fount-medium max-w-60 mt-4 ' type='text' value={userData.name} onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))} />
          : <p className='fount-medium text-3xl text-neutral-800'>{userData.name}</p>
      }

      <hr className='bg-zinc-400 h-px border-none ' />
      <div>
        <p className='text-neutral-500 underline mt-3'>CONTACT INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700 '>
          <p className='font-medium '> Email id:</p>
          <p className='text-blue-500'>{userData.email}</p>
          <p className='font-medium'>Phone:</p>
          {
            isEdit
              ? <input className='bg-gray-100 max-w-52' type='text' value={userData.phone} onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))} />
              : <p className='text-blue-400  '>{userData.phone}</p>
          }
          <p className='fount-medium'>Address:</p>
          {
            isEdit
              ? <p>
                <input
                  className='bg-gray-100'
                  onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
                  value={userData.address?.line1}
                  type="text"
                />
                <br />

                <input
                  className='bg-gray-100 mt-2'
                  onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))}
                  value={userData.address?.line2}
                  type="text"
                />
              </p>
              : <p className='text-gray-500 '>
                {userData.address.line1}
                <br />
                {userData.address.line2}

              </p>
          }

        </div>
      </div>
      <div>
        <p className='text-neutral-500 underline mt-3'>BASIC INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700 '>
          <p className='fount-medium'>Gender:</p>
          {
            isEdit
              ? <select className='max-w-20 bg-gray-100 ' onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))} value={userData.gender}>
                <option value="male">male</option>
                <option value="female">female</option>
              </select>
              : <p className='text-gray-400'>{userData.gender}</p>
          }
          <p className='fount-medium '>Birthday:</p>
          {
            isEdit ? <input className='max-w-28 bg-gray-100 ' type="date" onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))} value={userData.dob} />
              : <p className='text-gray-400'>{userData.dob} </p>
          }
        </div>
      </div>
      <div className='mt-10'>
        {
          isEdit
            ? <button className='border border-blue-600 px-8 py-2 rounded-full hover:bg-blue-600 hover:text-white transition-all  ' onClick={updateUserProfileData}>Save Informatin</button>
            : <button className='border border-blue-600 px-8 py-2 rounded-full hover:bg-blue-600 hover:text-white transition-all  ' onClick={() => setIsEdit(true)}>Edit</button>
        }
      </div>
    </div>
  )
}

export default Myprofile
