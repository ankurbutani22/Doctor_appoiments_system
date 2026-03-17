import express from 'express'
import { addDoctor, allDoctors, allPatients, loginAdmin, appointmentsAdmin, adminDashboard, appointmentCancel, getDoctorById, updateDoctor, removeDoctor } from '../controllers/adminController.js'
import uplod from '../middlewares/multer.js'
import authAdmin from '../middlewares/authAdmin.js'
import { changeAvailablity } from '../controllers/doctorController.js'

const adminRouter = express.Router()

adminRouter.post('/add-doctor', authAdmin, uplod.single('docImg'), addDoctor)
adminRouter.post('/login', loginAdmin)
adminRouter.post('/all-doctors', authAdmin, allDoctors)
adminRouter.post('/change-availability', authAdmin, changeAvailablity)
adminRouter.get('/appointments', authAdmin, appointmentsAdmin)
adminRouter.get('/dashboard', authAdmin, adminDashboard)
adminRouter.get('/patients', authAdmin, allPatients)
// fetch single doctor data for editing
adminRouter.post('/get-doctor', authAdmin, getDoctorById)
// update doctor details (image optional)
adminRouter.post('/update-doctor', authAdmin, uplod.single('docImg'), updateDoctor)
// remove doctor permanently
adminRouter.post('/remove-doctor', authAdmin, removeDoctor)
adminRouter.post('/cancel-appointment', authAdmin, appointmentCancel)


export default adminRouter

