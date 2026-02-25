import React, { useContext, useState, useEffect } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import {toast} from 'react-toastify'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'

const EditDoctor = () => {
  const { backendUrl, aToken, getDoctorById, updateDoctor, doctors, getAllDoctors } = useContext(AdminContext)
  const { id } = useParams() // original route param (kept for URL syncing)
  const navigate = useNavigate()

  const [selectedId, setSelectedId] = useState(id || '')
  const [docImg, setDocImg] = useState(false)
  const [currentImage, setCurrentImage] = useState('')
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('') // new password input
  const [experience,setExperience] = useState('1')
  const [fees,setFees] = useState('')
  const [speciality,setSpeciality] = useState('General physician')
  const [education,setEducation] = useState('')
  const [address1,setAddress1] = useState('')
  const [address2,setAddress2] = useState('')
  const [about,setAbout] = useState('')

  useEffect(() => {
    // always fetch doctor list for dropdown
    if (aToken && doctors.length === 0) {
      getAllDoctors()
    }
  }, [aToken, doctors, getAllDoctors])

  // load selected doctor details
  useEffect(() => {
    const load = async () => {
      if (selectedId) {
        const data = await getDoctorById(selectedId)
        if (data.success) {
          const doc = data.doctor
          setName(doc.name || '')
          setEmail(doc.email || '')
          setExperience(doc.experience || '')
          setFees(doc.fees || '')
          setSpeciality(doc.speciality || 'General physician')
          setEducation(doc.degree || '')
          setAddress1(doc.address?.line1 || '')
          setAddress2(doc.address?.line2 || '')
          setAbout(doc.about || '')
          setCurrentImage(doc.image || '')
          // keep URL in sync
          navigate(`/edit-doctor/${selectedId}`, { replace: true })
        } else {
          toast.error(data.message)
        }
      }
    }
    load()
  }, [selectedId, getDoctorById, navigate])

  const onSubmitHandler = async (e) => {
    if (!selectedId) return toast.error('Please select a doctor first')
    e.preventDefault()
    try {
      if (!name || !email) return toast.error('Name and email required')
      const formData = new FormData()
      formData.append('docId', selectedId)
      if (docImg) formData.append('docImg', docImg)
      formData.append('name', name)
      formData.append('email', email)
      if (password) formData.append('newPassword', password)
      formData.append('experience', experience)
      formData.append('fees', Number(fees))
      formData.append('speciality', speciality)
      formData.append('degree', education)
      formData.append('about', about)
      formData.append('address', JSON.stringify({line1:address1,line2:address2}))

      const { data } = await axios.post(backendUrl + '/api/admin/update-doctor', formData, {
        headers: { atoken: aToken }
      })

      if (data.success) {
        toast.success(data.message)
        navigate('/doctor-List')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
      console.log(error)
    }
  }


  return (
    <form onSubmit={onSubmitHandler} className='m-5 w-full '>
      {/* selector dropdown */}
      <div className='mb-6'>
        <label className='block mb-1 font-medium'>Select Doctor</label>
        <select
          className='border rounded px-3 py-2 w-full max-w-xs'
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          <option value=''>-- choose doctor --</option>
          {doctors.map((doc) => (
            <option key={doc._id} value={doc._id}>{doc.name}</option>
          ))}
        </select>
      </div>
      <p className='md-3 text-lg font-medium '> Edit Doctor</p>
      <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
        <div className='flex items-center gap-4 mb-8 text-gray-500 '>
          <label htmlFor='doc-img'>
            <img className='w-16 bg-gray-100 rounded-full cursor-pointer' src={
              docImg ? URL.createObjectURL(docImg) : (currentImage || assets.upload_area) } alt="" />
          </label>
          <input onChange={(e)=>setDocImg(e.target.files[0])} type='file' id="doc-img" hidden />
          <p>Upload Doctor <br/> picture (optional)</p>
        </div>
        <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600 '>
          <div className='w-full lg:flex-1 flex flex-col gap-4 '>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Your Name</p>
              <input onChange={(e) => setName(e.target.value)} value={name} className='border rounded px-3 py-2' type="text" placeholder='name' required />
            </div>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Doctor Email</p>
              <input onChange={(e)=> setEmail(e.target.value)} value={email} className='border rounded px-3 py-2' type="email" placeholder='Email' required />
            </div>
            <div className='flex-1 flex flex-col gap-1'>
              <p>New Password (leave blank to keep existing)</p>
              <input onChange={(e)=> setPassword(e.target.value)} value={password} className='border rounded px-3 py-2' type="password" placeholder='Password' />
            </div>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Experience</p>
              <select onChange={(e)=>setExperience(e.target.value)} value={experience} className='border rounded px-3 py-2' id='experience-select'>
                <option value="1 years">1 years</option>
                <option value="2 years">2 years</option>
                <option value="3 years">3 years</option>
                <option value="4 years">4 years</option>
                <option value="5 years">5 years</option>
                <option value="6 years">6 years</option>
                <option value="7 years">7 years</option>
                <option value="8 years">8 years</option>
                <option value="9 years">9 years</option>
                <option value="10 years">10 years</option>
              </select>
            </div>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Fees</p>
              <input onChange={(e)=> setFees(e.target.value)} value={fees} className='border rounded px-3 py-2' type="number" placeholder='Fees' required />
            </div>
          </div>
          <div className='w-full lg:flex-1 flex-col gap-4'>
           <div className='flex-1 flex flex-col gap-1'>
            <p >Speciality</p>
            <select onChange={(e) => setSpeciality(e.target.value)} value={speciality} className='border rounded px-3 py-2' id='speciality-select'>
              <option value="General physician">General physician</option>
              <option value="Gynecologist">Gynecologist</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="Pediatricians">Pediatricians</option>
              <option value="Neurologist">Neurologist</option>
              <option value="Gastroenterologist">Gastroenterologist</option>
            </select>
           </div>
           <div className='flex-1 flex flex-col gap-1'>
            <p>Education</p>
            <input onChange={(e)=>setEducation(e.target.value)} value={education} className='border rounded px-3 py-2' type="text" placeholder='Education' required />
           </div>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Address</p>
              <input  onChange={(e) => setAddress1(e.target.value)} value={address1} className='border rounded px-3 py-2' type="text" placeholder='Address 1' required />
              <input onChange={(e) => setAddress2(e.target.value)} value={address2} className='border rounded px-3 py-2' type="text" placeholder='Address 2' required />
            </div>
          </div>
        </div>
        <div>
          <p className='mt-4 mb-2'>About Me</p>
          <textarea onChange={(e) => setAbout(e.target.value)} value={about} className='w-full px-4 border rounded ' rows={5} required></textarea>
        </div>
        <button type='submit' className='bg-blue-600 px-10 py-3 mt-4 text-white rounded-full hover:bg-blue-700 transition-colors'>Update Doctor</button>
      </div>
    </form>
  )
}

export default EditDoctor