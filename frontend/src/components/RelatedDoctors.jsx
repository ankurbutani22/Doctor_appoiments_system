import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
// import { assets } from '../assets/assets'; // Assuming this import exists

// 1 & 2. FIX: Define the component and correctly destructure the props
const RelatedDoctors = ({ speciality, docId }) => { 
    const { doctors } = useContext(AppContext);
    const navigate = useNavigate();
    const [reldoc, setRelDoc] = useState([]);

    useEffect(() => {
        if (doctors.length > 0 && speciality) {
            // Filtering logic: matches speciality and excludes current doc
            const doctorsData = doctors.filter((doc) => doc.speciality === speciality && doc._id !== docId);
            setRelDoc(doctorsData);
        }
    }, [doctors, speciality, docId]); // Dependencies are correct

    if (reldoc.length === 0) {
        return null; // Don't render if no related doctors are found
    }

    return (
        <div className='flex flex-col items-center gap-4 my-12 text-gray-900 md:mx-5'>
      <h1 className='text-3xl font-medium'>Top Doctors To Book </h1>
      <p className='sm:w-1/3 text-center text-sm '>Simply browse through our extensive list of trusted doctors.</p>
      <div id="a" className='w-auto grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0' style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        {reldoc.slice(0,10).map((item, index) => (
            <div onClick={()=>{navigate(`/appointment/${item._id}`); scrollto(0,0) }} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2.5 transition-all duration-500' key={index} >
                <img className='bg-blue-50 ' src={item.image} alt=""  />
                <div className='p-4 '>
                    <div className='flex items-center gap-2 text-sm text-center text-green-500 '>
                    <p className='w-2 h-2 bg-green-500 rounded-full '></p><p>Availlable</p>
                </div>
                <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                <p className='text-gray-600 text-sm '>{item.speciality}</p>
                </div>
            </div>
        ))}
      </div>
      <button onClick={()=>{navigate('/doctors');scrollTo(0,0)}} className='bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10'>More</button>
    </div>
    );
};

export default RelatedDoctors;