import multer from "multer";
import fs from "fs";

// જો uploads ફોલ્ડર ન હોય તો ઓટોમેટિક બનાવી દેશે
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

const storage = multer.diskStorage({ 
    destination: function (req, file, callback) {
        callback(null, 'uploads/') 
    },
    filename: function(req, file, callback){
        callback(null, Date.now() + file.originalname)
    }
})

const uplod = multer({ storage })
export default uplod