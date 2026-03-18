import doctorModel from "../models/doctorModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js"
import fs from 'fs'
import notificationModel from "../models/notificationModel.js"
import ratingModel from "../models/ratingModel.js"


const changeAvailablity = async (req, res) => {
    try {
        const { docId } = req.body
        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })

        // સાચો રિસ્પોન્સ
        res.json({ success: true, message: 'Availability Changed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const doctorList = async (req, res) => {
    try {
        // આ રીતે લખવાથી પાસવર્ડ સિવાયનો બધો ડેટા આવશે
        const doctors = await doctorModel.find({}).select(['-password', '-Email'])
        res.json({ success: true, doctors });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}
const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body
        const doctor = await doctorModel.findOne({ email })

        if (!doctor) {
            return res.json({ success: false, message: 'Invalid credentials' })
        }

        const isMatch = await bcrypt.compare(password, doctor.password)

        if (isMatch) {
            const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: 'Invalid credentials' })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const appointmentsDoctor = async (req, res) => {
    try {
        const { docId } = req.body
        const appointments = await appointmentModel.find({ docId })
        res.json({ success: true, appointments })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
    try {
        const { docId } = req.body
        const appointments = await appointmentModel.find({ docId })
        let earnings = 0
        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
        })
        let patients = []
        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })
        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        }
        res.json({ success: true, dashData })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get rating summary and all ratings for this doctor
const doctorRatings = async (req, res) => {
    try {
        const { docId } = req.body

        const doctor = await doctorModel.findById(docId).select('averageRating ratingCount')
        if (!doctor) {
            return res.json({ success: false, message: 'Doctor not found' })
        }

        const ratings = await ratingModel.find({ docId }).sort({ date: -1 }).select('-__v')

        res.json({
            success: true,
            ratingSummary: {
                averageRating: doctor.averageRating || 0,
                ratingCount: doctor.ratingCount || 0
            },
            ratings
        })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get doctor profile
const doctorProfile = async (req, res) => {
    try {
        const { docId } = req.body
        const profileData = await doctorModel.findById(docId).select('-password')
        res.json({ success: true, profileData })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update doctor profile data
const updateDoctorProfile = async (req, res) => {
    try {
        const { docId, fees, address, available } = req.body
        await doctorModel.findByIdAndUpdate(docId, { fees, address, available })
        res.json({ success: true, message: 'Profile Updated' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to mark appointment completed
const appointmentComplete = async (req, res) => {
    try {
        const { docId, appointmentId, prescribedMedicines } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, {
                isCompleted: true,
                prescribedMedicines: prescribedMedicines || ""
            })

            // notify patient that appointment is completed
            try {
                await notificationModel.create({
                    userId: appointmentData.userId,
                    forRole: 'user',
                    title: 'Appointment completed',
                    message: `Your appointment with ${appointmentData.docData.name} is marked as completed.`,
                })
            } catch (notifyErr) {
                console.log('Notification error (appointment complete):', notifyErr.message)
            }
            res.json({ success: true, message: 'Appointment Completed' })
        } else {
            res.json({ success: false, message: 'Mark Failed' })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to prescribe medicines for an already-completed appointment
const prescribeMedicines = async (req, res) => {
    try {
        const { docId, appointmentId, prescribedMedicines } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, {
                prescribedMedicines: prescribedMedicines || ""
            })

            // notify patient about new/updated prescription
            try {
                await notificationModel.create({
                    userId: appointmentData.userId,
                    forRole: 'user',
                    title: 'Prescription updated',
                    message: `New medicines have been prescribed for your appointment with ${appointmentData.docData.name}.`,
                })
            } catch (notifyErr) {
                console.log('Notification error (prescribe medicines):', notifyErr.message)
            }
            res.json({ success: true, message: 'Medicines Prescribed Successfully' })
        } else {
            res.json({ success: false, message: 'Failed to prescribe medicines' })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
            res.json({ success: true, message: 'Appointment Cancelled' })
        } else {
            res.json({ success: false, message: 'Cancellation Failed' })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API for uploading or updating an appointment report (PDF)
// Store the PDF bytes directly on the appointment document instead of Cloudinary
const uploadReport = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const file = req.file

        if (!file) {
            return res.json({ success: false, message: 'Report file is required' })
        }

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData) {
            return res.json({ success: false, message: 'Appointment not found' })
        }

        const fileBuffer = fs.readFileSync(file.path)

        await appointmentModel.findByIdAndUpdate(appointmentId, {
            reportData: fileBuffer,
            reportFilename: file.originalname || 'report.pdf',
            reportMimeType: file.mimetype || 'application/pdf',
            // reportUrl now just indicates presence
            reportUrl: 'local'
        })

        // notify patient that a new report is available
        try {
            await notificationModel.create({
                userId: appointmentData.userId,
                forRole: 'user',
                title: 'New report uploaded',
                message: `A new report has been uploaded for your appointment with ${appointmentData.docData.name}.`,
            })
        } catch (notifyErr) {
            console.log('Notification error (upload report):', notifyErr.message)
        }

        res.json({ success: true, message: 'Report uploaded successfully' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to delete/clear an uploaded report for an appointment
const deleteReport = async (req, res) => {
    try {
        const { appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData) {
            return res.json({ success: false, message: 'Appointment not found' })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, {
            reportUrl: '',
            reportData: undefined,
            reportFilename: '',
            reportMimeType: ''
        })

        res.json({ success: true, message: 'Report removed successfully' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Doctor download report endpoint (for doctor panel)
const downloadReportDoctor = async (req, res) => {
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

export {
    changeAvailablity, doctorList,
    loginDoctor, appointmentsDoctor, appointmentCancel, appointmentComplete,
    doctorDashboard, doctorProfile, updateDoctorProfile, prescribeMedicines,
    uploadReport, deleteReport, downloadReportDoctor, doctorRatings
}