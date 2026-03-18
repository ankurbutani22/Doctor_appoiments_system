import mongoose from 'mongoose'

const appointmentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    docId: { type: String, required: true },
    slotDate: { type: String, required: true },
    slotTime: { type: String, required: true },
    userData: { type: Object, required: true },
    docData: { type: Object, required: true },
    amount: { type: Number, required: true },
    date: { type: Number, required: true },
    cancelled: { type: Boolean, default: false },
    payment: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
    prescribedMedicines: { type: String, default: "" },
    reportUrl: { type: String, default: "" },
    reportData: { type: Buffer },
    reportFilename: { type: String, default: "" },
    reportMimeType: { type: String, default: "" },
})

// અહીં સુધારો કર્યો છે: mongoose.models.appointment
const appointmentModel = mongoose.models.appointment || mongoose.model('appointment', appointmentSchema)

export default appointmentModel;