import mongoose from "mongoose";
import dotenv from 'dotenv'; // Add this line
dotenv.config()

const connectDB = async () => {
    mongoose.connection.on('connected',() => console.log("Database Connected"))
    await mongoose.connect(`${process.env.MONGODB_URL}/alphahealthcare`)
}

export default connectDB