import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
  userId: { type: String },
  docId: { type: String },
  forRole: { type: String, enum: ['user', 'doctor'], required: true },
  title: { type: String, required: true },
  message: { type: String },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
})

const notificationModel = mongoose.models.notification || mongoose.model('notification', notificationSchema)

export default notificationModel
