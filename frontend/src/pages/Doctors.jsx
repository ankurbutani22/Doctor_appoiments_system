import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import { AppContext } from '../context/AppContext';
import PageLoader from '../components/PageLoader';

const Doctors = () => {
  const { speciality } = useParams();
  const [filteredDoc, setFilteredDoc] = useState([])
  const [showFilter ,setShowFilter] = useState(false)
  const { doctors, loadingDoctors } = useContext(AppContext)
  const navigate = useNavigate(); // Initialize useNavigate hook

  const applyFilter = () => {
    if (speciality) {
      // Ensure 'specialities' matches the key in the doctor object and the route param name
      // It's 'speciality' in your filter logic, so let's keep it consistent
      setFilteredDoc(doctors.filter(doc => doc.speciality === speciality));
    } else {
      setFilteredDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [speciality, doctors]);
  

  if (loadingDoctors && doctors.length === 0) {
    return <PageLoader label="Loading doctors..." />
  }

  return (
    <div>
      <p>Browse through the doctors specialist.</p>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5"> {/* Added a class for better layout */}
<button className={`py-1 px-3  border rounded text-sm transition-all sm:hidden ${showFilter ?'bg-blue-600 text-white  ': '' }`} onClick={()=>setShowFilter(prev => ! prev)}>Filters</button>
        <div className={`flex flex-col gap-4 text-sm text-gray-600  ${showFilter? 'flex' : 'hidden sm:flex '}`}> {/* Sidebar for specialties */}
          <p onClick={()=> speciality ==='General physician' ? navigate('/doctors'):navigate ('/doctors/General physician')}  className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer  ${speciality ==="General physician" ? "bg-indigo-100 text-black ":""} `}>General physician</p>
          <p onClick={()=> speciality ==='Gynecologist' ? navigate('/doctors'):navigate ('/doctors/Gynecologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer  ${speciality ==="Gynecologist" ? "bg-indigo-100 text-black ":""}`}>Gynecologist</p>
          <p onClick={()=>speciality ==='Dermatologist' ? navigate('/doctors'):navigate ('/doctors/Dermatologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality ==="Dermatologist" ? "bg-indigo-100 text-black ":""} `}>Dermatologist</p>
          <p onClick={()=> speciality ==='Pediatricians' ? navigate('/doctors'):navigate ('/doctors/Pediatricians')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality ==="Pediatricians" ? "bg-indigo-100 text-black ":""} `}>Pediatricians</p>
          <p onClick={()=>speciality ==='Neurologist' ? navigate('/doctors'):navigate ('/doctors/Neurologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality ==="Neurologist" ? "bg-indigo-100 text-black ":""} `}>Neurologist</p>
          <p onClick={()=> speciality ==='Gastroenterologist' ? navigate('/doctors'):navigate ('/doctors/Gastroenterologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality ==="Gastroenterologist" ? "bg-indigo-100 text-black ":""} `}>Gastroenterologist</p>
        </div>
        <div className="w-3/4 p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Doctor list */}
          {/* CORRECTION: Use the map() method on the array */}
          {filteredDoc.map((item, index) => (
            <div
              onClick={() => navigate(`/appointment/${item._id}`)}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2.5 transition-all duration-500 shadow-lg"
              key={index}
            >
              <img className='bg-blue-50 w-full h-48 object-cover' src={item.image} alt={item.name} />
              <div className='p-4 '>
                <div className='flex items-center gap-2 text-sm text-center text-green-500 '>
                  <p className='w-2 h-2 bg-green-500 rounded-full '></p><p>Availlable</p>
                </div>
                <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                <p className='text-gray-600 text-sm '>{item.speciality}</p>
              </div>
            </div>
          ))}
          {/* Optionally show a message if no doctors are found */}
          {filteredDoc.length === 0 && <p className="col-span-full text-center text-gray-500">No doctors found for this specialty.</p>}
        </div>
      </div>
    </div>
  );
};

export default Doctors;