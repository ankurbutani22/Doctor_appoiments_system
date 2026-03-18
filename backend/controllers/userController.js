import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import notificationModel from '../models/notificationModel.js'
import Razorpay from 'razorpay'
import ratingModel from '../models/ratingModel.js'


// API to make payment of appointment using razorpay
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

//api for register user

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        const imageFile = req.file

        if (!name || !password || !email) {
            return res.json({ success: false, message: "Missing details" })
        }

        if (!imageFile) {
            return res.json({ success: false, message: "Profile image is required" })
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Enter a valid email" })
        }
        //password length 
        if (password.length < 8) {
            return res.json({ success: false, message: "Enter a strong password" })

        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })

        const userData = {
            name,
            email,
            password: hashedPassword,
            image: imageUpload.secure_url
        }
        const newUser = new userModel(userData)
        const user = await newUser.save()
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        res.json({ success: true, token })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// api for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: 'User does not exist' })

        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}

//Api get a user profile data 
const getProfile = async (req, res) => {
    try {
        const { userId } = req.body
        const userData = await userModel.findById(userId).select('-password')

        res.json({ success: true, userData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//Api to update user-profile
const updateProfile = async (req, res) => {
    try {
        const { userId, name, phone, address, dob, gender } = req.body
        const imageFile = req.file

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data mising" })

        }


        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })

        if (imageFile) {
            //upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })

            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, { image: imageURL })
        }
        res.json({ success: true, message: "profile Updated" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}



// Api user apointments
const bookAppointment = async (req, res) => {
    try {
        const { userId, docId, slotDate, slotTime } = req.body

        const docData = await doctorModel.findById(docId).select('-password')
        if (!docData.available) {
            return res.json({ success: false, message: "Doctor is not available right now" })
        }

        let slots_booked = docData.slots_booked

        //check if the slot is already booked
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: "slot not  available right now" })
            }
            else {
                slots_booked[slotDate].push(slotTime)
            }
        }
        else {
            slots_booked[slotDate] = []
            slots_booked[slotDate] = [slotTime]
        }

        const userData = await userModel.findById(userId).select('-password')

        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }
        const newAppointment = new appointmentModel(appointmentData)
        const savedAppointment = await newAppointment.save()

        //save new slots data in doctor collection
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        // create notification for doctor - new appointment
        try {
            await notificationModel.create({
                docId,
                forRole: 'doctor',
                title: 'New appointment booked',
                message: `${userData.name} booked an appointment on ${slotDate} at ${slotTime}`,
            })
        } catch (notifyErr) {
            console.log('Notification error (doctor new appointment):', notifyErr.message)
        }

        res.json({ success: true, message: "Appointment booked successfully", appointmentId: savedAppointment._id })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}

//Api  to get user appointments
const listAppointments = async (req, res) => {
    try {
        const { userId } = req.body
        const appointments = await appointmentModel.find({ userId })
        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Add or update a rating for a doctor by a user
const rateDoctor = async (req, res) => {
    try {
        const { userId, docId, rating, comment } = req.body

        if (!docId || !rating) {
            return res.json({ success: false, message: 'Doctor and rating are required' })
        }

        const numericRating = Number(rating)
        if (!numericRating || numericRating < 1 || numericRating > 5) {
            return res.json({ success: false, message: 'Rating must be between 1 and 5' })
        }

        // Ensure doctor exists
        const doctor = await doctorModel.findById(docId)
        if (!doctor) {
            return res.json({ success: false, message: 'Doctor not found' })
        }

        // User must have at least one completed appointment with this doctor
        const completedAppointment = await appointmentModel.findOne({
            userId,
            docId,
            isCompleted: true,
            cancelled: { $ne: true }
        })

        if (!completedAppointment) {
            return res.json({
                success: false,
                message: 'You can rate this doctor only after a completed appointment.'
            })
        }

        const user = await userModel.findById(userId).select('name')
        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        // Upsert rating (one rating per doctor per user)
        await ratingModel.findOneAndUpdate(
            { docId, userId },
            {
                docId,
                userId,
                userName: user.name,
                rating: numericRating,
                comment: comment || '',
                date: Date.now()
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        )

        // Recalculate doctor's rating summary
        const stats = await ratingModel.aggregate([
            { $match: { docId } },
            {
                $group: {
                    _id: '$docId',
                    avgRating: { $avg: '$rating' },
                    count: { $sum: 1 }
                }
            }
        ])

        const avgRating = stats[0]?.avgRating || 0
        const count = stats[0]?.count || 0

        await doctorModel.findByIdAndUpdate(docId, {
            averageRating: avgRating,
            ratingCount: count
        })

        res.json({
            success: true,
            message: 'Rating saved successfully',
            averageRating: avgRating,
            ratingCount: count
        })
    } catch (error) {
        console.log(error)
        // Handle duplicate key error from unique index gracefully
        if (error.code === 11000) {
            return res.json({ success: false, message: 'You have already rated this doctor.' })
        }
        res.json({ success: false, message: error.message })
    }
}

// Get rating summary for a doctor plus current user's rating (if any)
const getDoctorRatingForUser = async (req, res) => {
    try {
        const { userId } = req.body
        const { docId } = req.params

        if (!docId) {
            return res.json({ success: false, message: 'Doctor id is required' })
        }

        const doctor = await doctorModel.findById(docId).select('averageRating ratingCount')
        if (!doctor) {
            return res.json({ success: false, message: 'Doctor not found' })
        }

        const userRating = await ratingModel.findOne({ docId, userId }).select('-_id rating comment date')

        res.json({
            success: true,
            averageRating: doctor.averageRating || 0,
            ratingCount: doctor.ratingCount || 0,
            userRating
        })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// Api to cancle appointment

const cancelAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.body

        const appointment = await appointmentModel.findById(appointmentId)

        if (appointment.userId !== req.body.userId) {
            return res.json({ success: false, message: 'Unauthorized action' })

        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        //release slot in doctor collection
        const { docId, slotDate, slotTime } = appointment
        const doctorData = await doctorModel.findById(docId)
        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await doctorModel.findByIdAndUpdate(docId, { slots_booked })
        res.json({ success: true, message: "Appointment cancelled successfully" })


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}

const paymentRazorpay = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: "Appointment Cancelled or not found" })
        }

        // creating options for razorpay payment
        const options = {
            amount: appointmentData.amount * 100,
            currency: process.env.CURRENCY,
            receipt: appointmentId,
        }

        // creation of an order
        const order = await razorpayInstance.orders.create(options)

        res.json({ success: true, order })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        if (orderInfo.status === 'paid') {
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true })
            res.json({ success: true, message: "Payment Successful" })
        } else {
            res.json({ success: false, message: "Payment Failed" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Download appointment report for patient
const downloadReportUser = async (req, res) => {
    try {
        const { appointmentId } = req.params

        const appointment = await appointmentModel.findById(appointmentId)

        if (!appointment) {
            return res.status(404).send('Report not found')
        }

        if (!appointment.reportData) {
            return res.status(404).send('No report uploaded')
        }

        res.setHeader('Content-Type', appointment.reportMimeType || 'application/pdf')
        res.setHeader('Content-Disposition', `inline; filename="${appointment.reportFilename || 'report.pdf'}"`)
        res.send(appointment.reportData)
    } catch (error) {
        console.log(error)
        res.status(500).send('Failed to download report')
    }
}

export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointments, cancelAppointment, paymentRazorpay, verifyRazorpay, downloadReportUser, rateDoctor, getDoctorRatingForUser }