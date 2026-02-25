import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import { toast } from 'react-toastify';
import axios from 'axios';

const Appoinments = () => {
    const { docId } = useParams();
    const navigate = useNavigate();
    const { doctors, currencysymbol, backendUrl, token, getDoctorsData } = useContext(AppContext);
    const daysofweek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    const [docInfo, setDocInfo] = useState(null);
    const [docSlots, setDocSlots] = useState([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const [slotTime, setSlotTime] = useState('');

    const fetchDocInfo = useCallback(async () => {
        if (doctors) {
            const docInfo = doctors.find(doc => doc._id === docId);
            setDocInfo(docInfo);
        }
    }, [doctors, docId]);

    const getAvailableSlots = useCallback(async () => {
        setDocSlots([]);
        
        let today = new Date();
        let allSlots = []; // બધો ડેટા પેલા અહિયાં ભેગો કરો

        for (let i = 0; i < 7; i++) {
            let currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);
            
            let endTime = new Date(today);
            endTime.setDate(today.getDate() + i);
            endTime.setHours(21, 0, 0, 0); 
            
            if (i === 0) { // આજનો દિવસ હોય તો
                currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
            } else {
                currentDate.setHours(10);
                currentDate.setMinutes(0); 
            }

            let timeSlotsPerDay = [];
            while (currentDate < endTime) {
                let formattedTime = currentDate.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                });

                let day = currentDate.getDate();
                let month = currentDate.getMonth() + 1;
                let year = currentDate.getFullYear();
                const slotDate = day + "_" + month + "_" + year;

                // ચેક કરો કે આ સ્લોટ પહેલેથી બુક છે કે નહીં
                const isSlotAvailable = docInfo?.slots_booked?.[slotDate]?.includes(formattedTime) ? false : true;

                if (isSlotAvailable) {
                    timeSlotsPerDay.push({
                        datetime: new Date(currentDate),
                        time: formattedTime 
                    });
                }
                currentDate.setMinutes(currentDate.getMinutes() + 30);
            }
            allSlots.push(timeSlotsPerDay);
        }
        setDocSlots(allSlots); // સ્ટેટ એકસાથે અપડેટ કરો
    }, [docInfo]); // docInfo અહિયાં હોવું જરૂરી છે

    const bookAppointment = async () => {
        if (!token) {
            toast.warn('Login to book appointment');
            return navigate('/login');
        }
        try {
            // જો સ્લોટ સિલેક્ટ ન કર્યો હોય તો એરર હેન્ડલિંગ
            if (!slotTime) {
                return toast.error('Please select a time slot');
            }

            const date = docSlots[slotIndex][0].datetime;
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();
            const slotDate = day + "_" + month + "_" + year;
             
            const { data } = await axios.post(backendUrl + '/api/user/book-appointment', { docId, slotDate, slotTime }, { headers: { token } });
            
            if (data.success) {
                toast.success(data.message);
                getDoctorsData();
                navigate('/my-appointments');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchDocInfo();
    }, [fetchDocInfo]); 

    useEffect(() => {
        if (docInfo) {
            getAvailableSlots();
        }
    }, [docInfo, getAvailableSlots]); 

    if (!docInfo) {
        return <div className='p-10 text-center'>Loading doctor information...</div>;
    }

    return (
        <div className='pt-5'>
            <div className='flex flex-col sm:flex-row gap-4'>
                <div>
                    <img className='bg-blue-600 w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt={docInfo.name} />
                </div> 
                <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
                    <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
                        {docInfo.name} 
                        <img className='w-5' src={assets.verified_icon} alt="Verified" />
                    </p>
                    <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
                        <p>{docInfo.degree} - {docInfo.speciality}</p>
                        <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
                    </div>
                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
                            About <img src={assets.info_icon} alt="Info" />
                        </p>
                        <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
                    </div>
                    <p className='text-gray-500 font-medium mt-4'>
                        Appointment fee: <span className='text-gray-600'>{currencysymbol}{docInfo.fees}</span>
                    </p>
                </div>
            </div>

            <div className='sm:ml-72 sm:pl-4 font-medium text-gray-700 mt-4'>
                <p>Booking slots</p>
                <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
                    {docSlots.length > 0 && docSlots.map((item, index) => (
                        <div onClick={() => setSlotIndex(index)} key={index} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-blue-600 text-white' : 'border border-gray-300'}`}>
                            <p>{item[0] && daysofweek[item[0].datetime.getDay()]}</p>
                            <p>{item[0] && item[0].datetime.getDate()}</p>
                        </div>
                    ))}
                </div>
                
                <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
                    {docSlots.length > 0 && docSlots[slotIndex].map((item, index) => (
                        <p onClick={() => setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-blue-600 text-white' : 'text-gray-400 border border-gray-300'}`} key={index}>
                            {item.time.toLowerCase()} 
                        </p>
                    ))}
                </div>
                <button onClick={bookAppointment} className='bg-blue-600 text-white text-sm font-light px-12 py-3 rounded-full my-6'>Book an appointment</button>
            </div>
            <RelatedDoctors docId={docId} speciality={docInfo.speciality}/>
        </div>
    );
}

export default Appoinments;