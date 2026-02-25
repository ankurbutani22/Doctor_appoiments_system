import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import {toast} from 'react-toastify'
import axios from 'axios'


const AddDoctor = () => {

  const [docImg,setDocImg] = useState(false)
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [experience,setExperience] = useState('1')
  const [fees,setFees] = useState('')
  const [speciality,setSpeciality] = useState('General physician')
  const [education,setEducation] = useState('')
  const [address1,setAddress1] = useState('')
  const [address2,setAddress2] = useState('')
  const [about,setAbout] = useState('')
const {backendUrl ,aToken} = useContext(AdminContext)
const onSubmitHandler = async (e) => {
  e.preventDefault()
  try {
    if(!docImg){
      return toast.error('Please upload doctor image')
    }
    const formData = new FormData()
    formData.append('docImg',docImg)
    formData.append('name',name)
    formData.append('email',email)
    formData.append('password',password)
    formData.append('experience',experience)
    formData.append('fees',Number(fees))
    formData.append('speciality',speciality)
    formData.append('degree', education)
    formData.append('about',about)
    formData.append('address',JSON.stringify({line1:address1,line2:address2}))
    //console log all form data
    formData.forEach((value,key)=>{
      console.log(`${key}: ${value}`);
    })
   const { data } = await axios.post(backendUrl + '/api/admin/add-doctor', formData, { 
    headers: { atoken: aToken } // અહીં 'atoken' કી તરીકે પાસ કરો
})
    if(data.success){
      toast.success(data.message)
      setDocImg(false)
      setName('')
      setPassword('')
      setEmail('')
      setAddress1('')
      setAddress2('')
      setEducation('')
      setAbout('')
      setFees('')
    }
    else{
      toast.error(data.message)
    }
  } catch (error) {
    toast.error(error.message)
    console.log(error)
  }
}


  return (
    <form onSubmit={onSubmitHandler} className='m-5 w-full '>
      <p className='md-3 text-lg fount-medium '> Add Doctor</p>
      <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
        <div className='flex items-center gap-4 mb-8 text-gray-500 '>
          <label htmlFor='doc-img'>
            <img className='w-16 bg-gray-100 rounded-full cursor-pointer' src={ docImg ?URL.createObjectURL(docImg)  :assets.upload_area} alt="" />
          </label>
          <input onChange={(e)=>setDocImg(e.target.files[0])} type='file' id="doc-img" hidden />
          <p>Upload Doctor <br/> picture</p>
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
              <p>Doctor Pssword</p>
              <input onChange={(e)=> setPassword(e.target.value)} value={password} className='border rounded px-3 py-2' type="password" placeholder='Password' required />
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
        <button type='submit' className='bg-blue-600 px-10 py-3 mt-4 text-white rounded-full hover:bg-blue-700 transition-colors'>Add Doctor</button>
      </div>
    </form>
  )
}

export default AddDoctor
