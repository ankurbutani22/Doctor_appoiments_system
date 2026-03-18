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
    const [ratingSummary, setRatingSummary] = useState({ averageRating: 0, ratingCount: 0 });
    const [userRating, setUserRating] = useState(0);
    const [userComment, setUserComment] = useState('');
    const [loadingRating, setLoadingRating] = useState(false);

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

    const fetchRatingInfo = useCallback(async () => {
        if (!docInfo) return;

        // જો યુઝર લોગિન ન હોય તો ફક્ત doctor list માંથી summary લ્યો
        if (!token) {
            setRatingSummary({
                averageRating: docInfo.averageRating || 0,
                ratingCount: docInfo.ratingCount || 0
            });
            return;
        }

        try {
            setLoadingRating(true);
            const { data } = await axios.get(backendUrl + '/api/user/doctor-rating/' + docId, { headers: { token } });
            if (data.success) {
                setRatingSummary({
                    averageRating: data.averageRating || 0,
                    ratingCount: data.ratingCount || 0
                });

                if (data.userRating) {
                    setUserRating(data.userRating.rating || 0);
                    setUserComment(data.userRating.comment || '');
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingRating(false);
        }
    }, [backendUrl, docId, docInfo, token]);

    const submitRating = async () => {
        if (!token) {
            toast.warn('Login to rate doctor');
            return navigate('/login');
        }

        if (!userRating) {
            return toast.error('Please select a rating');
        }

        try {
            setLoadingRating(true);
            const { data } = await axios.post(
                backendUrl + '/api/user/rate-doctor',
                { docId, rating: userRating, comment: userComment },
                { headers: { token } }
            );

            if (data.success) {
                toast.success(data.message);
                setRatingSummary({
                    averageRating: data.averageRating || 0,
                    ratingCount: data.ratingCount || 0
                });
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setLoadingRating(false);
        }
    };

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
            fetchRatingInfo();
        }
    }, [docInfo, getAvailableSlots, fetchRatingInfo]); 

    if (!docInfo) {
        return <div className='p-10 text-center'>Loading doctor information...</div>;
    }

    return (
        <div className='bg-slate-50 min-h-[calc(100vh-80px)] py-6 sm:py-8'>
            <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
                {/* Top: doctor card */}
                <div className='grid grid-cols-1 md:grid-cols-[auto,1fr] gap-6 items-start'>
                    <div className='flex justify-center md:justify-start'>
                        <img className='bg-blue-600/90 w-48 h-48 md:w-56 md:h-56 rounded-2xl object-cover shadow-md' src={docInfo.image} alt={docInfo.name} />
                    </div>
                    <div className='bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-7'>
                        <p className='flex items-center gap-2 text-2xl font-semibold text-slate-900'>
                            {docInfo.name}
                            <img className='w-5' src={assets.verified_icon} alt="Verified" />
                        </p>
                        <div className='flex flex-wrap items-center gap-2 text-sm mt-2 text-slate-600'>
                            <p>{docInfo.degree} - {docInfo.speciality}</p>
                            <span className='inline-flex items-center px-2 py-0.5 rounded-full border border-slate-200 text-xs bg-slate-50'>
                                {docInfo.experience}
                            </span>
                        </div>

                        <div className='mt-4'>
                            <p className='flex items-center gap-1 text-sm font-medium text-slate-900'>
                                About <img src={assets.info_icon} alt="Info" className='w-3.5' />
                            </p>
                            <p className='text-sm text-slate-600 mt-1 leading-relaxed max-w-xl'>{docInfo.about}</p>
                        </div>

                        <div className='mt-4 flex flex-wrap items-center gap-4'>
                            <p className='text-sm text-slate-600'>
                                <span className='font-medium text-slate-800'>Appointment fee:</span>{' '}
                                <span>{currencysymbol}{docInfo.fees}</span>
                            </p>
                            <div className='flex items-center gap-1 text-xs text-amber-500'>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span key={star}>{ratingSummary.averageRating >= star ? '★' : '☆'}</span>
                                ))}
                                <span className='text-slate-500 ml-1'>
                                    {ratingSummary.ratingCount > 0
                                        ? `${ratingSummary.averageRating.toFixed(1)} • ${ratingSummary.ratingCount} ratings`
                                        : 'No ratings yet'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Slots + rating */}
                <div className='grid grid-cols-1 lg:grid-cols-[1.5fr,1.1fr] gap-6 mt-8 items-start'>
                    {/* Booking slots */}
                    <div className='bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6'>
                        <p className='font-semibold text-slate-900 text-base sm:text-lg'>Book an appointment</p>
                        <p className='text-xs text-slate-500 mt-1'>Select a day and time slot that works best for you.</p>

                        <div className='mt-5'>
                            <p className='text-xs font-medium text-slate-500 uppercase tracking-wide mb-2'>Days</p>
                            <div className='flex gap-3 items-center w-full overflow-x-auto pb-1'>
                                {docSlots.length > 0 && docSlots.map((item, index) => (
                                    <button
                                        type='button'
                                        onClick={() => setSlotIndex(index)}
                                        key={index}
                                        className={`text-center px-3 py-3 rounded-2xl min-w-3.5rem text-xs font-medium border transition-all ${slotIndex === index ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100'}`}
                                    >
                                        <p>{item[0] && daysofweek[item[0].datetime.getDay()]}</p>
                                        <p className='mt-0.5 text-base'>{item[0] && item[0].datetime.getDate()}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className='mt-5'>
                            <p className='text-xs font-medium text-slate-500 uppercase tracking-wide mb-2'>Time slots</p>
                            <div className='flex items-center gap-3 w-full overflow-x-auto pb-1'>
                                {docSlots.length > 0 && docSlots[slotIndex].map((item, index) => (
                                    <button
                                        type='button'
                                        onClick={() => setSlotTime(item.time)}
                                        className={`text-xs sm:text-sm font-normal shrink-0 px-4 py-2 rounded-full border transition-all ${item.time === slotTime ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'text-slate-500 border-slate-200 bg-slate-50 hover:bg-slate-100'}`}
                                        key={index}
                                    >
                                        {item.time.toLowerCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={bookAppointment}
                            className='mt-6 inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-8 py-2.5 rounded-full shadow-sm transition-colors'
                        >
                            Confirm booking
                        </button>
                    </div>

                    {/* Rating section */}
                    <div className='bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6'>
                        <p className='font-semibold text-slate-900 mb-1 text-base sm:text-lg'>Doctor rating</p>
                        <p className='text-xs text-slate-500 mb-4'>Share your experience to help other patients.</p>

                        <div className='flex items-center gap-2 mb-3'>
                            <div className='flex items-center gap-1 text-amber-400 text-lg'>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span key={star}>{ratingSummary.averageRating >= star ? '★' : '☆'}</span>
                                ))}
                            </div>
                            <span className='text-xs text-slate-500'>
                                {ratingSummary.ratingCount > 0
                                    ? `${ratingSummary.averageRating.toFixed(1)} (${ratingSummary.ratingCount} ratings)`
                                    : 'No ratings yet'}
                            </span>
                        </div>

                        {token ? (
                            <div className='mt-3'>
                                <p className='text-sm text-slate-800 mb-2'>
                                    {userRating ? 'Update your rating' : 'Rate this doctor'}
                                </p>
                                <div className='flex items-center gap-1 mb-2 text-2xl'>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            type='button'
                                            key={star}
                                            onClick={() => setUserRating(star)}
                                            className='focus:outline-none'
                                        >
                                            <span className={star <= userRating ? 'text-amber-400' : 'text-slate-300'}>
                                                ★
                                            </span>
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    rows={3}
                                    className='w-full border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50'
                                    placeholder='Write your feedback (optional)'
                                    value={userComment}
                                    onChange={(e) => setUserComment(e.target.value)}
                                />
                                <button
                                    type='button'
                                    disabled={loadingRating}
                                    onClick={submitRating}
                                    className='mt-3 px-6 py-2 rounded-full text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center'
                                >
                                    {loadingRating ? 'Saving...' : userRating ? 'Update rating' : 'Submit rating'}
                                </button>
                            </div>
                        ) : (
                            <p className='mt-3 text-xs text-slate-500'>Login to rate this doctor.</p>
                        )}
                    </div>
                </div>

                <div className='mt-10'>
                    <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
                </div>
            </div>
        </div>
    );
}

export default Appoinments;