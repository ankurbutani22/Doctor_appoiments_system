import jwt from 'jsonwebtoken'

//admin authentication middleware
const authAdmin = async (req, res, next) => {
    try {
        // Headers માંથી 'atoken' મેળવો (બધું નાના અક્ષરોમાં)
        const { atoken } = req.headers 
        
        if (!atoken) {
            return res.json({ success: false, message: 'Not Authorized. Login Again' })
        }
        
        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET)

        // વેરિફિકેશન ચેક
        if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.json({ success: false, message: 'Not Authorized' })
        }
        
        next()
    } catch (error) {
        console.log("Auth Error:", error.message)
        res.json({ success: false, message: error.message })
    }
}

export default authAdmin