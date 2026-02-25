import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {
    try {
        const { token } = req.headers 
        
        if (!token) {
            return res.json({ success: false, message: 'Not Authorized. Login Again' })
        }
        
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)

        // જો req.body undefined હોય તો તેને ખાલી object તરીકે સેટ કરો
        if (!req.body) {
            req.body = {};
        }

        req.body.userId = token_decode.id 
        
        next()
    } catch (error) {
        console.log("Auth Error:", error.message)
        res.json({ success: false, message: error.message })
    }
}

export default authUser