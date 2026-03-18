import express from 'express'
import { doctorList, loginDoctor, appointmentsDoctor, doctorDashboard, appointmentCancel, doctorProfile, updateDoctorProfile, appointmentComplete, prescribeMedicines, uploadReport } from "../controllers/doctorController.js"
import authDoctor from "../middlewares/authDoctor.js"
import uplod from "../middlewares/multer.js"

const doctorRouter = express.Router()
doctorRouter.get('/list', doctorList)
doctorRouter.post('/login', loginDoctor)
doctorRouter.get('/appointments', authDoctor, appointmentsDoctor)
doctorRouter.get('/dashboard', authDoctor, doctorDashboard)
doctorRouter.get('/profile', authDoctor, doctorProfile)
doctorRouter.post('/update-profile', authDoctor, updateDoctorProfile)
doctorRouter.post('/complete-appointment', authDoctor, appointmentComplete)
doctorRouter.post('/prescribe-medicines', authDoctor, prescribeMedicines)
doctorRouter.post('/cancel-appointment', authDoctor, appointmentCancel)
doctorRouter.post('/upload-report', authDoctor, uplod.single('report'), uploadReport)


export default doctorRouter