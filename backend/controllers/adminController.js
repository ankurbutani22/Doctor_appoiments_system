import validator from "validator"
import bcrypt from "bcrypt"
import { v2 as cloudinary } from "cloudinary"
import doctorModel from "../models/doctorModel.js"
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js"
import userModel from "../models/userModel.js"


//api add-doctor
// api add-doctor
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
        const imageFile = req.file

        // ૧. તપાસો કે ફાઈલ અપલોડ થઈ છે કે નહીં (આ ફંક્શનની અંદર હોવું જોઈએ)
        if (!imageFile) {
            return res.json({ success: false, message: "Image not uploaded" })
        }

        // ૨. બાકીની વિગતો તપાસો
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({ success: false, message: "missing details" })
        }

        // ઈમેલ વેલિડેશન
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "please enter valid email" })
        }

        // પાસવર્ડ વેલિડેશન
        if (password.length < 8) {
            return res.json({ success: false, message: "please enter strong password" })
        }

        // પાસવર્ડ હેશિંગ
        const salt = await bcrypt.genSalt(10)
        const hashedpassword = await bcrypt.hash(password, salt)

        // Cloudinary પર ઈમેજ અપલોડ
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
        const imageUrl = imageUpload.secure_url

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedpassword,
            speciality,
            degree,
            experience,
            about,
            fees: Number(fees),
            address: JSON.parse(address),
            date: Date.now()
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()

        res.json({ success: true, message: "Doctor Added" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const authAdmin = async (req, res, next) => {
    try {
        const { atoken } = req.headers // 'atoken' નાના અક્ષરોમાં જ લખો
        if (!atoken) {
            return res.json({ success: false, message: 'Not Authorized. Login Again' })
        }

        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET)

        // જો ઈમેલ અને પાસવર્ડ મેચ ન થાય તો
        if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.json({ success: false, message: 'Invalid Token' })
        }

        next()
    } catch (error) {
        console.log(error)
        res.status(401).json({ success: false, message: "Token Expired or Invalid" })
    }
}

//Api for admin Login 
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body
        // adminController.js માં loginAdmin ફંક્શનમાં આ સુધારો કરો:
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.json({ success: true, token });
        }
        else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
// Api to get all doctors list for admin panal
const allDoctors = async (req, res) => {
    try {
        console.log("Hit all-doctors API"); // Log to verify connection
        const doctors = await doctorModel.find({}).select('-password')
        res.json({ success: true, doctors })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get all appointments list
const appointmentsAdmin = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({})
        res.json({ success: true, appointments })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API for admin dashboard data
const adminDashboard = async (req, res) => {
    try {
        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API for admin to cancel any appointment (no docId check)
const appointmentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body
        if (!appointmentId) {
            return res.json({ success: false, message: 'Appointment ID required' })
        }
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
        res.json({ success: true, message: 'Appointment cancelled by admin' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}




// API to get single doctor by ID (for edit page)
const getDoctorById = async (req, res) => {
    try {
        const { docId } = req.body
        const doctor = await doctorModel.findById(docId).select('-password')
        if (!doctor) return res.json({ success: false, message: 'Doctor not found' })
        res.json({ success: true, doctor })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update doctor details (admin only)
const updateDoctor = async (req, res) => {
    try {
        const { docId, name, email, speciality, degree, experience, about, fees, address, available, newPassword } = req.body
        const imageFile = req.file

        if (!docId) return res.json({ success: false, message: 'Doctor ID required' })

        // Build update object
        const updateData = {}
        if (name) updateData.name = name
        if (email) updateData.email = email
        if (speciality) updateData.speciality = speciality
        if (degree) updateData.degree = degree
        if (experience) updateData.experience = experience
        if (about) updateData.about = about
        if (fees) updateData.fees = Number(fees)
        if (address) updateData.address = typeof address === 'string' ? JSON.parse(address) : address
        if (available !== undefined) updateData.available = available

        // Upload new image if provided
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
            updateData.image = imageUpload.secure_url
        }

        // Update password if provided
        if (newPassword && newPassword.length >= 8) {
            const salt = await bcrypt.genSalt(10)
            updateData.password = await bcrypt.hash(newPassword, salt)
        } else if (newPassword && newPassword.length > 0) {
            return res.json({ success: false, message: 'Password must be at least 8 characters' })
        }

        await doctorModel.findByIdAndUpdate(docId, updateData)
        res.json({ success: true, message: 'Doctor Updated Successfully' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { addDoctor, loginAdmin, allDoctors, appointmentsAdmin, adminDashboard, appointmentCancel, getDoctorById, updateDoctor }
