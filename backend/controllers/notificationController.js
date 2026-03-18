import notificationModel from '../models/notificationModel.js'

// Patient notifications
const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.body
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000) // last 24 hours
    const notifications = await notificationModel
      .find({ userId, forRole: 'user', createdAt: { $gte: cutoff } })
      .sort({ createdAt: -1 })

    res.json({ success: true, notifications })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

const markUserNotificationsRead = async (req, res) => {
  try {
    const { userId } = req.body
    await notificationModel.updateMany({ userId, forRole: 'user', isRead: false }, { isRead: true })
    res.json({ success: true })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Doctor notifications
const getDoctorNotifications = async (req, res) => {
  try {
    const { docId } = req.body
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000) // last 24 hours
    const notifications = await notificationModel
      .find({ docId, forRole: 'doctor', createdAt: { $gte: cutoff } })
      .sort({ createdAt: -1 })

    res.json({ success: true, notifications })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

const markDoctorNotificationsRead = async (req, res) => {
  try {
    const { docId } = req.body
    await notificationModel.updateMany({ docId, forRole: 'doctor', isRead: false }, { isRead: true })
    res.json({ success: true })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export { getUserNotifications, markUserNotificationsRead, getDoctorNotifications, markDoctorNotificationsRead }
