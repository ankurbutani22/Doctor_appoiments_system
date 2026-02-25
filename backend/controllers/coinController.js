import userModel from '../models/userModel.js'
import appointmentModel from '../models/appointmentModel.js'

// Get user coin balance
const getCoinBalance = async (req, res) => {
    try {
        const { userId } = req.body // This is set by authUser middleware
        const user = await userModel.findById(userId).select('coins')

        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        res.json({ success: true, coins: user.coins || 1000 })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Add coins to user (fake purchase)
const addCoins = async (req, res) => {
    try {
        const { userId, amount } = req.body

        if (!amount || amount <= 0) {
            return res.json({ success: false, message: 'Invalid amount' })
        }

        const user = await userModel.findById(userId)
        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        // Add coins to user balance
        const newBalance = user.coins + amount
        await userModel.findByIdAndUpdate(userId, { coins: newBalance })

        res.json({ success: true, message: 'Coins added successfully', coins: newBalance })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Pay with coins for appointment
const payWithCoins = async (req, res) => {
    try {
        const { userId, appointmentId } = req.body

        const appointment = await appointmentModel.findById(appointmentId)
        if (!appointment) {
            return res.json({ success: false, message: 'Appointment not found' })
        }

        if (appointment.cancelled) {
            return res.json({ success: false, message: 'Appointment is cancelled' })
        }

        if (appointment.payment) {
            return res.json({ success: false, message: 'Payment already completed' })
        }

        const user = await userModel.findById(userId)
        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        // Check if user has enough coins
        if (user.coins < appointment.amount) {
            return res.json({
                success: false,
                message: `Insufficient coins. You have ${user.coins} coins but need ${appointment.amount} coins.`
            })
        }

        // Deduct coins and mark payment as complete
        const newBalance = user.coins - appointment.amount
        await userModel.findByIdAndUpdate(userId, { coins: newBalance })
        await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true })

        res.json({
            success: true,
            message: 'Payment successful with coins',
            remainingCoins: newBalance
        })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { getCoinBalance, addCoins, payWithCoins }
