import express from 'express'
import { getCoinBalance, addCoins, payWithCoins } from '../controllers/coinController.js'
import authUser from '../middlewares/authUser.js'

const coinRouter = express.Router()

// Get user coin balance
coinRouter.get('/balance', authUser, getCoinBalance)

// Add coins (fake purchase)
coinRouter.post('/add', authUser, addCoins)

// Pay with coins
coinRouter.post('/pay', authUser, payWithCoins)

export default coinRouter
